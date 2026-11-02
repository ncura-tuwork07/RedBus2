import type { AdmisionPayload, Persona } from "@/lib/admisiones";

// Ordena los datos de una solicitud de admisión en secciones legibles (para el panel y para el legajo).
// Omite todo lo que quedó vacío.

export type ResumenSection = { title: string; rows: [string, string][] };
export type AdmisionDetalle = Partial<AdmisionPayload> & { edad?: number };

const siNo = (v?: string) => (v === "si" ? "Sí" : v === "no" ? "No" : "");

function fecha(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function persona(p?: Persona) {
  if (!p?.nombre) return "";
  return [p.nombre, p.vinculo && `(${p.vinculo})`, p.telefono, p.email, p.dni && `DNI ${p.dni}`].filter(Boolean).join(" · ");
}

export function resumenAdmision(d: AdmisionDetalle): ResumenSection[] {
  const tipoReins = d.tipo === "reinscripcion";
  const sections: ResumenSection[] = [
    {
      title: "Alumno/a",
      rows: [
        ["Nombre", [d.alumno?.nombre, d.alumno?.apellido].filter(Boolean).join(" ")],
        ["DNI", d.alumno?.dni ?? ""],
        ["Nacimiento", d.edad !== undefined ? `${fecha(d.alumno?.nacimiento)} (${d.edad} años)` : fecha(d.alumno?.nacimiento)],
        ["Género", d.alumno?.genero ?? ""],
        ["WhatsApp", d.alumno?.telefono ?? ""],
        ["Email", d.alumno?.email ?? ""],
      ],
    },
    {
      title: "Domicilio",
      rows: [
        ["Calle", d.domicilio?.calle ?? ""],
        ["Barrio", d.domicilio?.barrio ?? ""],
        ["Localidad", d.domicilio?.localidad ?? ""],
        ["CP", d.domicilio?.cp ?? ""],
        ["Referencia", d.domicilio?.referencia ?? ""],
      ],
    },
    {
      title: "Responsables y contactos",
      rows: [
        ["Responsable 1", persona(d.responsable1)],
        ["Responsable 2", persona(d.responsable2)],
        [
          "Emergencia",
          d.emergencia?.nombre ? [d.emergencia.nombre, d.emergencia.vinculo && `(${d.emergencia.vinculo})`, d.emergencia.telefono].filter(Boolean).join(" · ") : "",
        ],
      ],
    },
    {
      title: "Escuela",
      rows: [
        ["Escuela", d.escuela?.nombre ?? ""],
        ["Año o grado", d.escuela?.anio ?? ""],
        ["Turno escolar", d.escuela?.turno ?? ""],
      ],
    },
  ];

  if (tipoReins) {
    sections.push({
      title: "Cursada 2026",
      rows: [
        ["Curso", d.actual?.curso ?? ""],
        ["Módulo o nivel", d.actual?.modulo ?? ""],
        ["Docente", d.actual?.docente ?? ""],
        ["Día y horario", d.actual?.horario ?? ""],
        ["Situación 2027", d.actual?.situacion ?? ""],
        ["Motivo de baja", d.actual?.motivoBaja ?? ""],
      ],
    });
  } else {
    sections.push({
      title: "Inglés",
      rows: [
        ["¿Ya estudió?", d.ingles?.estudio ?? ""],
        ["Dónde", d.ingles?.donde ?? ""],
        ["Nivel", d.ingles?.nivel ?? ""],
        ["Examen internacional", d.ingles?.examen ?? ""],
        ["Objetivos", (d.ingles?.objetivos ?? []).join(", ")],
      ],
    });
  }

  sections.push(
    {
      title: "Cursada 2027",
      rows: [
        ["Curso", d.cursada?.curso ?? ""],
        ["Turno", d.cursada?.turno ?? ""],
        ["Sede", d.cursada?.sede ?? ""],
        ["Días", (d.cursada?.dias ?? []).join(", ")],
        ["Horarios", d.cursada?.horarios ?? ""],
        ["Inicio", d.cursada?.inicio ?? ""],
        ["Hermanos en Red Bus", d.cursada?.hermanos ?? ""],
      ],
    },
    {
      title: "Salud y apoyos",
      rows: [
        ["Cobertura", d.salud?.cobertura ?? ""],
        ["Salud", d.salud?.condiciones ?? ""],
        ["Necesidades de apoyo", d.salud?.necesidades ?? ""],
      ],
    },
    {
      title: "Pago",
      rows: [
        ["Forma de pago", d.pago?.forma ?? ""],
        ["Quién paga", d.pago?.quien ?? ""],
        ["Factura", d.pago?.factura === "si" ? `Sí · ${d.pago.facturaNombre} · ${d.pago.facturaDoc}` : siNo(d.pago?.factura)],
        ["Código de descuento", d.pago?.cupon ?? ""],
      ],
    },
    {
      title: tipoReins ? "Opinión sobre 2026" : "Cómo nos conoció",
      rows: tipoReins
        ? [
            ["Puntaje", d.feedback?.puntaje ? `${d.feedback.puntaje} / 5` : ""],
            ["Le gustó", d.feedback?.gusto ?? ""],
            ["A mejorar", d.feedback?.mejorar ?? ""],
            ["¿Recomienda?", siNo(d.feedback?.recomienda)],
          ]
        : [
            ["Medio", d.conocio?.medio ?? ""],
            ["Detalle", d.conocio?.detalle ?? ""],
          ],
    },
    {
      title: "Contacto preferido",
      rows: [
        ["Medio", d.contacto?.medio ?? ""],
        ["Momento", d.contacto?.franja ?? ""],
        ["Comentarios", d.comentarios ?? ""],
      ],
    },
    {
      title: "Autorizaciones",
      rows: [
        ["Tratamiento de datos", d.autorizaciones?.datos ? "Aceptado" : "No"],
        ["Uso de imagen", d.autorizaciones?.imagen ? "Autoriza" : "No autoriza"],
        ["Urgencias médicas", d.autorizaciones?.urgencias ? "Autoriza" : "No indicó"],
        ["Retiro solo/a", siNo(d.autorizaciones?.retiroSolo)],
        ["Autorizados a retirar", d.autorizaciones?.autorizadosRetiro ?? ""],
      ],
    },
  );

  return sections
    .map((s) => ({ ...s, rows: s.rows.filter(([, value]) => value && value.trim() !== "") as [string, string][] }))
    .filter((s) => s.rows.length > 0);
}

// Texto plano para guardar en el legajo del alumno.
export function resumenComoTexto(d: AdmisionDetalle): string {
  return resumenAdmision(d)
    .map((s) => `${s.title.toUpperCase()}\n${s.rows.map(([k, v]) => `- ${k}: ${v}`).join("\n")}`)
    .join("\n\n");
}
