import type { Metadata } from "next";
import Image from "next/image";
import BookingApp from "@/components/booking/BookingApp";

export const metadata: Metadata = {
  title: "Reservar clase",
  description: "Reserva tu clase de baby ballet, ballet infantil, junior, salsa, tango o yoga desde el calendario.",
};

export default function ReservarPage() {
  return (
    <main id="primary" className="releve-booking">
      <section className="rb-hero">
        <Image className="rb-hero__img" src="/img/hero-estudio.jpg" alt="" fill priority sizes="100vw" />
        <div className="rb-hero__shade" />
        <div className="rb-hero__text">
          <p className="r-kicker r-kicker--light" data-reveal>Agenda tu lugar</p>
          <h1 className="rb-hero__title" data-reveal>Reservar clase</h1>
          <p className="rb-hero__lead" data-reveal>Elige tu plan, escoge los días en el calendario y listo. Clases de 1 hora, con cupos limitados.</p>
        </div>
      </section>
      <BookingApp />
    </main>
  );
}
