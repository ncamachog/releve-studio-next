"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAPACITY, CLASSES, DAYS_AHEAD, LEAD_MINUTES, PRICE_MONTHLY, PRICE_SINGLE,
  money, slotsForDate, timeLabel, whatsappUrl, type ClassKey, type Slot,
} from "@/lib/data";

type Plan = "single" | "monthly";
interface Picked { date: string; start: string; end: string; class: ClassKey }
interface Done { ref: string; total: number; count: number; name: string }

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_LONG = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

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
        setError(j.message ?? "No pudimos completar la reserva.");
        await loadAvailability();
      } else {
        setDone({ ref: j.ref ?? "", total: j.total ?? 0, count: j.count ?? 0, name: String(f.get("name") ?? "") });
        setPicked([]);
        await loadAvailability();
      }
    } catch {
      setError("Sin conexión. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rb-wrap" id="reservar">
      {/* 1. Plan */}
      <div className="rb-step" data-reveal>
        <h2 className="rb-step__title"><span>1</span> Elige tu plan</h2>
        <div className="rb-plans" role="radiogroup" aria-label="Plan">
          <label className={`rb-plan${plan === "single" ? " is-active" : ""}`}>
            <input type="radio" name="plan" value="single" checked={plan === "single"} onChange={() => setPlan("single")} />
            <span className="rb-plan__name">Clase individual</span>
            <span className="rb-plan__price">{money(PRICE_SINGLE)}</span>
            <span className="rb-plan__note">por clase · elige las que quieras</span>
          </label>
          <label className={`rb-plan${plan === "monthly" ? " is-active" : ""}`}>
            <input type="radio" name="plan" value="monthly" checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
            <span className="rb-plan__badge">Mejor valor</span>
            <span className="rb-plan__name">Mes ilimitado</span>
            <span className="rb-plan__price">{money(PRICE_MONTHLY)}</span>
            <span className="rb-plan__note">clases ilimitadas durante 30 días</span>
          </label>
        </div>
      </div>

      <div className="rb-grid">
        <div className="rb-main">
          {/* 2. Calendario */}
          <div className="rb-step" data-reveal>
            <h2 className="rb-step__title"><span>2</span> Escoge fecha y clase</h2>

            <div className="rb-weeknav">
              <button type="button" className="rb-navbtn" onClick={goPrev} disabled={week <= minWeek} aria-label="Semana anterior">←</button>
              <p className="rb-weeklabel" aria-live="polite">
                {week.getUTCDate()} {MONTHS[week.getUTCMonth()]} – {weekEnd.getUTCDate()} {MONTHS[weekEnd.getUTCMonth()]}
              </p>
              <button type="button" className="rb-navbtn" onClick={goNext} disabled={week >= maxWeek} aria-label="Semana siguiente">→</button>
            </div>

            <div className="rb-days" role="tablist" aria-label="Días de la semana">
              {DAY_NAMES.map((name, i) => {
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

            <p className="rb-hours">Lunes a viernes 3:00 pm – 8:00 pm · Sábados 7:00 am – 3:00 pm</p>

            <div className="rb-slots" aria-live="polite">
              <h3 className="rb-slots__head">{DAY_LONG[dowIndex(day)]} {day.getUTCDate()} de {MONTHS[day.getUTCMonth()]}</h3>
              {!slots.length ? (
                <p className="rb-empty">No hay clases este día.</p>
              ) : (
                <div className="rb-slotlist">
                  {slots.map((s, i) => {
                    const cls = CLASSES[s.class];
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
                          {sel ? "✓ Elegida" : closed ? "Cerrada" : full ? "Completa" : l <= 3 ? `¡Quedan ${l}!` : `${l} cupos`}
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
              <h2 className="rb-step__title"><span>3</span> Tus datos</h2>

              <div className="rb-chosen">
                {!picked.length ? (
                  <p className="rb-empty">Aún no has elegido clases.</p>
                ) : (
                  picked.map((p) => {
                    const d = parse(p.date);
                    return (
                      <div className="rb-item" key={p.date + p.start}>
                        <div>
                          <b>{CLASSES[p.class].label}</b>
                          <small>{DAY_LONG[dowIndex(d)]} {d.getUTCDate()} {MONTHS[d.getUTCMonth()]} · {timeLabel(p.start)}</small>
                        </div>
                        <button type="button" aria-label="Quitar" onClick={() => setPicked((prev) => prev.filter((x) => !(x.date === p.date && x.start === p.start)))}>×</button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="rb-total">
                <span>Total</span>
                <strong>{money(total)}{plan === "monthly" && picked.length > 0 ? " · mes ilimitado" : ""}</strong>
              </div>

              <label className="rb-field"><span>Nombre completo</span><input type="text" name="name" autoComplete="name" required /></label>
              <label className="rb-field"><span>Correo</span><input type="email" name="email" autoComplete="email" required /></label>
              <label className="rb-field"><span>Teléfono / WhatsApp</span><input type="tel" name="phone" autoComplete="tel" required /></label>
              <input type="text" name="website" className="rb-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {error && <p className="rb-error" role="alert">{error}</p>}
              <button type="submit" className="r-btn r-btn--primary rb-submit" disabled={!picked.length || busy}>
                {busy ? "Reservando…" : "Confirmar reserva"}
              </button>
              <p className="rb-fine">Te contactaremos por WhatsApp o correo para confirmar y coordinar el pago.</p>
            </form>
          ) : (
            <div className="rb-done">
              <div className="rb-done__check">✓</div>
              <h2 className="rb-done__title">¡Reserva recibida!</h2>
              <p>
                Gracias, {done.name.split(" ")[0]}. Tu referencia es <strong>{done.ref}</strong> ({done.count} {done.count === 1 ? "clase" : "clases"} · {money(done.total)}).
              </p>
              <a className="r-btn r-btn--primary" href={whatsappUrl(`Hola, hice la reserva ${done.ref} en Relevé. Quiero confirmar y coordinar el pago.`)} target="_blank" rel="noopener noreferrer">
                Confirmar por WhatsApp
              </a>
              <button type="button" className="r-link rb-again" onClick={() => setDone(null)}>Hacer otra reserva</button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
