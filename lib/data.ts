export const SITE = {
  name: "Relevé Ballet Studio",
  short: "Relevé",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "573103351883",
  whatsappMessage: "Hola quiero mas información sobre Relevé Ballet Studio.",
};

export function whatsappUrl(message: string = SITE.whatsappMessage): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/reservar-clase", label: "Reservar clase" },
  { href: "/tienda", label: "Tienda" },
] as const;

/* ------------------------------------------------------------------ Reservas */

export const PRICE_SINGLE = 45000;
export const PRICE_MONTHLY = 250000;
export const CAPACITY = 10;
export const LEAD_MINUTES = 60;
export const DAYS_AHEAD = 60;

export type ClassKey = "baby" | "infantil1" | "infantil2" | "junior" | "salsa" | "tango" | "yoga";

export interface ClassInfo {
  label: string;
  desc: string;
}

export const CLASSES: Record<ClassKey, ClassInfo> = {
  baby: { label: "Baby Ballet", desc: "Menores de 7 años, con acompañante" },
  infantil1: { label: "Ballet Infantil 1", desc: "Iniciación técnica · 7 a 9 años" },
  infantil2: { label: "Ballet Infantil 2", desc: "Técnica intermedia · 9 a 11 años" },
  junior: { label: "Ballet Junior", desc: "Técnica avanzada · desde 12 años" },
  salsa: { label: "Salsa", desc: "Ritmo y coordinación · desde 13 años" },
  tango: { label: "Tango", desc: "Abrazo, postura y musicalidad" },
  yoga: { label: "Yoga", desc: "Flexibilidad, respiración y calma" },
};

export interface Slot {
  class: ClassKey;
  start: string;
  end: string;
}

const addHour = (hhmm: string): string => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/**
 * Clases de 1 hora con 15 min de descanso (una cada 75 min).
 * Lunes–Viernes 3:00–8:00 pm · Sábado 7:00 am–3:00 pm. Clave: 1 = lunes … 6 = sábado.
 */
const WEEKDAY_STARTS = ["15:00", "16:15", "17:30", "18:45"];
const SATURDAY_STARTS = ["07:00", "08:15", "09:30", "10:45", "12:00", "13:15"];

const PLAN: Record<number, ClassKey[]> = {
  1: ["baby", "infantil1", "junior", "yoga"],
  2: ["infantil1", "infantil2", "salsa", "tango"],
  3: ["baby", "infantil2", "junior", "yoga"],
  4: ["infantil1", "infantil2", "tango", "salsa"],
  5: ["baby", "infantil1", "junior", "salsa"],
  6: ["yoga", "baby", "infantil1", "infantil2", "junior", "tango"],
};

export const SCHEDULE: Record<number, Slot[]> = Object.fromEntries(
  Object.entries(PLAN).map(([dow, keys]) => {
    const starts = Number(dow) === 6 ? SATURDAY_STARTS : WEEKDAY_STARTS;
    return [dow, keys.map((k, i): Slot => ({ class: k, start: starts[i], end: addHour(starts[i]) }))];
  }),
);

/** Clases de una fecha `YYYY-MM-DD` (domingo → vacío). */
export function slotsForDate(date: string): Slot[] {
  const d = new Date(`${date}T12:00:00Z`);
  const dow = ((d.getUTCDay() + 6) % 7) + 1;
  return SCHEDULE[dow] ?? [];
}

export const money = (n: number): string => "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const timeLabel = (t: string): string => {
  const h = Number(t.slice(0, 2));
  return `${((h + 11) % 12) + 1}:${t.slice(3)} ${h < 12 ? "am" : "pm"}`;
};

/* ------------------------------------------------------------------ Programas */

export interface Program {
  title: string;
  body: string;
  href: string;
  cta: string;
  accent?: boolean;
}

export const PROGRAMS: Program[] = [
  { title: "Baby Ballet", body: "Primeros pasos en el mundo del ballet para niñas menores de 7 años, acompañadas por sus padres. Movimiento, música y juego para despertar el amor por la danza.", href: "/reservar-clase", cta: "Reservar clase" },
  { title: "Ballet Clásico", body: "Formación técnica progresiva en Infantil 1, Infantil 2 y Junior: posiciones, alineación, musicalidad y expresión artística en cada nivel.", href: "/reservar-clase", cta: "Reservar clase", accent: true },
  { title: "Barre & Técnica", body: "Trabajo en barra que fortalece, alinea y perfecciona cada movimiento — la base de una técnica sólida y una postura elegante.", href: "/reservar-clase", cta: "Reservar clase" },
  { title: "Yoga", body: "Clase para jóvenes y adultos desde los 13 años. Flexibilidad, respiración y fuerza consciente en un espacio sereno, ideal para complementar el ballet o empezar de cero.", href: "/reservar-clase", cta: "Reservar clase" },
  { title: "Salsa", body: "Para jóvenes y adultos desde los 13 años, sin experiencia previa. Ritmo, coordinación y mucha energía: aprende pasos, giros y baile en pareja en un ambiente divertido.", href: "/reservar-clase", cta: "Reservar clase", accent: true },
  { title: "Tango", body: "Para jóvenes y adultos desde los 13 años. Abrazo, postura, caminata y musicalidad: la elegancia del tango paso a paso, con o sin pareja.", href: "/reservar-clase", cta: "Reservar clase" },
];

export const EXPERIENCE = [
  { title: "Técnica", body: "Formación progresiva y estructurada, con atención personalizada en cada clase." },
  { title: "Comunidad", body: "Un ambiente cálido donde cada bailarina se siente acompañada, dentro y fuera de la barra." },
  { title: "Disciplina", body: "Hábitos de constancia, postura y compromiso que trascienden el estudio." },
  { title: "Elegancia", body: "Una experiencia cuidada en cada detalle: del espacio a cada movimiento." },
];

export const STATS = [
  { to: 40, prefix: "+", suffix: "", caption: "Años de ser fundada" },
  { to: 300, prefix: "", suffix: "+", caption: "Alumnas que han formado parte de nuestra historia" },
  { to: 15000, prefix: "", suffix: "+", caption: "Clases impartidas" },
  { to: 87, prefix: "", suffix: "+", caption: "Presentaciones y shows realizados en Colombia" },
];

export const MARQUEE = ["Baby Ballet", "Ballet Infantil", "Ballet Junior", "Salsa", "Tango", "Yoga", "Barre"];

/* ------------------------------------------------------------------ Servicios */

export interface Service {
  id: string;
  kicker: string;
  title: string;
  img: string;
  text: string;
  items: string[];
  msg: string;
}

export const SERVICES: Service[] = [
  {
    id: "quinceaneras",
    kicker: "Quince años",
    title: "Coreografía para quinceañeras",
    img: "/img/serv-quince.jpg",
    text: "El vals y el baile sorpresa son el corazón de tu fiesta. Diseñamos una coreografía a tu medida —con tu música, tu estilo y tu corte— y la ensayamos contigo hasta que te sientas segura y radiante.",
    items: ["Vals, baile sorpresa o show a tu gusto", "Montaje para la quinceañera, la corte y familiares", "Ensayos en el estudio, en grupo o individuales", "Acompañamiento hasta el día del evento"],
    msg: "Hola, quiero cotizar una coreografía para unos quince años.",
  },
  {
    id: "matrimonios",
    kicker: "Matrimonios",
    title: "Coreografía para matrimonios",
    img: "/img/serv-matrimonio.jpg",
    text: "Tu primer baile, como lo soñaste. Creamos una coreografía elegante y natural para los novios, sin necesidad de experiencia, y también para padres, padrinos y cortejo si quieres sorprender.",
    items: ["Primer baile de novios personalizado", "Coreografías para padres, familiares o cortejo", "Adaptada a tu canción y a tu nivel", "Ensayos con horarios flexibles"],
    msg: "Hola, quiero cotizar una coreografía para un matrimonio.",
  },
  {
    id: "empresariales",
    kicker: "Empresas",
    title: "Clases empresariales de salsa y yoga",
    img: "/img/serv-empresarial.jpg",
    text: "Bienestar, integración y buen ambiente para tu equipo. Clases de salsa o yoga para cualquier nivel, con dos modalidades para que elijas la que mejor se adapte a tu empresa.",
    items: ["Vamos a tu empresa: llevamos la clase a tu oficina o evento", "Tu empresa viene al estudio: tu equipo disfruta nuestro espacio", "Salsa o yoga, para grupos pequeños y grandes", "Ideal para pausas activas, integraciones y celebraciones"],
    msg: "Hola, quiero cotizar una clase empresarial (salsa o yoga) para mi empresa.",
  },
];

export const STEPS = [
  { title: "Cuéntanos", body: "Fecha, tipo de evento, música e ideas que tengas." },
  { title: "Cotizamos", body: "Te enviamos una propuesta clara, a tu medida." },
  { title: "Creamos", body: "Diseñamos la coreografía o la clase y la ensayamos contigo." },
  { title: "Disfruta", body: "Brillas en tu evento, o tu equipo vive una gran experiencia." },
];

/* ------------------------------------------------------------------ Tienda */

export interface Product {
  slug: string;
  name: string;
  img: string;
  blurb: string;
}

export const PRODUCTS: Product[] = [
  { slug: "zapatillas", name: "Zapatillas", img: "/img/product-zapatillas.jpg", blurb: "Media punta y punta para cada nivel." },
  { slug: "mallas", name: "Mallas", img: "/img/product-mallas.jpg", blurb: "Cómodas, elásticas y con caída elegante." },
  { slug: "faldas", name: "Faldas", img: "/img/product-faldas.jpg", blurb: "Tul y gasa para dar vuelo a cada movimiento." },
  { slug: "medias", name: "Medias", img: "/img/product-medias.jpg", blurb: "Medias de ballet suaves y resistentes." },
  { slug: "accesorios-para-el-cabello", name: "Accesorios para el cabello", img: "/img/product-accesorios-cabello.jpg", blurb: "Moños, cintas y redes para el peinado perfecto." },
];
