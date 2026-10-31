import type { Metadata, Viewport } from "next";
import { Quicksand, Unbounded } from "next/font/google";
import "./globals.css";
import { SwRegister } from "@/components/sw-register";
import { BRAND } from "@/lib/brand";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: `${BRAND.name} · Escuela de inglés en ${BRAND.city}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Escuela de inglés en José C. Paz con cursos anuales para chicos, adolescentes y adultos, y clases de apoyo escolar. Certificación del Instituto Superior Cultural Británico.",
  manifest: "/manifest.json",
  openGraph: {
    title: BRAND.name,
    description: "Aprendé inglés con confianza. Cursos anuales 2027 y clases de apoyo en José C. Paz.",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/brand/isologo.png", width: 1024, height: 1024, alt: BRAND.name }],
  },
};

export const viewport: Viewport = {
  themeColor: "#3e356a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${quicksand.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
