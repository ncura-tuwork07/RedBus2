"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  ANIO_ESCOLAR_OPTIONS,
  CONOCIO_OPTIONS,
  CONSENTIMIENTO_TEXTO,
  CONTACTO_FRANJA_OPTIONS,
  CONTACTO_MEDIO_OPTIONS,
  CURSO_ACTUAL_OPTIONS,
  CURSO_OPTIONS,
  DIA_OPTIONS,
  ESCUELA_TURNO_OPTIONS,
  EXAMEN_OPTIONS,
  FORMA_PAGO_OPTIONS,
  GENERO_OPTIONS,
  IMAGEN_TEXTO,
  INGLES_ESTUDIO_OPTIONS,
  INICIO_OPTIONS,
  LOCALIDADES,
  NIVEL_OPTIONS,
  NO_CONTINUA,
  OBJETIVO_OPTIONS,
  PUNTAJE_OPTIONS,
  QUIEN_PAGA_OPTIONS,
  SEDE_OPTIONS,
  SITUACION_OPTIONS,
  TURNO_OPTIONS,
  URGENCIAS_TEXTO,
  VINCULO_OPTIONS,
  ageFrom,
  emptyAdmision,
  type AdmisionPayload,
  type AdmisionTipo,
} from "@/lib/admisiones";
import { BRAND, WHATSAPP, whatsappLink } from "@/lib/brand";

const REDIRECT_SECONDS = 8;

const controlClass =
  "w-full rounded-md border-[1.5px] border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30";

type Obj = Record<string, unknown>;
const getIn = (o: Obj, path: string) => path.split(".").reduce<unknown>((acc, key) => (acc as Obj | undefined)?.[key], o);
function setIn(o: Obj, keys: string[], value: unknown): Obj {
  const [head, ...rest] = keys;
  return { ...o, [head]: rest.length ? setIn((o[head] as Obj) ?? {}, rest, value) : value };
}

function Section({ number, title, note, children }: { number: number; title: string; note?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-neutral-200 pt-6">
      <legend className="mb-1 flex items-center gap-2.5 text-base font-bold text-accent-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">{number}</span>
        {title}
      </legend>
      {note && <p className="-mt-1 text-sm text-neutral-600">{note}</p>}
      {children}
    </fieldset>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function FieldShell({ id, label, required, hint, children }: { id: string; label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-primary-500"> *</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-neutral-600">{hint}</p>}
    </div>
  );
}

type TextProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  autoComplete?: string;
  list?: string;
  max?: string;
};
function TextField({ id, label, value, onChange, required, hint, type = "text", inputMode, autoComplete = "off", list, max }: TextProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <Input
        id={id}
        type={type}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        list={list}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  );
}

function SelectField({ id, label, value, onChange, options, required, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; options: readonly string[]; required?: boolean; hint?: string }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <select id={id} className={controlClass} value={value} required={required} onChange={(e) => onChange(e.target.value)}>
        <option value="">{required ? "Elegí una opción" : "Elegí una opción (opcional)"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function TextAreaField({ id, label, value, onChange, required, hint, rows = 3 }: { id: string; label: string; value: string; onChange: (v: string) => void; required?: boolean; hint?: string; rows?: number }) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint}>
      <textarea id={id} rows={rows} maxLength={600} required={required} className={controlClass} value={value} onChange={(e) => onChange(e.target.value)} />
    </FieldShell>
  );
}

function ChipGroup({ legend, options, values, onChange, hint }: { legend: string; options: readonly string[]; values: string[]; onChange: (v: string[]) => void; hint?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-neutral-700">{legend}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <label
              key={o}
              className={`cursor-pointer rounded-full border-[1.5px] px-3.5 py-1.5 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-primary-500/40 ${
                on ? "border-accent-500 bg-accent-500 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-accent-300"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={on}
                onChange={() => onChange(on ? values.filter((v) => v !== o) : [...values, o])}
              />
              {o}
            </label>
          );
        })}
      </div>
      {hint && <p className="text-xs text-neutral-600">{hint}</p>}
    </div>
  );
}

function YesNo({ name, legend, value, onChange, required }: { name: string; legend: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-neutral-700">
        {legend}
        {required && <span className="text-primary-500"> *</span>}
      </legend>
      <div className="flex gap-3">
        {[
          { v: "si", l: "Sí" },
          { v: "no", l: "No" },
        ].map((o) => (
          <label key={o.v} className={`cursor-pointer rounded-full border-[1.5px] px-5 py-1.5 text-sm font-bold ${value === o.v ? "border-accent-500 bg-accent-500 text-white" : "border-neutral-200 bg-white text-neutral-700"}`}>
            <input type="radio" name={name} className="sr-only" required={required} checked={value === o.v} onChange={() => onChange(o.v)} />
            {o.l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Check({ checked, onChange, required, children }: { checked: boolean; onChange: (v: boolean) => void; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-800">
      <input type="checkbox" required={required} checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#bd3138]" />
      <span>{children}</span>
    </label>
  );
}

export function AdmisionForm({ initialTipo }: { initialTipo: AdmisionTipo | null }) {
  const router = useRouter();
  const [tipo, setTipo] = useState<AdmisionTipo | null>(initialTipo);
  const [form, setForm] = useState<AdmisionPayload>(() => emptyAdmision(initialTipo ?? "nuevo"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const errorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (path: string, value: unknown) =>
    setForm((prev) => setIn(prev as unknown as Obj, path.split("."), value) as unknown as AdmisionPayload);
  const val = (path: string) => ((getIn(form as unknown as Obj, path) as string | undefined) ?? "");
  const list = (path: string) => ((getIn(form as unknown as Obj, path) as string[] | undefined) ?? []);

  // atajos que devuelven JSX (no son componentes: así los campos no se re-montan al tipear)
  const t = (path: string, label: string, o: Partial<TextProps> = {}) => (
    <TextField id={path} label={label} value={val(path)} onChange={(v) => set(path, v)} {...o} />
  );
  const s = (path: string, label: string, options: readonly string[], o: { required?: boolean; hint?: string } = {}) => (
    <SelectField id={path} label={label} value={val(path)} onChange={(v) => set(path, v)} options={options} {...o} />
  );
  const ta = (path: string, label: string, o: { required?: boolean; hint?: string; rows?: number } = {}) => (
    <TextAreaField id={path} label={label} value={val(path)} onChange={(v) => set(path, v)} {...o} />
  );

  function chooseTipo(next: AdmisionTipo) {
    setTipo(next);
    setForm((prev) => ({ ...prev, tipo: next }));
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  useEffect(() => {
    if (!done) return;
    if (seconds <= 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setSeconds((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [done, seconds, router]);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !tipo) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admisiones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tipo }),
    }).catch(() => null);
    setSaving(false);
    if (!res) {
      setError("No pudimos conectarnos. Revisá tu conexión y probá de nuevo.");
      return;
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "No se pudo enviar la solicitud. Probá de nuevo.");
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-700">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </span>
        <h2 className="font-display mt-5 text-xl font-extrabold text-accent-500">¡Recibimos tu solicitud!</h2>
        <p className="mx-auto mt-3 max-w-[440px] text-neutral-700">
          Ya tenemos todos tus datos. Te escribimos por {val("contacto.medio") || "WhatsApp"} para confirmar la vacante, coordinar el pago y la fecha de inicio. Gracias por elegir {BRAND.name}.
        </p>
        <p className="mt-6 text-sm text-neutral-600" aria-live="polite">
          Te llevamos a nuestra web en {seconds} {seconds === 1 ? "segundo" : "segundos"}…
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <LinkButton href="/" variant="primary">
            Ir a la web ahora
          </LinkButton>
          <LinkButton href={whatsappLink("¡Hola! Acabo de completar el formulario de inscripción 2027.")} target="_blank" rel="noopener noreferrer" variant="secondary">
            Escribir por WhatsApp
          </LinkButton>
        </div>
      </div>
    );
  }

  const edad = ageFrom(form.alumno.nacimiento);
  const esMenor = edad !== null && edad < 18;
  const esAdulto = edad !== null && edad >= 18;
  const esReinscripcion = tipo === "reinscripcion";
  const continua = form.actual.situacion !== NO_CONTINUA;
  const pideCursada = tipo === "nuevo" || continua;
  // numeración de secciones en el orden en que realmente se muestran
  let sectionCount = 0;
  const next = () => ++sectionCount;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Tipo de solicitud">
        <button
          type="button"
          onClick={() => chooseTipo("nuevo")}
          aria-pressed={tipo === "nuevo"}
          className={`rounded-[20px] border-2 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 ${
            tipo === "nuevo" ? "border-primary-500 bg-primary-50" : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/50"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary-500 text-white">
            <UserPlus className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="mt-3 block text-lg font-bold text-accent-500">Soy nuevo</span>
          <span className="mt-0.5 block text-sm text-neutral-700">Va a ser mi primer año: quiero solicitar una inscripción.</span>
        </button>
        <button
          type="button"
          onClick={() => chooseTipo("reinscripcion")}
          aria-pressed={tipo === "reinscripcion"}
          className={`rounded-[20px] border-2 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-turquesa-500/50 ${
            tipo === "reinscripcion" ? "border-turquesa-500 bg-turquesa-50" : "border-neutral-200 bg-white hover:border-turquesa-200 hover:bg-turquesa-50/50"
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-turquesa-500 text-white">
            <RefreshCw className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="mt-3 block text-lg font-bold text-accent-500">Ya soy parte de Red Bus</span>
          <span className="mt-0.5 block text-sm text-neutral-700">Soy alumno: quiero reinscribirme y matricularme para 2027.</span>
        </button>
      </div>

      {!tipo && <p className="mt-5 text-center text-sm text-neutral-600">Elegí una opción para abrir el formulario.</p>}

      {tipo && (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-8 scroll-mt-4 space-y-6">
          <p className="rounded-[14px] bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
            Cuanto más completo, menos tenemos que preguntarte después: con estos datos solo vamos a coordinar el pago y la fecha de inicio. Los campos con <span className="font-bold text-primary-500">*</span> son obligatorios.
          </p>

          {error && (
            <div ref={errorRef} role="alert" className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
              {error}
            </div>
          )}

          <Section number={next()} title={esReinscripcion ? "¿Quién es el alumno/a?" : "Datos del alumno/a"}>
            <Grid>
              {t("alumno.nombre", "Nombre/s", { required: true, autoComplete: "given-name" })}
              {t("alumno.apellido", "Apellido/s", { required: true, autoComplete: "family-name" })}
            </Grid>
            <Grid>
              {t("alumno.dni", "DNI", { required: true, inputMode: "numeric", hint: "Solo números, sin puntos." })}
              <div>
                {t("alumno.nacimiento", "Fecha de nacimiento", { required: true, type: "date", max: new Date().toISOString().slice(0, 10) })}
                {edad !== null && <p className="mt-1.5 text-sm font-bold text-turquesa-700">Edad: {edad} {edad === 1 ? "año" : "años"}</p>}
              </div>
            </Grid>
            {s("alumno.genero", "Género", GENERO_OPTIONS)}
            <Grid>
              {t("alumno.telefono", esAdulto ? "Tu WhatsApp" : "WhatsApp del alumno/a (si tiene)", { required: esAdulto, type: "tel", autoComplete: "tel", hint: "Con código de área, sin el 15. Ej: 11 2233 4455" })}
              {t("alumno.email", esAdulto ? "Tu email" : "Email del alumno/a (si tiene)", { required: esAdulto, type: "email", autoComplete: "email" })}
            </Grid>
          </Section>

          <Section number={next()} title="Domicilio y zona" note="Nos sirve para saber de dónde viene cada alumno y ubicarlo en la sede más cercana.">
            {t("domicilio.calle", "Calle y número", { required: true, autoComplete: "street-address" })}
            <Grid>
              {t("domicilio.barrio", "Barrio")}
              <div>
                {t("domicilio.localidad", "Localidad", { required: true, list: "localidades", autoComplete: "address-level2" })}
                <datalist id="localidades">
                  {LOCALIDADES.map((l) => (
                    <option key={l} value={l} />
                  ))}
                </datalist>
              </div>
            </Grid>
            <Grid>
              {t("domicilio.cp", "Código postal", { inputMode: "numeric", autoComplete: "postal-code" })}
              {t("domicilio.referencia", "Referencia o entre calles")}
            </Grid>
          </Section>

          {edad === null || esMenor ? (
            <Section number={next()} title="Responsables" note={esMenor ? "El alumno/a es menor de edad: necesitamos al menos un responsable." : "Si el alumno/a es menor de 18 años, completá estos datos."}>
              <p className="text-sm font-bold text-accent-500">Responsable 1</p>
              {t("responsable1.nombre", "Nombre y apellido", { required: esMenor, autoComplete: "name" })}
              <Grid>
                {s("responsable1.vinculo", "Vínculo con el alumno/a", VINCULO_OPTIONS, { required: esMenor })}
                {t("responsable1.dni", "DNI del responsable", { inputMode: "numeric" })}
              </Grid>
              <Grid>
                {t("responsable1.telefono", "WhatsApp", { required: esMenor, type: "tel", hint: "Con código de área, sin el 15." })}
                {t("responsable1.email", "Email", { required: esMenor, type: "email" })}
              </Grid>
              <p className="pt-2 text-sm font-bold text-accent-500">Responsable 2 (opcional)</p>
              {t("responsable2.nombre", "Nombre y apellido")}
              <Grid>
                {s("responsable2.vinculo", "Vínculo con el alumno/a", VINCULO_OPTIONS)}
                {t("responsable2.telefono", "WhatsApp", { type: "tel" })}
              </Grid>
              {t("responsable2.email", "Email", { type: "email" })}
            </Section>
          ) : null}

          <Section
            number={next()}
            title="Contacto de emergencia"
            note={esMenor ? "Una persona distinta de los responsables, por si no los podemos ubicar." : "Una persona a quien avisar en caso de emergencia."}
          >
            {t("emergencia.nombre", "Nombre y apellido")}
            <Grid>
              {t("emergencia.vinculo", "Vínculo")}
              {t("emergencia.telefono", "Teléfono", { type: "tel" })}
            </Grid>
          </Section>

          <Section number={next()} title={esAdulto ? "Estudios o trabajo" : "Escuela"} note={esAdulto ? "Opcional." : undefined}>
            <Grid>
              {t("escuela.nombre", esAdulto ? "Dónde estudia o trabaja" : "Escuela a la que asiste", { required: esMenor })}
              {s("escuela.anio", "Año o grado que cursa", ANIO_ESCOLAR_OPTIONS, { required: esMenor })}
            </Grid>
            {s("escuela.turno", "Turno de la escuela", ESCUELA_TURNO_OPTIONS, { hint: "Para no superponer los horarios de inglés." })}
          </Section>

          {esReinscripcion ? (
            <Section number={next()} title="Cursada actual (2026) y plan para 2027">
              <Grid>
                {s("actual.curso", "Curso que hizo en 2026", CURSO_ACTUAL_OPTIONS, { required: true })}
                {t("actual.modulo", "Módulo o nivel de 2026", { required: true, hint: "Por ejemplo: Nivel 3, Comisión A." })}
              </Grid>
              <Grid>
                {t("actual.docente", "Docente de 2026")}
                {t("actual.horario", "Día y horario de 2026", { hint: "Por ejemplo: lunes y miércoles 18 hs." })}
              </Grid>
              {s("actual.situacion", "¿Qué va a pasar en 2027?", SITUACION_OPTIONS, { required: true })}
              {!continua && ta("actual.motivoBaja", "Si no continúa, ¿nos contás el motivo? (opcional)", { hint: "Nos ayuda a mejorar." })}
            </Section>
          ) : (
            <Section number={next()} title="Conocimientos de inglés">
              {s("ingles.estudio", "¿Ya estudió inglés?", INGLES_ESTUDIO_OPTIONS, { required: true })}
              {t("ingles.donde", "¿Dónde o con quién? (si corresponde)")}
              {s("ingles.nivel", "Nivel actual", NIVEL_OPTIONS, { required: true, hint: "Si dudás, elegí “quiero una prueba de nivel” y lo coordinamos." })}
              {s("ingles.examen", "¿Rindió algún examen internacional?", EXAMEN_OPTIONS)}
              <ChipGroup legend="¿Para qué quiere aprender inglés?" options={OBJETIVO_OPTIONS} values={list("ingles.objetivos")} onChange={(v) => set("ingles.objetivos", v)} hint="Podés elegir más de uno." />
            </Section>
          )}

          {pideCursada && (
            <Section number={next()} title="Cursada 2027">
              {s("cursada.curso", esReinscripcion ? "Curso para 2027" : "Curso de interés", CURSO_OPTIONS, { required: true })}
              <Grid>
                {s("cursada.turno", "Turno preferido", TURNO_OPTIONS, { required: true })}
                {s("cursada.sede", "Sede", SEDE_OPTIONS, { required: true })}
              </Grid>
              <ChipGroup legend="Días en que puede asistir" options={DIA_OPTIONS} values={list("cursada.dias")} onChange={(v) => set("cursada.dias", v)} />
              {t("cursada.horarios", "Horarios disponibles", { hint: "Por ejemplo: después de las 17 hs, o sábados a la mañana." })}
              <Grid>
                {s("cursada.inicio", "¿Cuándo querría empezar?", INICIO_OPTIONS)}
                {t("cursada.hermanos", "Hermanos/as en Red Bus (si hay)", { hint: "Nombre y apellido." })}
              </Grid>
            </Section>
          )}

          <Section number={next()} title="Salud y apoyos" note="Información confidencial: solo la ve el equipo de la escuela.">
            {t("salud.cobertura", "Obra social o cobertura médica")}
            {ta("salud.condiciones", "Alergias, medicación o condiciones de salud")}
            {ta("salud.necesidades", "Necesidades de apoyo o diagnósticos que debamos conocer", { hint: "Por ejemplo: TEA, TDAH, dislexia, CUD, adaptaciones. Es para acompañar mejor." })}
          </Section>

          <Section number={next()} title="Pago y facturación" note="Para tener el pago coordinado antes de hablar con vos.">
            <Grid>
              {s("pago.forma", "Forma de pago preferida", FORMA_PAGO_OPTIONS, { required: true })}
              {s("pago.quien", "¿Quién se hace cargo del pago?", QUIEN_PAGA_OPTIONS)}
            </Grid>
            <YesNo name="factura" legend="¿Necesita factura?" value={form.pago.factura} onChange={(v) => set("pago.factura", v)} />
            {form.pago.factura === "si" && (
              <Grid>
                {t("pago.facturaNombre", "Nombre o razón social", { required: true })}
                {t("pago.facturaDoc", "DNI o CUIT", { required: true, inputMode: "numeric" })}
              </Grid>
            )}
            {t("pago.cupon", "Código de descuento (si tenés)")}
          </Section>

          <Section number={next()} title={esReinscripcion ? "Tu opinión sobre 2026 y cómo contactarte" : "Cómo nos conociste y cómo contactarte"}>
            {esReinscripcion ? (
              <>
                {s("feedback.puntaje", "¿Cómo calificás el año? (1 a 5)", PUNTAJE_OPTIONS)}
                {ta("feedback.gusto", "¿Qué fue lo que más te gustó?")}
                {ta("feedback.mejorar", "¿Qué podemos mejorar?")}
                <YesNo name="recomienda" legend="¿Nos recomendarías?" value={form.feedback.recomienda} onChange={(v) => set("feedback.recomienda", v)} />
              </>
            ) : (
              <>
                {s("conocio.medio", "¿Cómo nos conociste?", CONOCIO_OPTIONS, { required: true })}
                {t("conocio.detalle", "Si fue por recomendación, ¿quién nos recomendó?")}
              </>
            )}
            <Grid>
              {s("contacto.medio", "Medio de contacto preferido", CONTACTO_MEDIO_OPTIONS)}
              {s("contacto.franja", "Mejor momento para contactarte", CONTACTO_FRANJA_OPTIONS)}
            </Grid>
            {ta("comentarios", "Comentarios o dudas (opcional)")}
          </Section>

          <Section number={next()} title="Autorizaciones">
            <Check required checked={form.autorizaciones.datos} onChange={(v) => set("autorizaciones.datos", v)}>
              <strong>Tratamiento de datos (obligatorio). </strong>
              {CONSENTIMIENTO_TEXTO}
            </Check>
            <Check checked={form.autorizaciones.imagen} onChange={(v) => set("autorizaciones.imagen", v)}>
              {IMAGEN_TEXTO}
            </Check>
            {(esMenor || edad === null) && (
              <>
                <Check checked={form.autorizaciones.urgencias} onChange={(v) => set("autorizaciones.urgencias", v)}>
                  {URGENCIAS_TEXTO}
                </Check>
                <YesNo name="retiro" legend="¿Puede retirarse solo/a al terminar la clase?" required={esMenor} value={form.autorizaciones.retiroSolo} onChange={(v) => set("autorizaciones.retiroSolo", v)} />
                {ta("autorizaciones.autorizadosRetiro", "Personas autorizadas a retirarlo/a", { hint: "Nombre, DNI y vínculo de cada una." })}
              </>
            )}
          </Section>

          {/* Trampa para bots: una persona no lo ve ni lo completa */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              No completar
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            {saving && <Spinner className="mr-2" />}
            {saving ? "Enviando…" : "Enviar solicitud"}
          </Button>
          <p className="text-center text-xs text-neutral-600">¿Dudas? Escribinos al WhatsApp {WHATSAPP.display}.</p>
        </form>
      )}
    </div>
  );
}
