import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function Experience() {
  const { experience: t } = getContent(await getLocale());
  return (
    <section className="r-experience">
      <div className="r-section-head r-section-head--light" data-reveal>
        <p className="r-kicker">{t.kicker}</p>
        <h2 className="r-h2">{t.title}</h2>
      </div>
      <div className="r-experience__grid">
        {t.items.map((e, i) => (
          <div className="r-exp" key={e.title} data-reveal>
            <span className="r-exp__num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="r-h3">{e.title}</h3>
            <p className="r-body">{e.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
