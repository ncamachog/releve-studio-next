"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/data";

/** "Contáctanos": guarda el mensaje (visible en /admin) y ofrece WhatsApp como alternativa. */
export default function ContactSection({ title = "Hablemos de tu\npróxima clase o evento.", lead = "Cuéntanos qué necesitas —clases, una coreografía o una clase para tu empresa— y te respondemos pronto.", waMessage }: { title?: string; lead?: string; waMessage?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setError("");
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f.entries())),
      });
      const j = (await r.json()) as { message?: string };
      if (!r.ok) throw new Error(j.message ?? "No pudimos enviar tu mensaje.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos enviar tu mensaje.");
      setStatus("idle");
    }
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
            <input type="text" name="website" className="rb-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {error && <p className="rb-error" role="alert">{error}</p>}
            <button className="r-btn r-btn--primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando…" : "Enviar mensaje"}
            </button>
            {status === "sent" && <p className="r-form__ok" role="status">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
