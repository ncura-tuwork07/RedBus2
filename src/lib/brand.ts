// Datos oficiales de Red Bus School of English — Manual de marca v1.0 (octubre 2026).
// Si cambia un dato de contacto, se cambia acá y se actualiza en toda la web y el portal.

export const BRAND = {
  name: "Red Bus School of English",
  short: "Red Bus School",
  tagline: "Aprender inglés con confianza",
  city: "José C. Paz",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://red-bus2.vercel.app",
} as const;

// Único número que se publica.
export const WHATSAPP = {
  display: "11 3598-5287",
  url: "https://wa.me/5491135985287",
  mensajeInicial: "¡Hola! Quiero consultar por los cursos 2027 de Red Bus School of English.",
} as const;

export const INSTAGRAM = {
  handle: "@_redbusschool",
  url: "https://www.instagram.com/_redbusschool/",
} as const;

export const SEDES = [
  {
    nombre: "Sede 1",
    direccion: "Av. Croacia 2500",
    referencia: "Frente a la Parroquia Cura Brochero",
    mapa: "Av. Croacia 2500, José C. Paz, Buenos Aires, Argentina",
  },
  {
    nombre: "Sede 2",
    direccion: "Congreso y La Habana",
    referencia: "José C. Paz",
    mapa: "Congreso y La Habana, José C. Paz, Buenos Aires, Argentina",
  },
] as const;

export const CERTIFICACION = "Instituto Superior Cultural Británico";

export function whatsappLink(mensaje: string = WHATSAPP.mensajeInicial) {
  return `${WHATSAPP.url}?text=${encodeURIComponent(mensaje)}`;
}

export function mapsEmbed(consulta: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`;
}

export function mapsLink(consulta: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

// Cursos 2027 (manual de marca, sección 01): anuales de marzo a diciembre.
export const CURSOS = [
  { titulo: "Kinder", detalle: "Los primeros pasos" },
  { titulo: "Grados", detalle: "Primaria" },
  { titulo: "Adolescentes", detalle: "Secundaria" },
  { titulo: "Intensivo", detalle: "Para adultos" },
] as const;

export const APOYO = {
  titulo: "Clases de apoyo escolar",
  detalle: "Individuales, para primaria, secundaria y universitario. Apoyo para exámenes y horarios a convenir.",
} as const;

export const MESES = ["MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"] as const;
