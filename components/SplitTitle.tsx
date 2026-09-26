import type { ElementType } from "react";

/** Título cuyas palabras suben una a una (la animación se activa con `.is-ready`). */
export default function SplitTitle({ text, as: Tag = "h1", className }: { text: string; as?: ElementType; className?: string }) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(/\s+/).map((w, i, arr) => (
        <span key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ ["--i" as string]: i }}>{w}</span>
          </span>
          {i < arr.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
