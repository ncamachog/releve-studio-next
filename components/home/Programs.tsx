import Image from "next/image";
import Link from "next/link";
import { CLASSES, PROGRAMS } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

const ADULTS = [
  { src: "/img/yoga.jpg", key: "yoga", pos: "center 30%" },
  { src: "/img/salsa.jpg", key: "salsa", pos: "center 25%" },
  { src: "/img/tango.jpg", key: "tango", pos: "center" },
];

export default async function Programs() {
  const t = getContent(await getLocale());
  const p18 = t.programsSection;
  return (
    <section className="r-programs" id="programas">
      <div className="r-section-head" data-reveal>
        <p className="r-kicker">{p18.kicker}</p>
        <h2 className="r-h2">{p18.title}</h2>
      </div>

      <div className="r-chips" data-reveal>
        {(Object.keys(CLASSES) as (keyof typeof CLASSES)[]).map((k) => (
          <Link key={k} className="r-chip" href="/reservar-clase">{t.booking.classes[k].label}</Link>
        ))}
      </div>

      <div className="r-programs__grid">
        {PROGRAMS.map((p, i) => (
          <article key={i} className={`r-program${p.accent ? " r-program--accent" : ""}`} data-reveal>
            <span className="r-program__num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="r-h3">{p18.programs[i].title}</h3>
            <p className="r-body">{p18.programs[i].body}</p>
            <Link className="r-link" href={p.href}>
              {p18.programs[i].cta} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      <div className="r-adults" data-reveal>
        <p className="r-kicker">{p18.adults}</p>
        <div className="r-adults__grid">
          {ADULTS.map((a) => {
            const label = p18.adultLabels[a.key];
            return (
            <figure className="r-adult" key={a.key}>
              <Image src={a.src} alt={p18.adultAlt(label)} width={900} height={1125} style={{ objectPosition: a.pos }} />
              <figcaption>{label}</figcaption>
            </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
