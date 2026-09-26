import Image from "next/image";

export default function Intro() {
  return (
    <section className="r-intro" id="estudio">
      <div className="r-intro__media" data-reveal data-parallax-img>
        <Image className="r-intro__img" src="/img/estudio-clase.jpg" alt="Clase de ballet infantil en el estudio" width={1400} height={665} />
      </div>
      <div className="r-intro__text" data-reveal>
        <p className="r-kicker">Sobre Relevé</p>
        <h2 className="r-h2">Un estudio pensado<br />para el arte de la danza.</h2>
        <p className="r-body">
          Relevé nace como un espacio dedicado al ballet clásico y al trabajo de barre, donde la técnica se enseña con calidez y precisión. Cada clase está diseñada para acompañar el crecimiento de cada bailarina —cuerpo, disciplina y expresión— en un ambiente cuidado hasta el último detalle.
        </p>
        <p className="r-body">
          Creemos que el ballet es, ante todo, una forma de encontrarse a una misma: postura, respiración, música y movimiento en un mismo instante.
        </p>
      </div>
    </section>
  );
}
