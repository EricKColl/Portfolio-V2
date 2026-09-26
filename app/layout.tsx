import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./case-study.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl = `https://erickcoll.github.io${basePath}/`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Erick Coll — Desarrollador web",
  description:
    "Portfolio de Erick Coll: proyectos full-stack, experiencia y tecnologías web.",
  metadataBase: new URL("https://erickcoll.github.io"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Erick Coll — Portfolio",
    title: "Erick Coll — Desarrollador web Full-Stack",
    description:
      "No compito por encajar en el mercado. Portfolio de Erick Coll: Forja y HotelScout (PWAs en producción), JobConnect, ReparaYa, Online Store y TrendTech.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}og-image.png`,
        width: 1200,
        height: 630,
        alt: "Erick Coll Rodríguez — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Erick Coll — Desarrollador web Full-Stack",
    description: "Proyectos full-stack, experiencia y tecnologías web.",
    images: [`${siteUrl}og-image.png`],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
