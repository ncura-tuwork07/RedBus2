import { LinkIcon } from "lucide-react";

export function LinkWarning({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
        <LinkIcon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="font-display mt-4 text-lg font-extrabold text-accent-500">Enlace no válido</h1>
      <p className="mt-2 text-sm text-neutral-700">El enlace ya se usó o venció (duran 1 hora).</p>
      <p className="mt-4 text-sm">{children}</p>
    </div>
  );
}
