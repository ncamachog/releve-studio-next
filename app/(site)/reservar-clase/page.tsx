import type { Metadata } from "next";
import Image from "next/image";
import BookingApp from "@/components/booking/BookingApp";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  return getContent(await getLocale()).booking.meta;
}

export default async function ReservarPage() {
  const t = getContent(await getLocale()).booking;
  return (
    <main id="primary" className="releve-booking">
      <section className="rb-hero">
        <Image className="rb-hero__img" src="/img/hero-estudio.jpg" alt="" fill priority sizes="100vw" />
        <div className="rb-hero__shade" />
        <div className="rb-hero__text">
          <p className="r-kicker r-kicker--light" data-reveal>{t.kicker}</p>
          <h1 className="rb-hero__title" data-reveal>{t.title}</h1>
          <p className="rb-hero__lead" data-reveal>{t.lead}</p>
        </div>
      </section>
      <BookingApp />
    </main>
  );
}
