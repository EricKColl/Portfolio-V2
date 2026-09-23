"use client";

import { useEffect, useRef, useState } from "react";
import Decode from "./fx/Decode";
import Magnetic from "./fx/Magnetic";

const email = "erickcollrodriguez@gmail.com";
const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent("Contacto desde tu portfolio")}`;
const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Contacto desde tu portfolio")}`;

function GmailIcon() {
  return (
    <svg viewBox="0 0 100 82" aria-hidden="true">
      <defs>
        <linearGradient id="gmail-left-vertical" x1="18" y1="13" x2="18" y2="69" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff5a8b" />
          <stop offset="0.38" stopColor="#ff3f4a" />
          <stop offset="1" stopColor="#ff3b36" />
        </linearGradient>
        <linearGradient id="gmail-left-fold" x1="18" y1="19" x2="50" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff5a8b" />
          <stop offset="0.48" stopColor="#ff4055" />
          <stop offset="1" stopColor="#ff343d" />
        </linearGradient>
        <linearGradient id="gmail-right-fold" x1="50" y1="49" x2="82" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff343d" />
          <stop offset="0.55" stopColor="#ff5b31" />
          <stop offset="1" stopColor="#ffc400" />
        </linearGradient>
        <linearGradient id="gmail-right-vertical" x1="82" y1="19" x2="82" y2="69" gradientUnits="userSpaceOnUse">
          <stop stopColor="#12c86b" />
          <stop offset="0.48" stopColor="#09a79c" />
          <stop offset="1" stopColor="#3979f6" />
        </linearGradient>
      </defs>
      <path d="M18 69V19" stroke="url(#gmail-left-vertical)" strokeWidth="17" strokeLinecap="round" />
      <path d="M18 19 50 49" stroke="url(#gmail-left-fold)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m50 49 32-30" stroke="url(#gmail-right-fold)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M82 19v50" stroke="url(#gmail-right-vertical)" strokeWidth="17" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 6.5h17v11h-17z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.1 3.8 9.4 7a1.8 1.8 0 0 1-.2 2.3l-1.4 1.3a14.2 14.2 0 0 0 5.6 5.6l1.3-1.4a1.8 1.8 0 0 1 2.3-.2l3.2 2.3a1.8 1.8 0 0 1 .6 2.1l-.5 1.3a2.4 2.4 0 0 1-2.4 1.5C9.4 21.1 2.9 14.6 2.2 6.1A2.4 2.4 0 0 1 3.7 3.7L5 3.2a1.8 1.8 0 0 1 2.1.6Z" />
    </svg>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [emailOptionsOpen, setEmailOptionsOpen] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reveal = () => {
      setPhoneVisible(true);
      window.setTimeout(() => {
        document.getElementById("phone-signal")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 520);
    };
    window.addEventListener("portfolio:reveal-phone", reveal);
    return () => window.removeEventListener("portfolio:reveal-phone", reveal);
  }, []);

  const copyEmail = async () => {
    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      field.style.pointerEvents = "none";
      document.body.appendChild(field);
      field.select();
      success = document.execCommand("copy");
      field.remove();
    }

    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section className="section contact" id="contacto" data-hue="0.6" aria-labelledby="contact-title" ref={sectionRef}>
      <div className="contact-halo" aria-hidden="true" />

      <header className="section-head contact-head">
        <p className="section-label">
          <span>05</span> Contacto
        </p>
        <h2 id="contact-title" className="display display-xl">
          <Decode as="span" text="¿Construimos algo" />
          <Decode as="span" text="que merezca ser recordado?" delay={350} className="text-gradient" />
        </h2>
        <p className="section-lead">
          Una conversación puede ser el primer paso de un producto extraordinario. Elige el canal y
          empecemos.
        </p>
      </header>

      <div className="contact-routes" aria-label="Opciones de contacto">
        <Magnetic strength={0.16}>
          <a className="route" href="https://github.com/EricKColl" target="_blank" rel="noreferrer" data-cursor="GITHUB">
            <span className="route-symbol" aria-hidden="true">↗</span>
            <small>CÓDIGO Y PROYECTOS</small>
            <strong>Ver GitHub</strong>
          </a>
        </Magnetic>

        <Magnetic strength={0.16}>
          <button
            className="route"
            type="button"
            aria-expanded={emailOptionsOpen}
            aria-controls="email-options"
            data-cursor="ESCRIBIR"
            onClick={() => {
              setEmailOptionsOpen((open) => {
                const next = !open;
                if (next) setPhoneVisible(false);
                return next;
              });
            }}
          >
            <span className="route-symbol" aria-hidden="true">@</span>
            <small>MENSAJE DIRECTO</small>
            <strong>Escríbeme</strong>
          </button>
        </Magnetic>

        <Magnetic strength={0.16}>
          <button
            className="route"
            type="button"
            aria-expanded={phoneVisible}
            aria-controls="phone-signal"
            data-cursor="LLAMAR"
            onClick={() => {
              const next = !phoneVisible;
              setPhoneVisible(next);
              if (next) {
                setEmailOptionsOpen(false);
                window.setTimeout(() => {
                  document.getElementById("phone-signal")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 520);
              }
            }}
          >
            <span className="route-symbol" aria-hidden="true"><PhoneIcon /></span>
            <small>CONVERSACIÓN</small>
            <strong>Teléfono</strong>
          </button>
        </Magnetic>
      </div>

      <div
        className={`email-options${emailOptionsOpen ? " is-open" : ""}`}
        id="email-options"
        aria-hidden={!emailOptionsOpen}
      >
        <div>
          <a href={gmailUrl} target="_blank" rel="noreferrer" tabIndex={emailOptionsOpen ? 0 : -1}>
            <span className="email-icon is-gmail"><GmailIcon /></span>
            Abrir Gmail
          </a>
          <a href={mailtoUrl} tabIndex={emailOptionsOpen ? 0 : -1}>
            <span className="email-icon"><MailIcon /></span>
            Usar mi aplicación de correo
          </a>
          <button type="button" onClick={copyEmail} tabIndex={emailOptionsOpen ? 0 : -1}>
            <span className="email-icon"><CopyIcon /></span>
            {copied ? "Dirección copiada" : "Copiar correo"}
          </button>
        </div>
      </div>

      <div className={`phone-signal${phoneVisible ? " is-visible" : ""}`} id="phone-signal" aria-hidden={!phoneVisible}>
        <a href="tel:+34621033302" aria-label="Llamar al 621 033 302" tabIndex={phoneVisible ? 0 : -1}>
          <span>621</span><i>·</i><span>033</span><i>·</i><span>302</span>
        </a>
        <p>Pulsa el número para iniciar una llamada.</p>
      </div>
    </section>
  );
}
