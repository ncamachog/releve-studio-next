"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  CAPACITY, DAYS_AHEAD, LEAD_MINUTES, PRICE_MONTHLY, PRICE_SINGLE,
  money, slotsForDate, timeLabel, whatsappUrl, type ClassKey, type Slot,
} from "@/lib/data";

type Plan = "single" | "monthly";
interface Picked { date: string; start: string; end: string; class: ClassKey }
interface Done { ref: string; total: number; count: number; name: string }

const BOGOTA_OFFSET_MS = 5 * 3600e3;
const dayMs = 864e5;
const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * dayMs);
const mondayOf = (d: Date) => addDays(d, -((d.getUTCDay() + 6) % 7));
const dowIndex = (d: Date) => (d.getUTCDay() + 6) % 7; // 0 = lunes
const slotStartMs = (date: string, t: string) => parse(date).getTime() + Number(t.slice(0, 2)) * 36e5 + Number(t.slice(3)) * 6e4 + BOGOTA_OFFSET_MS;

export default function BookingApp() {
  const { locale, t: { booking: b } } = useLocale();
  const [today] = useState(() => parse(new Date(Date.now() - BOGOTA_OFFSET_MS).toISOString().slice(0, 10)));
  const maxDate = useMemo(() => addDays(today, DAYS_AHEAD), [today]);
  const minWeek = useMemo(() => mondayOf(today), [today]);
  const maxWeek = useMemo(() => mondayOf(maxDate), [maxDate]);

  const [plan, setPlan] = useState<Plan>("single");
  const [week, setWeek] = useState<Date>(minWeek);
  const [day, setDay] = useState<Date>(() => (today.getUTCDay() === 0 ? addDays(today, 1) : today));
  const [picked, setPicked] = useState<Picked[]>([]);
  const [booked, setBooked] = useState<Record<string, number>>({});
  const [now, setNow] = useState<number>(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  const loadAvailability = useCallback(async () => {
    try {
      const r = await fetch("/api/availability", { cache: "no-store" });
      const j = (await r.json()) as { booked?: Record<string, number> };
      setBooked(j.booked ?? {});
    } catch {
      /* sin conexión: se muestran todos los cupos */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    void loadAvailability();
  }, [loadAvailability]);

  const fmtRange = (a: Date, z: Date) =>
    locale === "en"
      ? `${b.months[a.getUTCMonth()]} ${a.getUTCDate()} – ${b.months[z.getUTCMonth()]} ${z.getUTCDate()}`
      : `${a.getUTCDate()} ${b.months[a.getUTCMonth()]} – ${z.getUTCDate()} ${b.months[z.getUTCMonth()]}`;
  const fmtLong = (d: Date, withDe: boolean) => {
    const wd = b.dayLong[dowIndex(d)];
    const m = b.months[d.getUTCMonth()];
    return locale === "en" ? `${wd}, ${m} ${d.getUTCDate()}` : `${wd} ${d.getUTCDate()}${withDe ? " de " : " "}${m}`;
  };

  const dayKey = keyOf(day);
  const slots = slotsForDate(dayKey);
  const isPicked = (date: string, s: Slot) => picked.some((p) => p.date === date && p.start === s.start);
  const isClosed = (date: string, s: Slot) => now > 0 && slotStartMs(date, s.start) < now + LEAD_MINUTES * 6e4;
  const left = (date: string, s: Slot) => CAPACITY - (booked[`${date}|${s.start}`] ?? 0);

  const toggle = (date: string, s: Slot) => {
    setPicked((prev) => {
      const exists = prev.some((p) => p.date === date && p.start === s.start);
      const next = exists ? prev.filter((p) => !(p.date === date && p.start === s.start)) : [...prev, { date, start: s.start, end: s.end, class: s.class }];
      return next.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    });
  };

  const total = !picked.length ? 0 : plan === "monthly" ? PRICE_MONTHLY : picked.length * PRICE_SINGLE;
  const weekEnd = addDays(week, 5);

  const goPrev = () => {
    const w = addDays(week, -7);
    setWeek(w);
    const d = w < today ? today : w;
    setDay(d.getUTCDay() === 0 ? addDays(d, 1) : d);
  };
  const goNext = () => {
    const w = addDays(week, 7);
    setWeek(w);
    setDay(w);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!picked.length) return;
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), email: f.get("email"), phone: f.get("phone"), website: f.get("website"),
          plan, items: picked.map((p) => ({ date: p.date, start: p.start })),
        }),
      });
      const j = (await r.json()) as { message?: string; ref?: string; total?: number; count?: number };
      if (!r.ok) {
        setError(j.message ?? b.errFail);
        await loadAvailability();
      } else {
        setDone({ ref: j.ref ?? "", total: j.total ?? 0, count: j.count ?? 0, name: String(f.get("name") ?? "") });
        setPicked([]);
        await loadAvailability();
      }
    } catch {
      setError(b.errOffline);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rb-wrap" id="reservar">
      {/* 1. Plan */}
      <div className="rb-step" data-reveal>
        <h2 className="rb-step__title"><span>1</span> {b.step1}</h2>
        <div className="rb-plans" role="radiogroup" aria-label={b.planAria}>
          <label className={`rb-plan${plan === "single" ? " is-active" : ""}`}>
            <input type="radio" name="plan" value="single" checked={plan === "single"} onChange={() => setPlan("single")} />
            <span className="rb-plan__name">{b.single}</span>
            <span className="rb-plan__price">{money(PRICE_SINGLE)}</span>
            <span className="rb-plan__note">{b.singleNote}</span>
          </label>
          <label className={`rb-plan${plan === "monthly" ? " is-active" : ""}`}>
            <input type="radio" name="plan" value="monthly" checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
            <span className="rb-plan__badge">{b.bestValue}</span>
            <span className="rb-plan__name">{b.monthly}</span>
            <span className="rb-plan__price">{money(PRICE_MONTHLY)}</span>
            <span className="rb-plan__note">{b.monthlyNote}</span>
          </label>
        </div>
      </div>

      <div className="rb-grid">
        <div className="rb-main">
          {/* 2. Calendario */}
          <div className="rb-step" data-reveal>
            <h2 className="rb-step__title"><span>2</span> {b.step2}</h2>

            <div className="rb-weeknav">
              <button type="button" className="rb-navbtn" onClick={goPrev} disabled={week <= minWeek} aria-label={b.prevWeek}>←</button>
              <p className="rb-weeklabel" aria-live="polite">
                {fmtRange(week, weekEnd)}
              </p>
              <button type="button" className="rb-navbtn" onClick={goNext} disabled={week >= maxWeek} aria-label={b.nextWeek}>→</button>
            </div>

            <div className="rb-days" role="tablist" aria-label={b.daysAria}>
              {b.dayShort.map((name, i) => {
                const d = addDays(week, i);
                const k = keyOf(d);
                const out = d < today || d > maxDate;
                const count = picked.filter((p) => p.date === k).length;
                return (
                  <button key={k} type="button" role="tab" disabled={out} aria-selected={dayKey === k}
                    className={`rb-day${dayKey === k ? " is-active" : ""}${out ? " is-out" : ""}`}
                    onClick={() => setDay(d)}>
                    <small>{name}</small>
                    <strong>{d.getUTCDate()}</strong>
                    {count > 0 && <i>{count}</i>}
                  </button>
                );
              })}
            </div>

            <p className="rb-hours">{b.hours}</p>

            <div className="rb-slots" aria-live="polite">
              <h3 className="rb-slots__head">{fmtLong(day, true)}</h3>
              {!slots.length ? (
                <p className="rb-empty">{b.noClasses}</p>
              ) : (
                <div className="rb-slotlist">
                  {slots.map((s, i) => {
                    const cls = b.classes[s.class];
                    const closed = isClosed(dayKey, s);
                    const l = left(dayKey, s);
                    const full = l <= 0;
                    const sel = isPicked(dayKey, s);
                    const off = closed || full;
                    return (
                      <button key={s.start} type="button" disabled={off}
                        className={`rb-slot${sel ? " is-picked" : ""}${off ? " is-off" : ""}`}
                        style={{ ["--d" as string]: `${i * 60}ms` }}
                        onClick={() => toggle(dayKey, s)}>
                        <span className="rb-slot__time">{timeLabel(s.start)}<em>{timeLabel(s.end)}</em></span>
                        <span className="rb-slot__info"><b>{cls.label}</b><small>{cls.desc}</small></span>
                        <span className="rb-slot__state">
                          {sel ? b.picked : closed ? b.closed : full ? b.full : l <= 3 ? b.fewLeft(l) : b.spots(l)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Resumen + datos */}
        <aside className="rb-side">
          {!done ? (
            <form className="rb-summary" onSubmit={onSubmit} noValidate={false}>
              <h2 className="rb-step__title"><span>3</span> {b.step3}</h2>

              <div className="rb-chosen">
                {!picked.length ? (
                  <p className="rb-empty">{b.none}</p>
                ) : (
                  picked.map((p) => {
                    const d = parse(p.date);
                    return (
                      <div className="rb-item" key={p.date + p.start}>
                        <div>
                          <b>{b.classes[p.class].label}</b>
                          <small>{fmtLong(d, false)} · {timeLabel(p.start)}</small>
                        </div>
                        <button type="button" aria-label={b.remove} onClick={() => setPicked((prev) => prev.filter((x) => !(x.date === p.date && x.start === p.start)))}>×</button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="rb-total">
                <span>{b.total}</span>
                <strong>{money(total)}{plan === "monthly" && picked.length > 0 ? b.unlimited : ""}</strong>
              </div>

              <label className="rb-field"><span>{b.fullName}</span><input type="text" name="name" autoComplete="name" required /></label>
              <label className="rb-field"><span>{b.email}</span><input type="email" name="email" autoComplete="email" required /></label>
              <label className="rb-field"><span>{b.phone}</span><input type="tel" name="phone" autoComplete="tel" required /></label>
              <input type="text" name="website" className="rb-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {error && <p className="rb-error" role="alert">{error}</p>}
              <button type="submit" className="r-btn r-btn--primary rb-submit" disabled={!picked.length || busy}>
                {busy ? b.booking : b.confirm}
              </button>
              <p className="rb-fine">{b.fine}</p>
            </form>
          ) : (
            <div className="rb-done">
              <div className="rb-done__check">✓</div>
              <h2 className="rb-done__title">{b.doneTitle}</h2>
              <p>
                {b.doneText(done.name.split(" ")[0], done.ref, done.count, money(done.total))}
              </p>
              <a className="r-btn r-btn--primary" href={whatsappUrl(b.doneWaMsg(done.ref))} target="_blank" rel="noopener noreferrer">
                {b.doneWa}
              </a>
              <button type="button" className="r-link rb-again" onClick={() => setDone(null)}>{b.again}</button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
