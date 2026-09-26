import type { Metadata, Viewport } from "next";
import { Geist, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data";

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
      <body>{children}</body>
    </html>
  );
}
