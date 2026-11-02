import { prisma } from "@/lib/prisma";
import { generatePendingPasswordHash } from "@/lib/pending-account";
import { resumenComoTexto, type AdmisionDetalle } from "@/lib/admisiones-resumen";

export type ConvertResult =
  | { ok: true; studentId: string; actualizado: boolean; emailAlias?: string }
  | { ok: false; status: number; error: string };

// Pasa una solicitud de admisión (inscripción o reinscripción) a legajo de alumno.
// La cuenta queda sin habilitar: la dirección la habilita desde el legajo cuando corresponda.
export async function convertirSolicitudEnAlumno(leadId: string): Promise<ConvertResult> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, status: 404, error: "No encontrada" };
  if (lead.kind === "CONSULTA" || !lead.details) {
    return { ok: false, status: 400, error: "Solo se pasan a alumno las solicitudes completas del formulario de admisiones." };
  }

  const d = lead.details as unknown as AdmisionDetalle;
  const nombre = [d.alumno?.nombre, d.alumno?.apellido].filter(Boolean).join(" ").trim();
  const dni = d.alumno?.dni;
  const email = d.alumno?.email || d.responsable1?.email || lead.email;
  const phone = d.alumno?.telefono || d.responsable1?.telefono || lead.phone;
  if (!nombre || !dni || !email) {
    return { ok: false, status: 400, error: "Faltan el nombre, el DNI o un email para crear el legajo." };
  }

  const address = [d.domicilio?.calle, d.domicilio?.barrio, d.domicilio?.localidad, d.domicilio?.cp].filter(Boolean).join(", ") || null;
  const notes = `Solicitud de ${lead.kind === "REINSCRIPCION" ? "reinscripción" : "inscripción"} 2027 (${new Date(lead.createdAt).toLocaleDateString("es-AR")})\n\n${resumenComoTexto(d)}`;
  const birthDate = d.alumno?.nacimiento ? new Date(`${d.alumno.nacimiento}T00:00:00`) : null;

  const contactos = [
    d.responsable1?.nombre && { name: d.responsable1.nombre, relationship: d.responsable1.vinculo || "Responsable", phone: d.responsable1.telefono, email: d.responsable1.email || null },
    d.responsable2?.nombre && { name: d.responsable2.nombre, relationship: d.responsable2.vinculo || "Responsable", phone: d.responsable2.telefono, email: d.responsable2.email || null },
    d.emergencia?.nombre && { name: d.emergencia.nombre, relationship: d.emergencia.vinculo || "Emergencia", phone: d.emergencia.telefono, email: null },
  ].filter((c): c is { name: string; relationship: string; phone: string; email: string | null } => !!c && !!c.phone);

  // En una reinscripción el alumno ya suele tener legajo: se actualiza en vez de duplicarlo.
  const existente = await prisma.studentProfile.findUnique({ where: { dni }, include: { contacts: true } });
  if (existente) {
    const telefonosCargados = new Set(existente.contacts.map((c) => c.phone.replace(/\D/g, "")));
    const nuevos = contactos.filter((c) => !telefonosCargados.has(c.phone.replace(/\D/g, "")));
    await prisma.$transaction([
      prisma.studentProfile.update({
        where: { id: existente.id },
        data: {
          phone: phone || existente.phone,
          address: address ?? existente.address,
          notes: `${notes}${existente.notes ? `\n\n---\nNotas anteriores:\n${existente.notes}` : ""}`,
        },
      }),
      ...nuevos.map((c) => prisma.emergencyContact.create({ data: { studentId: existente.id, ...c } })),
      prisma.lead.update({ where: { id: leadId }, data: { status: "INSCRIPTO" } }),
    ]);
    return { ok: true, studentId: existente.id, actualizado: true };
  }

  // Hermanos suelen compartir el email de los padres y cada usuario necesita uno propio:
  // si ya está tomado, se usa un alias (laura+DNI@gmail.com) que llega a la misma casilla.
  const [local, dominio] = email.split("@");
  const alias = dominio ? `${local.split("+")[0]}+${dni}@${dominio}` : null;
  const intentos = [email, ...(alias && alias !== email ? [alias] : [])];

  for (const intento of intentos) {
    try {
      const passwordHash = await generatePendingPasswordHash();
      const student = await prisma.studentProfile.create({
        data: {
          dni,
          phone,
          address,
          birthDate,
          notes,
          user: { create: { name: nombre, email: intento, passwordHash, roles: ["ALUMNO"], enabled: false } },
          contacts: { create: contactos },
        },
      });
      await prisma.lead.update({ where: { id: leadId }, data: { status: "INSCRIPTO" } });
      return { ok: true, studentId: student.id, actualizado: false, emailAlias: intento !== email ? intento : undefined };
    } catch (err) {
      const e = err as { code?: string; meta?: { target?: unknown } };
      const porEmail = e.code === "P2002" && String(e.meta?.target ?? "").includes("email");
      if (porEmail && intento !== intentos[intentos.length - 1]) continue;
      if (e.code === "P2002") {
        return {
          ok: false,
          status: 409,
          error: porEmail
            ? "Ya existe un usuario con ese email. Cargá este alumno a mano desde Alumnos con otro email."
            : "Ya existe un alumno con ese DNI.",
        };
      }
      console.error("No se pudo pasar la solicitud a alumno", err);
      return { ok: false, status: 500, error: "No se pudo crear el legajo. Probá de nuevo." };
    }
  }
  return { ok: false, status: 500, error: "No se pudo crear el legajo. Probá de nuevo." };
}
