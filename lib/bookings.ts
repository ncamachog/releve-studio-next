import { CAPACITY, CLASSES, DAYS_AHEAD, LEAD_MINUTES, PRICE_MONTHLY, PRICE_SINGLE, slotsForDate } from "@/lib/data";

/**
 * Almacén de reservas.
 *
 * ⚠️ Vive en memoria del servidor: sirve para desarrollo y demostración, pero en Vercel
 * (serverless) NO persiste entre invocaciones. Para producción sustituye `store` por una
 * base de datos (Vercel KV / Upstash Redis, Postgres, etc.) manteniendo esta misma interfaz.
 */
export interface Booking {
  id: string;
  ref: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  plan: "single" | "monthly";
  classKey: string;
  date: string;
  start: string;
  end: string;
  amount: number;
  status: "pendiente" | "confirmada" | "pagada" | "cancelada";
}

const globalStore = globalThis as unknown as { __releveBookings?: Booking[] };
const store: Booking[] = (globalStore.__releveBookings ??= []);

const BOGOTA_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC-5, sin horario de verano

export const bogotaNow = (): number => Date.now();

export const bogotaToday = (): string => new Date(Date.now() - BOGOTA_OFFSET_MS).toISOString().slice(0, 10);

const addDays = (date: string, n: number): string => new Date(new Date(`${date}T12:00:00Z`).getTime() + n * 864e5).toISOString().slice(0, 10);

export function slotStartMs(date: string, start: string): number {
  const [h, m] = start.split(":").map(Number);
  return new Date(`${date}T00:00:00Z`).getTime() + h * 36e5 + m * 6e4 + BOGOTA_OFFSET_MS;
}

export function bookedCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const b of store) {
    if (b.status === "cancelada") continue;
    const k = `${b.date}|${b.start}`;
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export interface BookInput {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  plan?: unknown;
  website?: unknown;
  items?: unknown;
}

export type BookResult =
  | { ok: true; ref: string; total: number; count: number }
  | { ok: false; status: number; message: string };

const fail = (status: number, message: string): BookResult => ({ ok: false, status, message });

export function createBooking(input: BookInput): BookResult {
  if (input.website) return fail(400, "No se pudo procesar la solicitud.");

  const name = String(input.name ?? "").trim().slice(0, 120);
  const email = String(input.email ?? "").trim().toLowerCase().slice(0, 120);
  const phone = String(input.phone ?? "").replace(/[^0-9+ ]/g, "").slice(0, 40);
  const plan = input.plan === "monthly" ? "monthly" : "single";
  const items = Array.isArray(input.items) ? (input.items as { date?: unknown; start?: unknown }[]) : [];

  if (name.length < 3 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.replace(/\D/g, "").length < 7) {
    return fail(400, "Revisa tu nombre, correo y teléfono.");
  }
  if (!items.length || items.length > 40) return fail(400, "Selecciona al menos una clase en el calendario.");

  const today = bogotaToday();
  const max = addDays(today, DAYS_AHEAD);
  const counts = bookedCounts();
  const seen = new Set<string>();
  const valid: { date: string; classKey: string; start: string; end: string }[] = [];

  for (const it of items) {
    const date = String(it.date ?? "");
    const start = String(it.start ?? "");
    const key = `${date}|${start}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || date > max) return fail(400, "Una de las fechas no es válida.");
    const slot = slotsForDate(date).find((s) => s.start === start);
    if (!slot) return fail(400, "Una de las clases ya no existe en ese horario.");
    if (slotStartMs(date, start) < bogotaNow() + LEAD_MINUTES * 60_000) {
      return fail(400, "Una de las clases ya no admite reservas (cierra 1 hora antes).");
    }
    if ((counts[key] ?? 0) >= CAPACITY) {
      return fail(409, `La clase de ${CLASSES[slot.class].label} del ${date} ya está completa.`);
    }
    valid.push({ date, classKey: slot.class, start: slot.start, end: slot.end });
  }

  const ref = "RV-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  let total = 0;
  valid.forEach((v, i) => {
    const amount = plan === "monthly" ? (i === 0 ? PRICE_MONTHLY : 0) : PRICE_SINGLE;
    total += amount;
    store.push({
      id: `${ref}-${i}`,
      ref,
      createdAt: new Date().toISOString(),
      name,
      email,
      phone,
      plan,
      classKey: v.classKey,
      date: v.date,
      start: v.start,
      end: v.end,
      amount,
      status: "pendiente",
    });
  });

  return { ok: true, ref, total, count: valid.length };
}
