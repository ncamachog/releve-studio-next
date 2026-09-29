import { STATS } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function Stats() {
  const { stats: t } = getContent(await getLocale());
  return (
    <section className="r-stats">
      <div className="r-stats__inner" data-reveal>
        <p className="r-kicker">{t.kicker}</p>
        <div className="r-stats__grid">
          {STATS.map((s, i) => (
            <div className="r-stat" key={s.to}>
              <p className="r-stats__number">
                {s.prefix && <span className="r-stats__plus">{s.prefix}</span>}
                <span className="r-stats__count" data-count-to={s.to}>0</span>
                {s.suffix && <span className="r-stats__suffix">{s.suffix}</span>}
              </p>
              <p className="r-body r-stats__caption">{t.captions[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
