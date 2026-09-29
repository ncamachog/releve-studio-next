"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/data";
import { useLocale } from "./LocaleProvider";

/** "Contáctanos": guarda el mensaje (visible en /admin) y ofrece WhatsApp como alternativa. */
export default function ContactSection({ title, lead, waMessage }: { title?: string; lead?: string; waMessage?: string }) {
  const { t: { contact: c, whatsappMessage } } = useLocale();
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
      if (!r.ok) throw new Error(j.message ?? c.error);
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : c.error);
      setStatus("idle");
    }
  };

  return (
    <section className="r-cta" id="contacto">
      <div className="r-cta__inner">
        <div className="r-cta__text" data-reveal>
          <p className="r-kicker r-kicker--light">{c.kicker}</p>
          <h2 className="r-h2 r-h2--light">
            {(title ?? c.title).split("\n").map((l, i, a) => (
              <span key={i}>{l}{i < a.length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="r-body r-body--light">{lead ?? c.lead}</p>
          <a className="r-btn r-btn--light" href={whatsappUrl(waMessage ?? whatsappMessage)} target="_blank" rel="noopener noreferrer">
            {c.whatsapp}
          </a>
        </div>

        <div className="r-cta__form" data-reveal>
          <form className="r-form" onSubmit={onSubmit}>
            <label className="r-field"><span>{c.name}</span><input name="name" required autoComplete="name" /></label>
            <label className="r-field"><span>{c.email}</span><input name="email" type="email" required autoComplete="email" /></label>
            <label className="r-field"><span>{c.phone}</span><input name="phone" type="tel" autoComplete="tel" /></label>
            <label className="r-field"><span>{c.message}</span><textarea name="message" rows={4} required placeholder={c.placeholder} /></label>
            <input type="text" name="website" className="rb-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {error && <p className="rb-error" role="alert">{error}</p>}
            <button className="r-btn r-btn--primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? c.sending : c.send}
            </button>
            {status === "sent" && <p className="r-form__ok" role="status">{c.ok}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
