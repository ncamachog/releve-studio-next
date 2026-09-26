import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { listBookings, bogotaToday, type Booking } from "@/lib/bookings";
import { listMessages } from "@/lib/messages";
import { CLASSES, money, timeLabel, type ClassKey } from "@/lib/data";
import { usingRedis } from "@/lib/store";
import LoginForm from "./LoginForm";
import { bookingDeleteAction, bookingStatusAction, logoutAction, messageDeleteAction, messageReadAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS: Record<Booking["status"], string> = { pendiente: "Pendiente", confirmada: "Confirmada", pagada: "Pagada", cancelada: "Cancelada" };
const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const dayLabel = (date: string) => {
  const d = new Date(`${date}T12:00:00Z`);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]}`;
};
const waLink = (phone: string) => {
  const n = phone.replace(/\D/g, "");
  return `https://wa.me/${n.length === 10 ? "57" + n : n}`;
};
const when = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; ver?: string }> }) {
  if (!adminConfigured()) {
    return <div className="ad-login"><h1>Panel sin configurar</h1><p>Define la variable de entorno <code>ADMIN_PASSWORD</code>.</p></div>;
  }
  if (!(await isAdmin())) return <LoginForm />;

  const { tab = "reservas", ver = "proximas" } = await searchParams;
  const [bookings, messages] = await Promise.all([listBookings(), listMessages()]);
  const today = bogotaToday();
  const unread = messages.filter((m) => !m.read).length;

  const shown = bookings
    .filter((b) => (ver === "todas" ? true : b.date >= today && b.status !== "cancelada"))
    .sort((a, b) => (ver === "todas" ? (b.date + b.start).localeCompare(a.date + a.start) : (a.date + a.start).localeCompare(b.date + b.start)));

  // Agrupa por día y por clase (hora) para ver quién asiste a cada una.
  const days = new Map<string, Map<string, Booking[]>>();
  for (const b of shown) {
    const slots = days.get(b.date) ?? new Map<string, Booking[]>();
    const list = slots.get(b.start) ?? [];
    list.push(b);
    slots.set(b.start, list);
    days.set(b.date, slots);
  }

  const pending = new Set(bookings.filter((b) => b.status === "pendiente").map((b) => b.ref)).size;
  const upcoming = bookings.filter((b) => b.date >= today && b.status !== "cancelada").length;

  return (
    <div className="ad-wrap">
      <header className="ad-top">
        <div>
          <p className="ad-brand">Relevé · Panel</p>
          <h1>Reservas y mensajes</h1>
        </div>
        <div className="ad-top__right">
          <Link href="/" className="ad-link">Ver sitio</Link>
          <form action={logoutAction}><button className="ad-btn ad-btn--ghost" type="submit">Salir</button></form>
        </div>
      </header>

      {!usingRedis && <p className="ad-warn">Modo local: los datos se guardan en un archivo. En producción conecta Redis (ver README).</p>}

      <div className="ad-cards">
        <div className="ad-card"><span>Clases próximas</span><b>{upcoming}</b></div>
        <div className="ad-card"><span>Reservas por confirmar</span><b>{pending}</b></div>
        <div className="ad-card"><span>Mensajes sin leer</span><b>{unread}</b></div>
      </div>

      <nav className="ad-tabs">
        <Link href="/admin?tab=reservas" className={tab === "reservas" ? "is-on" : ""}>Reservas</Link>
        <Link href="/admin?tab=mensajes" className={tab === "mensajes" ? "is-on" : ""}>Mensajes{unread > 0 && <i>{unread}</i>}</Link>
      </nav>

      {tab === "mensajes" ? (
        <section>
          {!messages.length && <p className="ad-empty">Aún no han llegado mensajes.</p>}
          {messages.map((m) => (
            <article key={m.id} className={`ad-msg${m.read ? "" : " is-new"}`}>
              <div className="ad-msg__head">
                <div>
                  <b>{m.name}</b> {!m.read && <span className="ad-dot">Nuevo</span>}
                  <small>{when(m.createdAt)}</small>
                </div>
                <div className="ad-actions">
                  <form action={messageReadAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={m.read ? "0" : "1"} />
                    <button className="ad-btn ad-btn--ghost">{m.read ? "Marcar sin leer" : "Marcar leído"}</button>
                  </form>
                  <form action={messageDeleteAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="ad-btn ad-btn--danger">Eliminar</button>
                  </form>
                </div>
              </div>
              <p className="ad-msg__body">{m.message}</p>
              <p className="ad-msg__contact">
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.phone && <> · <a href={waLink(m.phone)} target="_blank" rel="noopener noreferrer">{m.phone} (WhatsApp)</a></>}
              </p>
            </article>
          ))}
        </section>
      ) : (
        <section>
          <div className="ad-filter">
            <Link href="/admin?tab=reservas&ver=proximas" className={ver !== "todas" ? "is-on" : ""}>Próximas</Link>
            <Link href="/admin?tab=reservas&ver=todas" className={ver === "todas" ? "is-on" : ""}>Todas</Link>
          </div>
          {!days.size && <p className="ad-empty">No hay reservas para mostrar.</p>}
          {[...days.entries()].map(([date, slots]) => (
            <div key={date} className="ad-day">
              <h2>{dayLabel(date)}{date === today && <span className="ad-dot">Hoy</span>}</h2>
              {[...slots.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([start, list]) => (
                <div key={start} className="ad-slot">
                  <div className="ad-slot__title">
                    <b>{timeLabel(start)} · {CLASSES[list[0].classKey as ClassKey]?.label ?? list[0].classKey}</b>
                    <small>{list.filter((x) => x.status !== "cancelada").length} inscritas</small>
                  </div>
                  {list.map((b) => (
                    <div key={b.id} className="ad-row">
                      <div className="ad-row__who">
                        <b>{b.name}</b>
                        <small>
                          <a href={waLink(b.phone)} target="_blank" rel="noopener noreferrer">{b.phone}</a> · {b.email}
                        </small>
                      </div>
                      <div className="ad-row__plan">
                        {b.plan === "monthly" ? "Mes ilimitado" : "Individual"}
                        <small>{b.amount ? money(b.amount) : "incluida en el mes"} · {b.ref}</small>
                      </div>
                      <form action={bookingStatusAction} className="ad-row__status">
                        <input type="hidden" name="ref" value={b.ref} />
                        <span className={`ad-badge ad-${b.status}`}>{STATUS[b.status]}</span>
                        <select name="status" defaultValue={b.status} aria-label="Cambiar estado">
                          {Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </select>
                        <button className="ad-btn">Guardar</button>
                      </form>
                      <form action={bookingDeleteAction}>
                        <input type="hidden" name="ref" value={b.ref} />
                        <button className="ad-btn ad-btn--danger" title="Elimina toda la reserva (todas sus clases)">Eliminar</button>
                      </form>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
