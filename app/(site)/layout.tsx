import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MotionProvider from "@/components/MotionProvider";
import { whatsappUrl } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = getContent(await getLocale());
  return (
    <>
      <MotionProvider />
      <SiteHeader />
      {children}
      <SiteFooter />
      <a className="r-wa-float" href={whatsappUrl(c.whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label={c.ui.whatsappAria}>
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M9 10c.5 2 2.5 4 5 5l1.5-1.5-2-1-1 .8c-.9-.4-1.7-1.2-2.1-2.1l.8-1-1-2Z" />
        </svg>
      </a>
    </>
  );
}
