import Link from "next/link";
import { whatsappUrl } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function SiteFooter() {
  const { footer: f, whatsappMessage } = getContent(await getLocale());
  return (
    <footer className="r-footer">
      <div className="r-footer__top">
        <div className="r-footer__brand">
          <p className="r-footer__word">Relevé</p>
          <p className="r-footer__tag">Ballet Studio</p>
          <p className="r-footer__desc">{f.desc}</p>
        </div>

        <nav className="r-footer__nav" aria-label={f.navAria}>
          <p className="r-footer__label">{f.explore}</p>
          <ul>
            <li><Link href="/#estudio">{f.studio}</Link></li>
            <li><Link href="/#programas">{f.programs}</Link></li>
            <li><Link href="/servicios">{f.services}</Link></li>
            <li><Link href="/reservar-clase">{f.book}</Link></li>
            <li><Link href="/tienda">{f.shop}</Link></li>
          </ul>
        </nav>

        <div className="r-footer__contact">
          <p className="r-footer__label">{f.contact}</p>
          <a className="r-footer__wa" href={whatsappUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer">
            {f.whatsapp}
          </a>
          <Link className="r-footer__cta" href="/reservar-clase">
            {f.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="r-footer__bottom">
        <p>&copy; {new Date().getFullYear()} Relevé Ballet Studio. {f.rights}</p>
      </div>
    </footer>
  );
}
