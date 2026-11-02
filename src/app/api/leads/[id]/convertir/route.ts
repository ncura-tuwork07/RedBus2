import { NextResponse } from "next/server";
import { requireRole } from "@/lib/require-role";
import { convertirSolicitudEnAlumno } from "@/lib/admisiones-convertir";

// Pasa una solicitud de admisión a legajo de alumno (ver lib/admisiones-convertir).
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireRole("DIRECTIVO");
  if (response) return response;

  const { id } = await params;
  const result = await convertirSolicitudEnAlumno(id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true, studentId: result.studentId, actualizado: result.actualizado, emailAlias: result.emailAlias ?? null });
}
