import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { BRAND } from "@/lib/brand";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, clearRateLimit } from "@/lib/rate-limit";

const TOKEN_TTL_MS = 60 * 60 * 1000;
export const MIN_PASSWORD_LENGTH = 8;
export const INVALID_LINK_ERROR = "El enlace no es válido o ya venció. Pedí uno nuevo.";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function resetEmail(name: string, link: string) {
  const safeName = escapeHtml(name.split(" ")[0] || "");
  const subject = `Restablecé tu contraseña · ${BRAND.name}`;
  const text =
    `Hola ${name.split(" ")[0] || ""}!\n\n` +
    `Pediste restablecer tu contraseña del portal de ${BRAND.name}. Entrá a este enlace para elegir una nueva (vale por 1 hora):\n\n${link}\n\n` +
    `Si no lo pediste vos, ignorá este correo: tu contraseña actual sigue funcionando.`;
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#f6f2ef;font-family:Quicksand,Arial,sans-serif;color:#2b2450">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ef;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="background:#3e356a;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:800;letter-spacing:.02em">RED BUS <span style="display:block;font-size:11px;font-weight:700;letter-spacing:.14em;color:#c2ddff;margin-top:4px">SCHOOL OF ENGLISH</span></td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#3e356a">¡Hola ${safeName}!</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5">Pediste restablecer tu contraseña del portal. Tocá el botón para elegir una nueva. El enlace vale por <strong>1 hora</strong> y se puede usar una sola vez.</p>
<p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;background:#bd3138;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 26px;border-radius:999px">Elegir nueva contraseña</a></p>
<p style="margin:0 0 6px;font-size:13px;color:#5a5282">Si el botón no funciona, copiá este enlace en tu navegador:</p>
<p style="margin:0 0 20px;font-size:13px;word-break:break-all;color:#5a5282">${link}</p>
<p style="margin:0;font-size:13px;color:#5a5282">Si no lo pediste vos, ignorá este correo: tu contraseña actual sigue funcionando.</p>
</td></tr></table>
<p style="margin:14px 0 0;font-size:12px;color:#6a6290">${BRAND.name} · ${BRAND.city}</p>
</td></tr></table></body></html>`;
  return { subject, text, html };
}

// Siempre resuelve sin avisar si el email existe o no: así nadie puede averiguar quién tiene cuenta.
export async function requestPasswordReset(rawEmail: string, clientKey: string): Promise<void> {
  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > 254) return;

  const [emailAllowed, clientAllowed] = await Promise.all([
    checkRateLimit(`olvide:${email}`),
    checkRateLimit(`olvide-ip:${clientKey}`),
  ]);
  if (!emailAllowed || !clientAllowed) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.enabled) return;

  const token = randomBytes(32).toString("hex");
  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
    }),
  ]);

  const baseUrl = (process.env.NEXTAUTH_URL ?? BRAND.siteUrl).replace(/\/$/, "");
  const link = `${baseUrl}/restablecer?token=${token}`;
  const message = resetEmail(user.name, link);
  await sendEmail({ to: user.email, ...message });
}

export async function isResetTokenValid(token: string): Promise<boolean> {
  if (!token) return false;
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { enabled: true } } },
  });
  return !!record && !record.usedAt && record.expiresAt > new Date() && record.user.enabled;
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  if (!token) return { ok: false as const, error: INVALID_LINK_ERROR };

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, email: true, enabled: true } } },
  });
  if (!record || record.usedAt || record.expiresAt <= new Date() || !record.user.enabled) {
    return { ok: false as const, error: INVALID_LINK_ERROR };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.user.id }, data: { passwordHash } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: record.user.id } }),
  ]);

  // si la cuenta estaba bloqueada por intentos fallidos, queda libre para entrar con la clave nueva
  await Promise.all([
    clearRateLimit(`login:${record.user.email.toLowerCase()}`),
    clearRateLimit(`activar:${record.user.email.toLowerCase()}`),
  ]);
  return { ok: true as const };
}
