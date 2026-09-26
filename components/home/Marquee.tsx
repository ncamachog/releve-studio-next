import { MARQUEE } from "@/lib/data";

export default function Marquee() {
  return (
    <div className="r-marquee" aria-hidden="true">
      <div className="r-marquee__track">
        {[0, 1].map((n) =>
          MARQUEE.map((w) => (
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
