import { getContent } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export default async function Marquee() {
  const { marquee } = getContent(await getLocale());
  return (
    <div className="r-marquee" aria-hidden="true">
      <div className="r-marquee__track">
        {[0, 1].map((n) =>
          marquee.map((w) => (
            <span key={`${n}-${w}`} style={{ display: "contents" }}>
              <span>{w}</span>
              <i>✦</i>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
