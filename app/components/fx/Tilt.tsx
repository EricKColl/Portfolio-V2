"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Inclinación 3D con brillo holográfico que sigue al puntero. Solo en punteros finos y sin «reducir movimiento». */
export default function Tilt({
  children,
  as: Tag = "div",
  className = "",
  max = 9,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        node.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
        node.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
        node.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        node.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      window.cancelAnimationFrame(frame);
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      window.cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <Tag ref={ref} className={`tilt ${className}`.trim()}>
      {children}
    </Tag>
  );
}
