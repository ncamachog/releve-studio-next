import type { Metadata } from "next";
import Image from "next/image";
import { PRODUCTS, whatsappUrl } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Vestuario, calzado y accesorios de ballet seleccionados con el mismo cuidado que ponemos en cada clase.",
};

export default function TiendaPage() {
  return (
    <main id="primary" className="releve-shop">
      <section className="r-shop-hero">
        <p className="r-kicker" data-reveal>Tienda Relevé</p>
        <h1 className="r-h2 r-shop-hero__title" data-reveal>Lo esencial para cada bailarina.</h1>
        <p className="r-body r-shop-hero__lead" data-reveal>
          Vestuario, calzado y accesorios seleccionados con el mismo cuidado que ponemos en cada clase.
        </p>
      </section>

      <section className="r-shop-content">
        <ul className="r-products">
          {PRODUCTS.map((p) => (
            <li className="r-product" key={p.slug} data-reveal>
              <div className="r-product__img">
                <Image src={p.img} alt={p.name} width={900} height={900} />
              </div>
              <h2 className="r-product__name">{p.name}</h2>
              <p className="r-body">{p.blurb}</p>
              <a className="r-btn r-btn--primary" href={whatsappUrl(`Hola, quiero información sobre: ${p.name}.`)} target="_blank" rel="noopener noreferrer">
                Consultar por WhatsApp
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
