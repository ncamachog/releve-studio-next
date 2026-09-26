"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Animaciones globales: revelado al hacer scroll, contadores, parallax y
 * cabecera reducida. Se reconecta en cada navegación.
 */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.remove("is-ready");
    const cleanups: Array<() => void> = [];

    // Entrada del hero (título palabra por palabra).
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-ready")));
    cleanups.push(() => cancelAnimationFrame(raf));

    // Revelado al hacer scroll.
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // Contadores.
    const runCounter = (el: HTMLElement) => {
      const target = parseInt(el.dataset.countTo ?? "0", 10) || 0;
      const fmt = (n: number) => n.toLocaleString("es-CO");
      if (reduce) {
        el.textContent = fmt(target);
        return;
      }
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / 1800, 1);
        el.textContent = fmt(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target);
      };
      requestAnimationFrame(step);
    };
    const counters = document.querySelectorAll<HTMLElement>("[data-count-to]");
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              runCounter(e.target as HTMLElement);
              cio.unobserve(e.target);
            }
          }),
        { threshold: 0.5 },
      );
      counters.forEach((el) => cio.observe(el));
      cleanups.push(() => cio.disconnect());
    } else {
      counters.forEach(runCounter);
    }

    // Parallax.
    if (!reduce) {
      const bgs = document.querySelectorAll<HTMLElement>("[data-parallax]");
      const imgs = document.querySelectorAll<HTMLElement>("[data-parallax-img]");
      let ticking = false;
      const update = () => {
        const vh = window.innerHeight;
        bgs.forEach((el) => {
          const y = window.scrollY;
          if (y < vh * 1.2) el.style.transform = `translate3d(0,${y * parseFloat(el.dataset.parallax ?? "0.2")}px,0)`;
        });
        imgs.forEach((box) => {
          const r = box.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          const img = box.querySelector("img");
          if (img) img.style.transform = `scale(1.12) translate3d(0,${p * -34}px,0)`;
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      update();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
