"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects } from "../../lib/projects";

type Action = { id: string; group: string; label: string; hint: string; run: () => void };

const email = "erickcollrodriguez@gmail.com";

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Paleta de comandos (Ctrl/⌘ + K): salta a cualquier sección, abre un caso de estudio o copia el correo. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const actions = useMemo<Action[]>(
    () => [
      { id: "s-inicio", group: "Ir a", label: "Inicio", hint: "01", run: () => goTo("inicio") },
      { id: "s-proyectos", group: "Ir a", label: "Proyectos", hint: "02", run: () => goTo("proyectos") },
      { id: "s-experiencia", group: "Ir a", label: "Experiencia", hint: "03", run: () => goTo("experiencia") },
      { id: "s-stack", group: "Ir a", label: "Stack tecnológico", hint: "04", run: () => goTo("stack") },
      { id: "s-contacto", group: "Ir a", label: "Contacto", hint: "05", run: () => goTo("contacto") },
      ...projects.map<Action>((p) => ({
        id: `p-${p.slug}`,
        group: "Abrir proyecto",
        label: p.title,
        hint: p.kicker,
        run: () => window.dispatchEvent(new CustomEvent("portfolio:open-project", { detail: p.title })),
      })),
      { id: "l-github", group: "Enlaces", label: "GitHub", hint: "github.com/EricKColl", run: () => window.open("https://github.com/EricKColl", "_blank", "noopener,noreferrer") },
      { id: "l-email", group: "Enlaces", label: "Copiar correo", hint: email, run: () => void navigator.clipboard?.writeText(email) },
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.group} ${a.hint}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const run = (action: Action | undefined) => {
    if (!action) return;
    close();
    window.setTimeout(action.run, 60);
  };

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") close();
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(filtered[index]);
    }
  };

  if (!open || typeof document === "undefined") return null;

  let lastGroup = "";
  return createPortal(
    <div className="palette" role="dialog" aria-modal="true" aria-label="Paleta de comandos">
      <div className="palette-backdrop" onClick={close} aria-hidden="true" />
      <div className="palette-box">
        <div className="palette-input">
          <span aria-hidden="true">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Busca una sección, un proyecto o una acción…"
            aria-label="Buscar comando"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="palette-list" role="listbox">
          {filtered.length === 0 ? <li className="palette-empty">Sin resultados</li> : null}
          {filtered.map((action, i) => {
            const showGroup = action.group !== lastGroup;
            lastGroup = action.group;
            return (
              <li key={action.id} role="presentation">
                {showGroup ? <p className="palette-group">{action.group}</p> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  className={i === index ? "is-selected" : undefined}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => run(action)}
                >
                  <strong>{action.label}</strong>
                  <span>{action.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="palette-foot">
          <kbd>↑</kbd> <kbd>↓</kbd> navegar · <kbd>Enter</kbd> abrir · <kbd>Ctrl</kbd>+<kbd>K</kbd> alternar
        </p>
      </div>
    </div>,
    document.body,
  );
}
