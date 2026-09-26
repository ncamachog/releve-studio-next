import type { Metadata, Viewport } from "next";
import { Geist, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MotionProvider from "@/components/MotionProvider";
import { SITE, whatsappUrl } from "@/lib/data";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"] });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: `${SITE.name} — Ballet, barre, salsa, tango y yoga`, template: `%s · ${SITE.name}` },
  description: "Estudio boutique de ballet & barre con más de 40 años de historia. Reserva tus clases de baby ballet, ballet infantil, junior, salsa, tango y yoga.",
  openGraph: { title: SITE.name, description: "El arte de moverse con gracia.", images: ["/img/hero-estudio.jpg"], locale: "es_CO", type: "website" },
};

export const viewport: Viewport = { themeColor: "#5C2A3A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${playfair.variable} ${jost.variable}`}>
      <body>
        <MotionProvider />
        <SiteHeader />
        {children}
        <SiteFooter />
        <a className="r-wa-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp">
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M9 10c.5 2 2.500 4 5 5l1.500-1.500-2-1-1 .8c-.9-.4-1.700-1.200-2.100-2.100l.8-1-1-2Z" /></svg>
        </a>
      </body>
    </html>
  );
}
