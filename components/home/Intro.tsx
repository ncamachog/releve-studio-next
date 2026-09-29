import Image from "next/image";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function Intro() {
  const { intro: t } = getContent(await getLocale());
  return (
    <section className="r-intro" id="estudio">
      <div className="r-intro__media" data-reveal data-parallax-img>
        <Image className="r-intro__img" src="/img/estudio-clase.jpg" alt={t.imgAlt} width={1400} height={665} />
      </div>
      <div className="r-intro__text" data-reveal>
        <p className="r-kicker">{t.kicker}</p>
        <h2 className="r-h2">{t.title[0]}<br />{t.title[1]}</h2>
        <p className="r-body">{t.p1}</p>
        <p className="r-body">{t.p2}</p>
      </div>
    </section>
  );
}
