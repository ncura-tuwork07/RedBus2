import Link from "next/link";
import { LinkWarning } from "./link-warning";
import { AuthShell } from "@/components/auth-shell";
import { isResetTokenValid } from "@/lib/password-reset-token";
import { RestablecerForm } from "./restablecer-form";

export const dynamic = "force-dynamic";

export default async function RestablecerPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const valid = await isResetTokenValid(token).catch((error) => {
    console.error("No se pudo validar el enlace de restablecimiento", error);
    return false;
  });

  return (
    <AuthShell>
      {valid ? (
        <RestablecerForm token={token} />
      ) : (
        <LinkWarning>
          <Link href="/olvide" className="font-bold text-primary-500 hover:underline">
            Pedir un enlace nuevo
          </Link>
        </LinkWarning>
      )}
    </AuthShell>
  );
}
