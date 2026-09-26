import Image from "next/image";
import Link from "next/link";
import { CLASSES, PROGRAMS } from "@/lib/data";

const ADULTS = [
  { src: "/img/yoga.jpg", label: "Yoga", pos: "center 30%" },
  { src: "/img/salsa.jpg", label: "Salsa", pos: "center 25%" },
  { src: "/img/tango.jpg", label: "Tango", pos: "center" },
];

export default function Programs() {
  return (
    <section className="r-programs" id="programas">
      <div className="r-section-head" data-reveal>
        <p className="r-kicker">Nuestros programas</p>
        <h2 className="r-h2">Clases pensadas para cada etapa.</h2>
      </div>

      <div className="r-chips" data-reveal>
        {Object.values(CLASSES).map((c) => (
          <Link key={c.label} className="r-chip" href="/reservar-clase">{c.label}</Link>
        ))}
      </div>

      <div className="r-programs__grid">
        {PROGRAMS.map((p, i) => (
          <article key={p.title} className={`r-program${p.accent ? " r-program--accent" : ""}`} data-reveal>
            <span className="r-program__num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="r-h3">{p.title}</h3>
            <p className="r-body">{p.body}</p>
            <Link className="r-link" href={p.href}>
              {p.cta} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      <div className="r-adults" data-reveal>
        <p className="r-kicker">Para jóvenes y adultos +13</p>
        <div className="r-adults__grid">
          {ADULTS.map((a) => (
            <figure className="r-adult" key={a.label}>
              <Image src={a.src} alt={`Clase de ${a.label.toLowerCase()}`} width={900} height={1125} style={{ objectPosition: a.pos }} />
              <figcaption>{a.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
