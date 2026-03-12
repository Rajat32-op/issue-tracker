/*
  Warnings:

  - A unique constraint covering the columns `[companyCode]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyCode` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "companyCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_companyCode_key" ON "Tenant"("companyCode");
