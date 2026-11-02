import { BRAND, SEDES, WHATSAPP } from "@/lib/brand";

// Opciones y validación del formulario público /admisiones (inscripción nueva y reinscripción 2027).
// Sin dependencias de servidor: lo usan el formulario (cliente) y la API (servidor).

export type AdmisionTipo = "nuevo" | "reinscripcion";

export const GENERO_OPTIONS = ["Femenino", "Masculino", "Otro", "Prefiero no decirlo"] as const;

export const LOCALIDADES = [
  "José C. Paz",
  "Tortuguitas",
  "Del Viso",
  "Grand Bourg",
  "Pablo Nogués",
  "Los Polvorines",
  "Villa de Mayo",
  "Malvinas Argentinas",
  "San Miguel",
  "Muñiz",
  "Bella Vista",
  "Pilar",
] as const;

export const ANIO_ESCOLAR_OPTIONS = [
  "Sala de 3",
  "Sala de 4",
  "Sala de 5",
  "1° grado",
  "2° grado",
  "3° grado",
  "4° grado",
  "5° grado",
  "6° grado",
  "1° año (secundaria)",
  "2° año (secundaria)",
  "3° año (secundaria)",
  "4° año (secundaria)",
  "5° año (secundaria)",
  "6° año (secundaria)",
  "Terciario / universitario",
  "Ya terminó los estudios",
  "No asiste a la escuela",
] as const;

export const ESCUELA_TURNO_OPTIONS = ["Mañana", "Tarde", "Jornada completa", "Noche", "No aplica"] as const;

export const INGLES_ESTUDIO_OPTIONS = [
  "No, nunca estudió inglés",
  "Sí, solo en la escuela",
  "Sí, en otro instituto",
  "Sí, con profesor/a particular",
  "Sí, con apps o por su cuenta",
  "Sí, viviendo en el exterior",
] as const;

export const NIVEL_OPTIONS = [
  "Ninguno (empieza de cero)",
  "Principiante (A1)",
  "Elemental (A2)",
  "Intermedio (B1)",
  "Intermedio alto (B2)",
  "Avanzado (C1)",
  "No sé: quiero una prueba de nivel",
] as const;

export const EXAMEN_OPTIONS = [
  "Ninguno",
  "A2 Key (KET)",
  "B1 Preliminary (PET)",
  "B2 First (FCE)",
  "C1 Advanced (CAE)",
  "IELTS / TOEFL",
  "Otro",
] as const;

export const OBJETIVO_OPTIONS = [
  "Mejorar en la escuela",
  "Aprender desde cero",
  "Conversar con fluidez",
  "Viajar",
  "Trabajo o profesión",
  "Rendir un examen internacional",
  "Estudios universitarios",
  "Por gusto",
] as const;

export const CURSO_OPTIONS = [
  "Kinder",
  "Grados (primaria)",
  "Adolescentes (secundaria)",
  "Intensivo para adultos",
  "Clases de apoyo escolar",
  "Todavía no sé, quiero que me orienten",
] as const;

export const CURSO_ACTUAL_OPTIONS = [
  "Kinder",
  "Grados (primaria)",
  "Adolescentes (secundaria)",
  "Intensivo para adultos",
  "Clases de apoyo escolar",
  "Otro",
] as const;

export const TURNO_OPTIONS = ["Mañana", "Tarde", "Noche", "A convenir"] as const;

export const SEDE_OPTIONS = [...SEDES.map((s) => `${s.nombre} · ${s.direccion}`), "Sin preferencia"] as const;

export const DIA_OPTIONS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

export const INICIO_OPTIONS = [
  "Inicio del ciclo 2027 (marzo)",
  "Lo antes posible",
  "Más adelante en el año",
  "Todavía no sé",
] as const;

export const SITUACION_OPTIONS = [
  "Continúa al nivel siguiente",
  "Repite el nivel",
  "Cambia de curso o programa",
  "Todavía no sé, quiero que me orienten",
  "No va a continuar en 2027",
] as const;
export const NO_CONTINUA = "No va a continuar en 2027";

export const VINCULO_OPTIONS = [
  "Madre",
  "Padre",
  "Tutor/a",
  "Abuelo/a",
  "Tío/a",
  "Hermano/a mayor",
  "Otro familiar o responsable",
] as const;

export const QUIEN_PAGA_OPTIONS = ["Responsable 1", "Responsable 2", "El propio alumno/a", "Otra persona"] as const;

export const FORMA_PAGO_OPTIONS = [
  "Efectivo en la sede",
  "Transferencia bancaria",
  "Mercado Pago (link de pago)",
  "Tarjeta",
  "A definir",
] as const;

export const CONOCIO_OPTIONS = [
  "Instagram",
  "Facebook",
  "Recomendación de un alumno o familia",
  "Volante o cartel",
  "Pasé por la puerta",
  "Google o internet",
  "Mi escuela",
  "Otro",
] as const;

export const CONTACTO_MEDIO_OPTIONS = ["WhatsApp", "Llamada", "Email"] as const;
export const CONTACTO_FRANJA_OPTIONS = ["Mañana", "Tarde", "Noche", "Cualquier momento"] as const;
export const PUNTAJE_OPTIONS = ["1", "2", "3", "4", "5"] as const;

export const CONSENTIMIENTO_TEXTO =
  `Autorizo a ${BRAND.name} a usar los datos de este formulario, incluidos los de salud y necesidades de apoyo, para gestionar la inscripción 2027 y comunicarse conmigo por WhatsApp, teléfono o email. ` +
  `Los datos se guardan solo para ese fin y los ve únicamente el equipo de la escuela. Puedo pedir en cualquier momento que me los muestren, corrijan o eliminen escribiendo al WhatsApp ${WHATSAPP.display} (Ley 25.326 de Protección de Datos Personales).`;

export const IMAGEN_TEXTO =
  "Autorizo el uso de fotos y videos del alumno/a en las redes y la web de la escuela (opcional, se puede retirar cuando quiera).";

export const URGENCIAS_TEXTO =
  "En caso de urgencia médica, autorizo a la escuela a llamar al servicio de emergencias y a trasladar al alumno/a a un centro de salud mientras me contactan.";

export type Persona = { nombre: string; vinculo: string; dni: string; telefono: string; email: string };

export type AdmisionPayload = {
  tipo: AdmisionTipo;
  alumno: { nombre: string; apellido: string; dni: string; nacimiento: string; genero: string; telefono: string; email: string };
  domicilio: { calle: string; barrio: string; localidad: string; cp: string; referencia: string };
  responsable1: Persona;
  responsable2: Persona;
  emergencia: { nombre: string; vinculo: string; telefono: string };
  escuela: { nombre: string; anio: string; turno: string };
  ingles: { estudio: string; donde: string; nivel: string; examen: string; objetivos: string[] };
  actual: { curso: string; modulo: string; sede: string; docente: string; horario: string; situacion: string; motivoBaja: string };
  cursada: { curso: string; turno: string; sede: string; dias: string[]; horarios: string; inicio: string; hermanos: string };
  salud: { cobertura: string; condiciones: string; necesidades: string };
  pago: { quien: string; forma: string; factura: string; facturaNombre: string; facturaDoc: string; cupon: string };
  conocio: { medio: string; detalle: string };
  contacto: { medio: string; franja: string };
  feedback: { puntaje: string; gusto: string; mejorar: string; recomienda: string };
  comentarios: string;
  autorizaciones: { datos: boolean; imagen: boolean; urgencias: boolean; retiroSolo: string; autorizadosRetiro: string };
  website: string; // trampa para bots: queda vacío en un formulario real
};

const emptyPersona = (): Persona => ({ nombre: "", vinculo: "", dni: "", telefono: "", email: "" });

export function emptyAdmision(tipo: AdmisionTipo): AdmisionPayload {
  return {
    tipo,
    alumno: { nombre: "", apellido: "", dni: "", nacimiento: "", genero: "", telefono: "", email: "" },
    domicilio: { calle: "", barrio: "", localidad: "", cp: "", referencia: "" },
    responsable1: emptyPersona(),
    responsable2: emptyPersona(),
    emergencia: { nombre: "", vinculo: "", telefono: "" },
    escuela: { nombre: "", anio: "", turno: "" },
    ingles: { estudio: "", donde: "", nivel: "", examen: "", objetivos: [] },
    actual: { curso: "", modulo: "", sede: "", docente: "", horario: "", situacion: "", motivoBaja: "" },
    cursada: { curso: "", turno: "", sede: "", dias: [], horarios: "", inicio: "", hermanos: "" },
    salud: { cobertura: "", condiciones: "", necesidades: "" },
    pago: { quien: "", forma: "", factura: "", facturaNombre: "", facturaDoc: "", cupon: "" },
    conocio: { medio: "", detalle: "" },
    contacto: { medio: "WhatsApp", franja: "" },
    feedback: { puntaje: "", gusto: "", mejorar: "", recomienda: "" },
    comentarios: "",
    autorizaciones: { datos: false, imagen: false, urgencias: false, retiroSolo: "", autorizadosRetiro: "" },
    website: "",
  };
}

// edad en años cumplidos (null si la fecha no es válida)
export function ageFrom(iso: string, today = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const born = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(born.getTime()) || born > today || born.getFullYear() < 1920) return null;
  let age = today.getFullYear() - born.getFullYear();
  const hadBirthday =
    today.getMonth() > born.getMonth() || (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

type Obj = Record<string, unknown>;
const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const digits = (value: string) => value.replace(/\D/g, "");
const inList = (list: readonly string[], value: string) => list.includes(value);
const pickList = (list: readonly string[], value: unknown) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && list.includes(v)) : [];
const obj = (value: unknown): Obj => (value && typeof value === "object" ? (value as Obj) : {});

function persona(value: unknown): Persona {
  const p = obj(value);
  return {
    nombre: str(p.nombre, 120),
    vinculo: str(p.vinculo, 60),
    dni: digits(str(p.dni, 20)),
    telefono: str(p.telefono, 30),
    email: str(p.email, 254).toLowerCase(),
  };
}

const phoneOk = (v: string) => digits(v).length >= 8 && digits(v).length <= 15;
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export type ParseResult = { ok: true; data: AdmisionPayload; edad: number } | { ok: false; error: string };

export function parseAdmision(body: unknown): ParseResult {
  const b = obj(body);
  const tipo: AdmisionTipo = b.tipo === "reinscripcion" ? "reinscripcion" : "nuevo";
  const al = obj(b.alumno);
  const dom = obj(b.domicilio);
  const em = obj(b.emergencia);
  const es = obj(b.escuela);
  const ing = obj(b.ingles);
  const ac = obj(b.actual);
  const cu = obj(b.cursada);
  const sa = obj(b.salud);
  const pa = obj(b.pago);
  const co = obj(b.conocio);
  const ct = obj(b.contacto);
  const fb = obj(b.feedback);
  const au = obj(b.autorizaciones);

  const data: AdmisionPayload = {
    tipo,
    alumno: {
      nombre: str(al.nombre, 80),
      apellido: str(al.apellido, 80),
      dni: digits(str(al.dni, 20)),
      nacimiento: str(al.nacimiento, 10),
      genero: str(al.genero, 40),
      telefono: str(al.telefono, 30),
      email: str(al.email, 254).toLowerCase(),
    },
    domicilio: {
      calle: str(dom.calle, 120),
      barrio: str(dom.barrio, 80),
      localidad: str(dom.localidad, 80),
      cp: str(dom.cp, 10),
      referencia: str(dom.referencia, 160),
    },
    responsable1: persona(b.responsable1),
    responsable2: persona(b.responsable2),
    emergencia: { nombre: str(em.nombre, 120), vinculo: str(em.vinculo, 60), telefono: str(em.telefono, 30) },
    escuela: { nombre: str(es.nombre, 120), anio: str(es.anio, 60), turno: str(es.turno, 40) },
    ingles: {
      estudio: str(ing.estudio, 80),
      donde: str(ing.donde, 160),
      nivel: str(ing.nivel, 80),
      examen: str(ing.examen, 60),
      objetivos: pickList(OBJETIVO_OPTIONS, ing.objetivos),
    },
    actual: {
      curso: str(ac.curso, 80),
      modulo: str(ac.modulo, 120),
      sede: str(ac.sede, 80),
      docente: str(ac.docente, 120),
      horario: str(ac.horario, 160),
      situacion: str(ac.situacion, 80),
      motivoBaja: str(ac.motivoBaja, 400),
    },
    cursada: {
      curso: str(cu.curso, 80),
      turno: str(cu.turno, 40),
      sede: str(cu.sede, 80),
      dias: pickList(DIA_OPTIONS, cu.dias),
      horarios: str(cu.horarios, 200),
      inicio: str(cu.inicio, 60),
      hermanos: str(cu.hermanos, 200),
    },
    salud: { cobertura: str(sa.cobertura, 120), condiciones: str(sa.condiciones, 600), necesidades: str(sa.necesidades, 600) },
    pago: {
      quien: str(pa.quien, 40),
      forma: str(pa.forma, 60),
      factura: str(pa.factura, 3),
      facturaNombre: str(pa.facturaNombre, 120),
      facturaDoc: digits(str(pa.facturaDoc, 20)),
      cupon: str(pa.cupon, 40),
    },
    conocio: { medio: str(co.medio, 80), detalle: str(co.detalle, 160) },
    contacto: { medio: str(ct.medio, 20), franja: str(ct.franja, 30) },
    feedback: {
      puntaje: str(fb.puntaje, 1),
      gusto: str(fb.gusto, 400),
      mejorar: str(fb.mejorar, 400),
      recomienda: str(fb.recomienda, 3),
    },
    comentarios: str(b.comentarios, 600),
    autorizaciones: {
      datos: au.datos === true,
      imagen: au.imagen === true,
      urgencias: au.urgencias === true,
      retiroSolo: str(au.retiroSolo, 3),
      autorizadosRetiro: str(au.autorizadosRetiro, 400),
    },
    website: str(b.website, 100),
  };

  const fail = (error: string): ParseResult => ({ ok: false, error });

  if (data.alumno.nombre.length < 2) return fail("Escribí el nombre del alumno/a.");
  if (data.alumno.apellido.length < 2) return fail("Escribí el apellido del alumno/a.");
  if (data.alumno.dni.length < 6 || data.alumno.dni.length > 9) return fail("Revisá el DNI del alumno/a.");
  const edad = ageFrom(data.alumno.nacimiento);
  if (edad === null) return fail("Revisá la fecha de nacimiento.");
  const esMenor = edad < 18;

  if (data.alumno.telefono && !phoneOk(data.alumno.telefono)) return fail("Revisá el teléfono del alumno/a.");
  if (data.alumno.email && !emailOk(data.alumno.email)) return fail("Revisá el email del alumno/a.");
  if (!esMenor) {
    if (!phoneOk(data.alumno.telefono)) return fail("Escribí tu WhatsApp de contacto.");
    if (!emailOk(data.alumno.email)) return fail("Escribí tu email de contacto.");
  }

  if (data.domicilio.calle.length < 3) return fail("Escribí la calle y el número del domicilio.");
  if (data.domicilio.localidad.length < 2) return fail("Escribí la localidad.");

  if (esMenor) {
    const r1 = data.responsable1;
    if (r1.nombre.length < 3) return fail("Escribí el nombre y apellido del responsable.");
    if (!inList(VINCULO_OPTIONS, r1.vinculo)) return fail("Elegí el vínculo del responsable con el alumno/a.");
    if (!phoneOk(r1.telefono)) return fail("Revisá el WhatsApp del responsable.");
    if (!emailOk(r1.email)) return fail("Revisá el email del responsable.");
    if (data.escuela.nombre.length < 2) return fail("Escribí a qué escuela asiste el alumno/a.");
    if (!inList(ANIO_ESCOLAR_OPTIONS, data.escuela.anio)) return fail("Elegí el año o grado que cursa.");
    if (data.autorizaciones.retiroSolo !== "si" && data.autorizaciones.retiroSolo !== "no") {
      return fail("Indicá si el alumno/a puede retirarse solo/a.");
    }
  }
  const r2 = data.responsable2;
  if (r2.nombre && (!phoneOk(r2.telefono) || (r2.email && !emailOk(r2.email)))) {
    return fail("Revisá los datos del segundo responsable.");
  }
  if (data.emergencia.nombre && !phoneOk(data.emergencia.telefono)) return fail("Revisá el teléfono del contacto de emergencia.");

  if (!inList(FORMA_PAGO_OPTIONS, data.pago.forma)) return fail("Elegí cómo preferís pagar.");
  if (data.pago.factura === "si" && (data.pago.facturaNombre.length < 3 || data.pago.facturaDoc.length < 7)) {
    return fail("Completá el nombre y el DNI o CUIT para la factura.");
  }
  if (data.pago.quien && !inList(QUIEN_PAGA_OPTIONS, data.pago.quien)) return fail("Revisá quién se hace cargo del pago.");

  const continua = data.actual.situacion !== NO_CONTINUA;
  if (tipo === "nuevo") {
    if (!inList(INGLES_ESTUDIO_OPTIONS, data.ingles.estudio)) return fail("Contanos si ya estudió inglés.");
    if (!inList(NIVEL_OPTIONS, data.ingles.nivel)) return fail("Elegí el nivel de inglés actual.");
    if (!inList(CONOCIO_OPTIONS, data.conocio.medio)) return fail("Contanos cómo nos conociste.");
  } else {
    if (!inList(CURSO_ACTUAL_OPTIONS, data.actual.curso)) return fail("Elegí el curso que hizo en 2026.");
    if (data.actual.modulo.length < 2) return fail("Escribí el módulo o nivel que hizo en 2026.");
    if (!inList(SITUACION_OPTIONS, data.actual.situacion)) return fail("Elegí qué va a pasar en 2027.");
  }
  if (tipo === "nuevo" || continua) {
    if (!inList(CURSO_OPTIONS, data.cursada.curso)) return fail("Elegí el curso para 2027.");
    if (!inList(TURNO_OPTIONS, data.cursada.turno)) return fail("Elegí el turno.");
    if (!inList(SEDE_OPTIONS, data.cursada.sede)) return fail("Elegí la sede.");
  }

  if (!data.autorizaciones.datos) return fail("Para enviar la solicitud tenés que aceptar el tratamiento de datos.");

  return { ok: true, data, edad };
}
