"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/data";

/** "Contáctanos": el formulario arma un mensaje y lo envía por WhatsApp (sin backend). */
export default function ContactSection({ title = "Hablemos de tu\npróxima clase o evento.", lead = "Cuéntanos qué necesitas —clases, una coreografía o una clase para tu empresa— y te respondemos pronto.", waMessage }: { title?: string; lead?: string; waMessage?: string }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `Hola, soy ${f.get("name")} (${f.get("email")}${f.get("phone") ? ", " + f.get("phone") : ""}).\n${f.get("message")}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section className="r-cta" id="contacto">
      <div className="r-cta__inner">
        <div className="r-cta__text" data-reveal>
          <p className="r-kicker r-kicker--light">Contáctanos</p>
          <h2 className="r-h2 r-h2--light">
            {title.split("\n").map((l, i, a) => (
              <span key={i}>{l}{i < a.length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="r-body r-body--light">{lead}</p>
          <a className="r-btn r-btn--light" href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </a>
        </div>

        <div className="r-cta__form" data-reveal>
          <form className="r-form" onSubmit={onSubmit}>
            <label className="r-field"><span>Nombre</span><input name="name" required autoComplete="name" /></label>
            <label className="r-field"><span>Correo</span><input name="email" type="email" required autoComplete="email" /></label>
            <label className="r-field"><span>Teléfono / WhatsApp</span><input name="phone" type="tel" autoComplete="tel" /></label>
            <label className="r-field"><span>Mensaje</span><textarea name="message" rows={4} required placeholder="Cuéntanos qué necesitas…" /></label>
            <button className="r-btn r-btn--primary" type="submit">Enviar mensaje</button>
            {sent && <p className="r-form__ok" role="status">¡Gracias! Se abrió WhatsApp para enviar tu mensaje.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
