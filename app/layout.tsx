import type { Metadata, Viewport } from "next";
import { Geist, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";
import { LocaleProvider } from "@/components/LocaleProvider";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"] });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export async function generateMetadata(): Promise<Metadata> {
  const c = getContent(await getLocale());
  return {
    title: { default: `${SITE.name} — ${c.siteTagline}`, template: `%s · ${SITE.name}` },
    description: c.description,
    openGraph: { title: SITE.name, description: c.ogDescription, images: ["/img/hero-estudio.jpg"], locale: c.ogLocale, type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#5C2A3A" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${geist.variable} ${playfair.variable} ${jost.variable}`}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
