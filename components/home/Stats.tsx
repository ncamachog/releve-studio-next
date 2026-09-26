import { STATS } from "@/lib/data";

export default function Stats() {
  return (
    <section className="r-stats">
      <div className="r-stats__inner" data-reveal>
        <p className="r-kicker">Nuestra historia</p>
        <div className="r-stats__grid">
          {STATS.map((s) => (
            <div className="r-stat" key={s.caption}>
              <p className="r-stats__number">
                {s.prefix && <span className="r-stats__plus">{s.prefix}</span>}
                <span className="r-stats__count" data-count-to={s.to}>0</span>
                {s.suffix && <span className="r-stats__suffix">{s.suffix}</span>}
              </p>
              <p className="r-body r-stats__caption">{s.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
