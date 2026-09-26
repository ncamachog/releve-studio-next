import Image from "next/image";
import Link from "next/link";
import SplitTitle from "@/components/SplitTitle";

export default function Hero() {
  return (
    <section className="r-hero r-hero--full" id="inicio">
      <div className="r-hero__bg" data-parallax="0.25">
        <Image className="r-hero__bgimg" src="/img/hero-estudio.jpg" alt="Niñas bailando ballet en el estudio Relevé" fill priority sizes="100vw" />
      </div>
      <div className="r-hero__shade" />
      <span className="r-hero__petal r-hero__petal--1" />
      <span className="r-hero__petal r-hero__petal--2" />
      <span className="r-hero__petal r-hero__petal--3" />

      <div className="r-hero__center">
        <p className="r-hero__eyebrow" data-hero-in>Estudio boutique de ballet &amp; barre</p>
        <SplitTitle text="El arte de moverse con gracia." className="r-hero__title r-hero__title--xl" />
        <p className="r-hero__lead r-hero__lead--light" data-hero-in>
          Técnica, disciplina y sensibilidad artística: desde los primeros pasos hasta la excelencia en punta.
        </p>
        <div className="r-btn-row r-btn-row--center" data-hero-in>
          <Link className="r-btn r-btn--light r-btn--nomb" href="/reservar-clase">Reservar una clase</Link>
          <a className="r-btn r-btn--outline-light" href="#programas">Ver programas</a>
        </div>
      </div>

      <p className="r-hero__caption" data-hero-in>
        Más de 40 años formando bailarinas.<br />Baby ballet · Infantil · Junior · Salsa · Tango · Yoga.
      </p>

      <div className="r-hero__cards" data-hero-in>
        <Link className="r-hero__card" href="/reservar-clase">
          <Image className="r-hero__cardimg" src="/img/nina.jpg" alt="" width={340} height={425} />
          <span className="r-hero__cardnum">01</span>
          <span className="r-hero__cardtxt"><b>Reservar clases</b><small>Calendario en línea</small></span>
        </Link>
        <Link className="r-hero__card" href="/tienda">
          <Image className="r-hero__cardimg" src="/img/yoga.jpg" alt="" width={340} height={425} />
          <span className="r-hero__cardnum">02</span>
          <span className="r-hero__cardtxt"><b>La tienda</b><small>Kit de bailarina</small></span>
        </Link>
      </div>

      <a className="r-hero__scroll" href="#estudio" aria-label="Desplazarse"><span /></a>
    </section>
  );
}
