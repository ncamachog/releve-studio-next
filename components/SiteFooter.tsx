import Link from "next/link";
import { whatsappUrl } from "@/lib/data";

export default function SiteFooter() {
  return (
    <footer className="r-footer">
      <div className="r-footer__top">
        <div className="r-footer__brand">
          <p className="r-footer__word">Relevé</p>
          <p className="r-footer__tag">Ballet Studio</p>
          <p className="r-footer__desc">Estudio boutique de ballet &amp; barre.</p>
        </div>

        <nav className="r-footer__nav" aria-label="Navegación de pie de página">
          <p className="r-footer__label">Explorar</p>
          <ul>
            <li><Link href="/#estudio">El estudio</Link></li>
            <li><Link href="/#programas">Programas</Link></li>
            <li><Link href="/servicios">Servicios</Link></li>
            <li><Link href="/reservar-clase">Reservar clase</Link></li>
            <li><Link href="/tienda">Tienda</Link></li>
          </ul>
        </nav>

        <div className="r-footer__contact">
          <p className="r-footer__label">Contacto</p>
          <a className="r-footer__wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            Escríbenos por WhatsApp
          </a>
          <Link className="r-footer__cta" href="/reservar-clase">
            Reservar una clase <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="r-footer__bottom">
        <p>&copy; {new Date().getFullYear()} Relevé Ballet Studio. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
