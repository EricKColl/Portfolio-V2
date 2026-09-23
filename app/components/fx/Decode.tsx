"use client";

import { useEffect, useRef, type ElementType } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Texto que se «descifra» letra a letra al entrar en pantalla.
 * El HTML inicial ya contiene el texto final (accesible y visible sin JavaScript);
 * la animación solo escribe en el DOM y se omite con «reducir movimiento».
 */
export default function Decode({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  duration = 900,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const run = () => {
      const start = performance.now() + delay;
      const tick = (now: number) => {
        const progress = Math.max(0, Math.min(1, (now - start) / duration));
        const reveal = Math.floor(progress * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < reveal || ch === " ") out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        node.textContent = progress >= 1 ? text : out;
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        node.textContent = text.replace(/[^\s]/g, "·");
        run();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      node.textContent = text;
    };
  }, [text, delay, duration]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
