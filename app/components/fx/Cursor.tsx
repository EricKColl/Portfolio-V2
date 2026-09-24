"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor personalizado: punto + anillo con inercia que crece sobre elementos interactivos
 * y muestra una etiqueta en los que declaran data-cursor="…". Solo en punteros finos.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const html = document.documentElement;
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, select, textarea, summary",
      );
      const text = el?.dataset.cursor ?? "";
      ring.classList.toggle("is-active", Boolean(el));
      ring.classList.toggle("has-label", Boolean(text));
      if (label.textContent !== text) label.textContent = text;
    };
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const loop = () => {
      rx += (x - rx) * 0.24;
      ry += (y - ry) * 0.24;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = window.requestAnimationFrame(loop);
    };

    // Con un caso de estudio abierto (iframe a pantalla completa) el cursor propio se suspende:
    // los eventos del puntero ya no llegan a esta página y se vería congelado con el nativo oculto.
    const sync = () => {
      const suspended = document.body.classList.contains("case-study-open");
      html.classList.toggle("has-custom-cursor", !suspended);
      window.cancelAnimationFrame(raf);
      if (!suspended) raf = window.requestAnimationFrame(loop);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span ref={labelRef} />
      </div>
    </>
  );
}
