"use client";

import { useEffect } from "react";

/** Fades sections in as they scroll into view. Does nothing for people who prefer reduced motion. */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".pg .wrap > *, .sec .wrap > *"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    for (const el of els) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("rv"); io.observe(el); }
    }
    return () => io.disconnect();
  }, []);
  return null;
}
