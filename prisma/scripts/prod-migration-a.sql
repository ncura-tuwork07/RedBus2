-- Migración A a producción, escrita a mano (NO usar `prisma db push` acá: la base de
-- producción comparte la tabla "users" con otro proyecto del mismo usuario que tiene columnas
-- propias como is_pro/is_founding_member/agents — un db push normal intentaría reconciliar TODO
-- el schema y podría proponer borrar esas columnas/tablas ajenas. Este script es 100% aditivo:
-- solo CREATE TABLE / ADD COLUMN / CREATE INDEX, nunca DROP ni ALTER de algo existente.

CREATE TABLE IF NOT EXISTS "organizations" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logoUrl" TEXT,
  "primaryColorHex" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_slug_key" ON "organizations"("slug");

-- users: tabla compartida con otro proyecto — solo agregamos columnas, sin FK acá a propósito,
-- para tocar lo mínimo posible esta tabla en particular.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "users_organizationId_idx" ON "users"("organizationId");

-- el resto de las tablas son exclusivas de RedBusSchool — acá sí agregamos la FK completa.
ALTER TABLE "student_profiles" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "student_profiles_organizationId_idx" ON "student_profiles"("organizationId");
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "teacher_profiles" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "teacher_profiles_organizationId_idx" ON "teacher_profiles"("organizationId");
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "classrooms" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "classrooms_organizationId_idx" ON "classrooms"("organizationId");
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "payments_organizationId_idx" ON "payments"("organizationId");
ALTER TABLE "payments" ADD CONSTRAINT "payments_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payroll_items" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
ALTER TABLE "payroll_items" ADD CONSTRAINT "payroll_items_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "expenses_organizationId_idx" ON "expenses"("organizationId");
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
CREATE INDEX IF NOT EXISTS "leads_organizationId_idx" ON "leads"("organizationId");
ALTER TABLE "leads" ADD CONSTRAINT "leads_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "whatsapp_conversations" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
