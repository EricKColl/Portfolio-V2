"use client";

import { useEffect } from "react";

const LINES = [
  "> inicializando núcleo…",
  "> cargando 5 proyectos…",
  "> compilando visión…",
  "> sistema listo.",
];

/**
 * Secuencia de arranque de ~1,6 s, una vez por sesión. Se crea directamente en el DOM tras la hidratación
 * (el contenido real ya está en la página para buscadores y lectores), se omite con cualquier tecla o clic
 * y no aparece con «reducir movimiento».
 */
export default function Boot() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("portfolio:booted")) return;
      sessionStorage.setItem("portfolio:booted", "1");
    } catch {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "boot-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<div class="boot-inner"><div class="boot-logo">EC</div><pre class="boot-log"></pre><div class="boot-bar"><i></i></div><small>pulsa cualquier tecla para saltar</small></div>`;
    document.body.appendChild(overlay);
    document.documentElement.classList.add("is-booting");

    const log = overlay.querySelector<HTMLElement>(".boot-log");
    const bar = overlay.querySelector<HTMLElement>(".boot-bar i");
    const timers: number[] = [];
    let closed = false;

    const close = () => {
      if (closed) return;
      closed = true;
      timers.forEach((t) => window.clearTimeout(t));
      overlay.classList.add("is-leaving");
      document.documentElement.classList.remove("is-booting");
      window.setTimeout(() => overlay.remove(), 700);
      window.removeEventListener("keydown", close);
      overlay.removeEventListener("pointerdown", close);
    };

    LINES.forEach((line, index) => {
      timers.push(
        window.setTimeout(() => {
          if (log) log.textContent += `${line}\n`;
          if (bar) bar.style.width = `${((index + 1) / LINES.length) * 100}%`;
        }, 160 + index * 300),
      );
    });
    timers.push(window.setTimeout(close, 1650));
    window.addEventListener("keydown", close);
    overlay.addEventListener("pointerdown", close);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", close);
      overlay.remove();
      document.documentElement.classList.remove("is-booting");
    };
  }, []);

  return null;
}
