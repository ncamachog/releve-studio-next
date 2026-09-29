import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function ServicesTeaser() {
  const c = getContent(await getLocale());
  const t = c.teaser;
  return (
    <section className="r-services" id="servicios">
      <div className="r-section-head" data-reveal>
        <p className="r-kicker">{t.kicker}</p>
        <h2 className="r-h2">{t.title}</h2>
      </div>

      <div className="r-services__grid">
        {SERVICES.map((s) => {
          const wide = s.id === "empresariales";
          return (
            <article key={s.id} className={`r-service${wide ? " r-service--wide" : ""}`} data-reveal>
              <div className="r-service__photo">
                <Image src={s.img} alt={c.services.items[s.id].title} width={1400} height={933} />
              </div>
              <div className="r-service__body">
                <h3 className="r-h3">{c.services.items[s.id].title}</h3>
                {wide ? (
                  <>
                    <p className="r-body">{t.corpIntro}</p>
                    <ul className="r-service__list">
                      <li><b>{t.corp1[0]}</b> {t.corp1[1]}</li>
                      <li><b>{t.corp2[0]}</b> {t.corp2[1]}</li>
                    </ul>
                  </>
                ) : (
                  <p className="r-body">{t.short[s.id]}</p>
                )}
                <Link className="r-link" href={`/servicios#${s.id}`}>
                  {t.more} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <p className="r-services__more" data-reveal>
        <Link className="r-btn r-btn--primary" href="/servicios">{t.all}</Link>
      </p>
    </section>
  );
}
