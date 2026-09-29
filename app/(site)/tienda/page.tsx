import type { Metadata } from "next";
import Image from "next/image";
import { PRODUCTS, money, whatsappUrl } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  return getContent(await getLocale()).shop.meta;
}

export default async function TiendaPage() {
  const t = getContent(await getLocale()).shop;
  return (
    <main id="primary" className="releve-shop">
      <section className="r-shop-hero">
        <p className="r-kicker" data-reveal>{t.kicker}</p>
        <h1 className="r-h2 r-shop-hero__title" data-reveal>{t.title}</h1>
        <p className="r-body r-shop-hero__lead" data-reveal>{t.lead}</p>
      </section>

      <section className="r-shop-content">
        <ul className="r-products">
          {PRODUCTS.map((p) => (
            <li className="r-product" key={p.slug} data-reveal>
              <div className="r-product__img">
                <Image src={p.img} alt={t.products[p.slug].name} width={900} height={900} />
              </div>
              <h2 className="r-product__name">{t.products[p.slug].name}</h2>
              <p className="r-body">{t.products[p.slug].blurb}</p>
              <p className="r-product__price">{money(p.price)}</p>
              <a className="r-btn r-btn--primary" href={whatsappUrl(t.waMessage(t.products[p.slug].name))} target="_blank" rel="noopener noreferrer">
                {t.order}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
