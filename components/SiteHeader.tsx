"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/data";

const QUICK = NAV.filter((n) => n.href !== "/");

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al navegar.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`r-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="r-header__bar">
        <Link className="r-header__brand" href="/">
          {SITE.name}
        </Link>

        <nav className="r-nav" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={isActive(n.href) ? "is-active" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="r-burger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className="r-mobilemenu" aria-label="Menú móvil" hidden={!open}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={isActive(n.href) ? "is-active" : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>

      <nav className="r-mobilebar" aria-label="Accesos rápidos">
        {QUICK.map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
