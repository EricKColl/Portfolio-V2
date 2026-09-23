"use client";

import { useEffect, useRef } from "react";

/** Cifra que cuenta hasta su valor al entrar en pantalla (el HTML inicial ya lleva el valor final). */
export default function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          node.textContent = `${prefix}${Math.round(value * eased)}${suffix}`;
          if (t < 1) frame = window.requestAnimationFrame(tick);
        };
        node.textContent = `${prefix}0${suffix}`;
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      node.textContent = `${prefix}${value}${suffix}`;
    };
  }, [value, suffix, prefix]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
