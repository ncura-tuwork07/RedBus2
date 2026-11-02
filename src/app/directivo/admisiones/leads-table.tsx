"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, Search, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerSection, DrawerField } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Spinner } from "@/components/ui/spinner";
import { WhatsAppButton, WhatsAppIcon } from "@/components/ui/whatsapp-button";
import { resumenAdmision, type AdmisionDetalle } from "@/lib/admisiones-resumen";
import { admisionTemplates, leadMessage } from "@/lib/whatsapp-templates";
import { whatsappChatUrl } from "@/lib/phone";

type LeadStatus = "NUEVO" | "CONTACTADO" | "VACANTE_RESERVADA" | "INSCRIPTO" | "DESCARTADO";
type LeadKind = "CONSULTA" | "INSCRIPCION" | "REINSCRIPCION";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  interest: string;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  kind: LeadKind;
  details: unknown;
  createdAt: string | Date;
};

const statusTone: Record<LeadStatus, "success" | "warning" | "danger" | "neutral"> = {
  NUEVO: "warning",
  CONTACTADO: "neutral",
  VACANTE_RESERVADA: "success",
  INSCRIPTO: "success",
  DESCARTADO: "danger",
};

const statusLabel: Record<LeadStatus, string> = {
  NUEVO: "Nuevo",
  CONTACTADO: "Contactado",
  VACANTE_RESERVADA: "Vacante reservada",
  INSCRIPTO: "Inscripto",
  DESCARTADO: "Descartado",
};

const kindLabel: Record<LeadKind, string> = {
  CONSULTA: "Consulta",
  INSCRIPCION: "Inscripción",
  REINSCRIPCION: "Reinscripción",
};

const kindTone: Record<LeadKind, "navy" | "teal" | "red"> = {
  CONSULTA: "navy",
  INSCRIPCION: "red",
  REINSCRIPCION: "teal",
};

const selectClass =
  "w-full rounded-md border-[1.5px] border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30";

function detalleDe(lead: Lead): AdmisionDetalle | null {
  return lead.details && typeof lead.details === "object" ? (lead.details as AdmisionDetalle) : null;
}

function alumnoDe(lead: Lead): string {
  const d = detalleDe(lead);
  return d?.alumno ? [d.alumno.nombre, d.alumno.apellido].filter(Boolean).join(" ") : "";
}

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [kind, setKind] = useState<LeadKind | "TODOS">("TODOS");
  const [status, setStatus] = useState<LeadStatus | "TODOS">("TODOS");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<LeadKind | "TODOS", number> = { TODOS: initialLeads.length, CONSULTA: 0, INSCRIPCION: 0, REINSCRIPCION: 0 };
    for (const l of initialLeads) c[l.kind] += 1;
    return c;
  }, [initialLeads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialLeads.filter((l) => {
      if (kind !== "TODOS" && l.kind !== kind) return false;
      if (status !== "TODOS" && l.status !== status) return false;
      if (!q) return true;
      return `${l.name} ${alumnoDe(l)} ${l.phone} ${l.email ?? ""} ${l.interest}`.toLowerCase().includes(q);
    });
  }, [initialLeads, kind, status, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tipo de solicitud">
        {(["TODOS", "INSCRIPCION", "REINSCRIPCION", "CONSULTA"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm font-bold transition-colors ${
              kind === k ? "border-accent-500 bg-accent-500 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-accent-300"
            }`}
          >
            {k === "TODOS" ? "Todas" : `${kindLabel[k]}${k === "CONSULTA" ? "s" : "es"}`} <span className="opacity-70">({counts[k]})</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <Input aria-label="Buscar solicitudes" placeholder="Buscar por nombre, alumno, teléfono o curso…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select aria-label="Filtrar por estado" className={`${selectClass} w-auto min-w-[180px]`} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "TODOS")}>
          <option value="TODOS">Todos los estados</option>
          {(Object.keys(statusLabel) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Contacto</Th>
            <Th>Tipo</Th>
            <Th>Teléfono</Th>
            <Th>Interés</Th>
            <Th>Estado</Th>
            <Th>Fecha</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((lead) => {
            const alumno = alumnoDe(lead);
            return (
              <Tr key={lead.id} className="cursor-pointer" onClick={() => setSelected(lead)}>
                <Td>
                  <div className="font-medium text-neutral-900">{lead.name}</div>
                  {alumno && <div className="text-xs text-neutral-600">Alumno/a: {alumno}</div>}
                </Td>
                <Td>
                  <Pill tone={kindTone[lead.kind]} className="px-2.5 py-1 text-[10px]">
                    {kindLabel[lead.kind]}
                  </Pill>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <span>{lead.phone}</span>
                    <WhatsAppButton
                      phone={lead.phone}
                      text={leadMessage(lead.name, lead.interest, lead.kind)}
                      label={`Escribir por WhatsApp a ${lead.name}`}
                    />
                  </div>
                </Td>
                <Td>{lead.interest}</Td>
                <Td>
                  <Badge tone={statusTone[lead.status]}>{statusLabel[lead.status]}</Badge>
                </Td>
                <Td>{new Date(lead.createdAt).toLocaleDateString("es-AR")}</Td>
              </Tr>
            );
          })}
          {filtered.length === 0 && (
            <Tr>
              <Td colSpan={6} className="text-center text-neutral-500">
                {initialLeads.length === 0 ? "Todavía no hay solicitudes." : "No hay solicitudes con ese filtro."}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {selected && <LeadDrawer key={selected.id} lead={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <span className="whitespace-pre-line font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const router = useRouter();
  const detalle = detalleDe(lead);
  const esSolicitud = lead.kind !== "CONSULTA" && detalle !== null;
  const alumno = alumnoDe(lead);

  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertResult, setConvertResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [templateId, setTemplateId] = useState("recepcion");
  const [pagoInfo, setPagoInfo] = useState("");

  const templates = useMemo(
    () =>
      admisionTemplates({
        contacto: lead.name,
        alumno,
        reinscripcion: lead.kind === "REINSCRIPCION",
        curso: detalle?.cursada?.curso || lead.interest,
        turno: detalle?.cursada?.turno,
        sede: detalle?.cursada?.sede,
        pagoInfo,
      }),
    [lead, alumno, detalle, pagoInfo],
  );
  const template = templates.find((t) => t.id === templateId) ?? templates[0];
  const waUrl = whatsappChatUrl(lead.phone, template.text);
  const nivelSinDefinir = detalle?.ingles?.nivel?.startsWith("No sé");

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
    if (res.ok) {
      onClose();
      router.refresh();
    }
  }

  async function handleConvert() {
    if (converting) return;
    setConverting(true);
    setConvertResult(null);
    const res = await fetch(`/api/leads/${lead.id}/convertir`, { method: "POST" });
    const data = await res.json().catch(() => null);
    setConverting(false);
    if (res.ok) {
      setStatus("INSCRIPTO");
      setConvertResult({
        ok: true,
        text: data?.actualizado
          ? "El alumno ya tenía legajo: se actualizaron sus datos y contactos."
          : data?.emailAlias
            ? `Legajo creado. Ese email ya lo usaba otro alumno, así que el usuario quedó con el alias ${data.emailAlias} (llega a la misma casilla). La cuenta queda sin habilitar hasta que la actives desde Alumnos.`
            : "Legajo creado. La cuenta queda sin habilitar hasta que la actives desde Alumnos.",
      });
      router.refresh();
    } else {
      setConvertResult({ ok: false, text: data?.error ?? "No se pudo crear el legajo." });
    }
  }

  return (
    <Drawer open onClose={onClose} title={lead.name} subtitle={alumno ? `Alumno/a: ${alumno}` : lead.phone} wide>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={kindTone[lead.kind]}>{kindLabel[lead.kind]}</Pill>
        <Badge tone={statusTone[lead.status]}>{statusLabel[lead.status]}</Badge>
        <span className="text-xs text-neutral-600">{new Date(lead.createdAt).toLocaleDateString("es-AR")}</span>
        {nivelSinDefinir && <Badge tone="warning">Pide prueba de nivel</Badge>}
      </div>

      <DrawerSection title="Contactar">
        <div className="flex flex-wrap gap-2">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-4 py-2 text-sm font-bold text-white hover:bg-[#188a45]"
            >
              <WhatsAppIcon className="h-5 w-5" /> Abrir WhatsApp con este mensaje
            </a>
          )}
          <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-800 hover:bg-neutral-100">
            <Phone className="h-4 w-4" aria-hidden="true" /> Llamar
          </a>
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-800 hover:bg-neutral-100">
              <Mail className="h-4 w-4" aria-hidden="true" /> Email
            </a>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="tpl" className="block text-sm font-medium text-neutral-700">
            Mensaje
          </label>
          <select id="tpl" className={selectClass} value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        {templateId === "pago" && (
          <div className="space-y-1.5">
            <label htmlFor="pago-info" className="block text-sm font-medium text-neutral-700">
              Link de pago o datos para transferir
            </label>
            <Input id="pago-info" placeholder="Pegá el link de Mercado Pago o el alias" value={pagoInfo} onChange={(e) => setPagoInfo(e.target.value)} />
          </div>
        )}
        <p className="rounded-lg bg-neutral-100 px-3.5 py-3 text-sm text-neutral-800">{template.text}</p>
        <p className="text-xs text-neutral-600">Se abre WhatsApp con el texto ya escrito; lo podés editar antes de enviar.</p>
      </DrawerSection>

      <DrawerSection title="Seguimiento">
        <div className="space-y-1.5">
          <label htmlFor="lead-status" className="block text-sm font-medium text-neutral-700">
            Estado
          </label>
          <select id="lead-status" className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
            {(Object.keys(statusLabel) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lead-notes" className="block text-sm font-medium text-neutral-700">
            Notas internas
          </label>
          <textarea id="lead-notes" className={selectClass} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas de seguimiento…" />
        </div>
        <Button variant="primary" onClick={handleSave}>
          {saving && <Spinner className="mr-2" />}
          {saving ? "Guardando…" : "Guardar"}
        </Button>

        {esSolicitud && (
          <div className="rounded-[16px] border-[1.5px] border-turquesa-200 bg-turquesa-50 p-4">
            <p className="text-sm font-bold text-accent-500">Cuando tengas el pago y la vacante</p>
            <p className="mt-1 text-sm text-neutral-700">
              Crea el legajo del alumno con todos estos datos (domicilio, responsables, salud y apoyos) y deja la solicitud como inscripta.
            </p>
            <Button variant="primary" size="sm" className="mt-3" onClick={handleConvert}>
              {converting ? <Spinner className="mr-2" /> : <UserCheck className="mr-2 inline h-4 w-4" aria-hidden="true" />}
              {converting ? "Creando legajo…" : "Pasar a alumno"}
            </Button>
            {convertResult && (
              <p role="status" className={`mt-3 text-sm font-medium ${convertResult.ok ? "text-success-700" : "text-danger-700"}`}>
                {convertResult.text}{" "}
                {convertResult.ok && (
                  <Link href="/directivo/alumnos" className="font-bold underline">
                    Ver alumnos
                  </Link>
                )}
              </p>
            )}
          </div>
        )}
      </DrawerSection>

      {esSolicitud && detalle ? (
        resumenAdmision(detalle).map((section) => (
          <DrawerSection key={section.title} title={section.title}>
            <div className="space-y-2.5">
              {section.rows.map(([label, value]) => (
                <DetailRow key={label} label={label} value={value} />
              ))}
            </div>
          </DrawerSection>
        ))
      ) : (
        <DrawerSection title="Datos del interesado">
          <DrawerField label="Nombre" value={lead.name} />
          <DrawerField label="Teléfono" value={lead.phone} />
          <DrawerField label="Email" value={lead.email} />
          <DrawerField label="Interés" value={lead.interest} />
          {lead.message && <DrawerField label="Mensaje" value={lead.message} />}
        </DrawerSection>
      )}
    </Drawer>
  );
}

