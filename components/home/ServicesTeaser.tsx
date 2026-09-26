import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/data";

const SHORT: Record<string, string> = {
  quinceaneras: "Creamos y ensayamos la coreografía de tus 15: vals, sorpresa o show, diseñada a tu estilo y con acompañamiento hasta el gran día.",
  matrimonios: "Tu primer baile, como lo soñaste: coreografías para novios y familiares, adaptadas a tu música y a tu nivel, sin necesidad de experiencia.",
};

export default function ServicesTeaser() {
  return (
    <section className="r-services" id="servicios">
      <div className="r-section-head" data-reveal>
        <p className="r-kicker">Servicios especiales</p>
        <h2 className="r-h2">Para tus momentos más importantes.</h2>
      </div>

      <div className="r-services__grid">
        {SERVICES.map((s) => {
          const wide = s.id === "empresariales";
          return (
            <article key={s.id} className={`r-service${wide ? " r-service--wide" : ""}`} data-reveal>
              <div className="r-service__photo">
                <Image src={s.img} alt={s.title} width={1400} height={933} />
              </div>
              <div className="r-service__body">
                <h3 className="r-h3">{s.title}</h3>
                {wide ? (
                  <>
                    <p className="r-body">Bienestar, integración y buen ambiente para tu equipo. Tú eliges la modalidad:</p>
                    <ul className="r-service__list">
                      <li><b>Vamos a tu empresa.</b> Llevamos la clase de salsa o yoga a tu oficina o evento.</li>
                      <li><b>Tu empresa viene al estudio.</b> Tu equipo disfruta la clase en nuestro espacio.</li>
                    </ul>
                  </>
                ) : (
                  <p className="r-body">{SHORT[s.id]}</p>
                )}
                <Link className="r-link" href={`/servicios#${s.id}`}>
                  Ver más <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <p className="r-services__more" data-reveal>
        <Link className="r-btn r-btn--primary" href="/servicios">Ver todos los servicios</Link>
      </p>
    </section>
  );
}
