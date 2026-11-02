import { BRAND } from "@/lib/brand";

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

// Mensajes que se abren ya escritos en WhatsApp; quien escribe los puede editar antes de enviar.
export function genericMessage(fullName: string) {
  return `¡Hola ${firstName(fullName)}! Te escribimos de ${BRAND.name}.`;
}

export function leadMessage(fullName: string, interest: string, kind: "CONSULTA" | "INSCRIPCION" | "REINSCRIPCION") {
  const name = firstName(fullName);
  if (kind === "REINSCRIPCION") {
    return `¡Hola ${name}! Te escribimos de ${BRAND.name}. Recibimos la reinscripción 2027 (${interest}). ¿Te parece que coordinemos los últimos pasos?`;
  }
  if (kind === "INSCRIPCION") {
    return `¡Hola ${name}! Te escribimos de ${BRAND.name}. Recibimos la solicitud de inscripción 2027 (${interest}). ¿Te parece que coordinemos los próximos pasos?`;
  }
  return `¡Hola ${name}! Te escribimos de ${BRAND.name} por tu consulta sobre ${interest}. ¿En qué te podemos ayudar?`;
}

export type AdmisionTemplateId = "recepcion" | "vacante" | "pago" | "nivel" | "documentacion" | "inicio" | "espera";

export type AdmisionTemplate = { id: AdmisionTemplateId; label: string; text: string };

// Mensajes para cada paso del seguimiento de una solicitud (se editan en WhatsApp antes de enviar).
export function admisionTemplates(opts: {
  contacto: string;
  alumno: string;
  reinscripcion: boolean;
  curso: string;
  turno?: string;
  sede?: string;
  pagoInfo?: string;
}): AdmisionTemplate[] {
  const { contacto, alumno, reinscripcion, curso } = opts;
  const hi = `¡Hola ${firstName(contacto)}!`;
  const quien = firstName(alumno) || "tu hijo/a";
  const cursada = [curso, opts.turno, opts.sede].filter(Boolean).join(" · ");
  const tipo = reinscripcion ? "reinscripción" : "inscripción";
  return [
    {
      id: "recepcion",
      label: "Confirmar que recibimos la solicitud",
      text: `${hi} Te escribimos de ${BRAND.name}. Recibimos la ${tipo} 2027 de ${quien} y ya tenemos todos los datos. En breve te confirmamos la vacante.`,
    },
    {
      id: "vacante",
      label: "Confirmar la vacante",
      text: `${hi} Buenas noticias: hay vacante para ${quien}${cursada ? ` (${cursada})` : ""}. Para reservarla solo falta coordinar el pago y la fecha de inicio. ¿Hablamos?`,
    },
    {
      id: "pago",
      label: "Enviar datos o link de pago",
      text: `${hi} Para reservar la vacante de ${quien} te paso cómo pagar: ${opts.pagoInfo?.trim() || "[completar link o datos de pago]"}. Cuando lo hagas, mandanos el comprobante por acá.`,
    },
    {
      id: "nivel",
      label: "Coordinar prueba de nivel",
      text: `${hi} Para ubicar a ${quien} en el nivel justo, ¿te parece que coordinemos una prueba de nivel breve (unos 15 minutos)? ¿Qué día y horario te queda cómodo?`,
    },
    {
      id: "documentacion",
      label: "Pedir documentación",
      text: `${hi} Para completar la ${tipo} de ${quien} necesitamos una foto del DNI (frente y dorso). ¿Nos la podés enviar por acá?`,
    },
    {
      id: "inicio",
      label: "Confirmar fecha de inicio",
      text: `${hi} Te confirmamos que ${quien} empieza${curso ? ` ${curso}` : ""} el [fecha de inicio]. Horario: [día y horario]. Cualquier duda, escribinos.`,
    },
    {
      id: "espera",
      label: "Avisar lista de espera",
      text: `${hi} Por ahora no tenemos vacante en el turno que pidieron para ${quien}. Lo anotamos en lista de espera y apenas se libere te avisamos. ¿Te sirve algún otro horario?`,
    },
  ];
}
