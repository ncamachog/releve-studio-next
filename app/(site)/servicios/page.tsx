import type { Metadata } from "next";
import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import { SERVICES, STEPS, whatsappUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Coreografías para quinceañeras y matrimonios, y clases empresariales de salsa y yoga.",
};

export default function ServiciosPage() {
  return (
    <main id="primary" className="releve-booking releve-services">
      <section className="rs-hero">
        <Image className="rs-hero__img" src="/img/serv-quince.jpg" alt="" fill priority sizes="100vw" />
        <div className="rs-hero__shade" />
        <div className="rs-hero__text">
          <p className="r-kicker r-kicker--light" data-reveal>Más que clases</p>
          <h1 className="rs-hero__title" data-reveal>Servicios</h1>
          <p className="rs-hero__lead" data-reveal>Coreografías para tus fechas más especiales y clases de bienestar para tu empresa.</p>
          <div className="r-btn-row" data-reveal>
            <a className="r-btn r-btn--light r-btn--nomb" href="#contacto">Cotizar ahora</a>
            <a className="r-btn r-btn--outline-light" href="#quinceaneras">Ver servicios</a>
          </div>
        </div>
      </section>

      {SERVICES.map((s, i) => (
        <section key={s.id} className={`rs-block${i % 2 ? " rs-block--flip" : ""}`} id={s.id}>
          <div className="rs-block__photo" data-reveal>
            <Image src={s.img} alt={s.title} width={1400} height={933} />
          </div>
          <div className="rs-block__body" data-reveal>
            <p className="r-kicker">{s.kicker}</p>
            <h2 className="r-h2">{s.title}</h2>
            <p className="r-body">{s.text}</p>
            <ul className="rs-list">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <div className="r-btn-row">
              <a className="r-btn r-btn--primary" href="#contacto">Solicitar cotización</a>
              <a className="r-btn r-btn--ghost" href={whatsappUrl(s.msg)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </section>
      ))}

      <section className="rs-steps">
        <div className="r-section-head" data-reveal>
          <p className="r-kicker r-kicker--light">Cómo trabajamos</p>
          <h2 className="r-h2 r-h2--light">Del primer mensaje al gran día.</h2>
        </div>
        <div className="rs-steps__grid">
          {STEPS.map((s, i) => (
            <div className="rs-step" key={s.title} data-reveal>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="r-h3">{s.title}</h3>
              <p className="r-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactSection title={"Cuéntanos qué\ntienes en mente."} lead="Escríbenos y te respondemos con una propuesta personalizada." waMessage="Hola, quiero información sobre sus servicios." />
    </main>
  );
}
