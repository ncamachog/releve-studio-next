import Image from "next/image";
import Link from "next/link";
import SplitTitle from "@/components/SplitTitle";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function Hero() {
  const { hero: h, ui } = getContent(await getLocale());
  return (
    <section className="r-hero r-hero--full" id="inicio">
      <div className="r-hero__bg" data-parallax="0.25">
        <Image className="r-hero__bgimg" src="/img/hero-estudio.jpg" alt={h.imgAlt} fill priority sizes="100vw" />
      </div>
      <div className="r-hero__shade" />
      <span className="r-hero__petal r-hero__petal--1" />
      <span className="r-hero__petal r-hero__petal--2" />
      <span className="r-hero__petal r-hero__petal--3" />

      <div className="r-hero__center">
        <p className="r-hero__eyebrow" data-hero-in>{h.eyebrow}</p>
        <SplitTitle text={h.title} className="r-hero__title r-hero__title--xl" />
        <p className="r-hero__lead r-hero__lead--light" data-hero-in>{h.lead}</p>
        <div className="r-btn-row r-btn-row--center" data-hero-in>
          <Link className="r-btn r-btn--light r-btn--nomb" href="/reservar-clase">{h.book}</Link>
          <a className="r-btn r-btn--outline-light" href="#programas">{h.programs}</a>
        </div>
      </div>

      <p className="r-hero__caption" data-hero-in>
        {h.caption1}<br />{h.caption2}
      </p>

      <div className="r-hero__cards" data-hero-in>
        <Link className="r-hero__card" href="/reservar-clase">
          <Image className="r-hero__cardimg" src="/img/nina.jpg" alt="" width={340} height={425} />
          <span className="r-hero__cardnum">01</span>
          <span className="r-hero__cardtxt"><b>{h.card1}</b><small>{h.card1Sub}</small></span>
        </Link>
        <Link className="r-hero__card" href="/tienda">
          <Image className="r-hero__cardimg" src="/img/yoga.jpg" alt="" width={340} height={425} />
          <span className="r-hero__cardnum">02</span>
          <span className="r-hero__cardtxt"><b>{h.card2}</b><small>{h.card2Sub}</small></span>
        </Link>
      </div>

      <a className="r-hero__scroll" href="#estudio" aria-label={ui.scrollAria}><span /></a>
    </section>
  );
}
