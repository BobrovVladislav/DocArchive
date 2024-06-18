/*
  Warnings:

  - You are about to drop the column `status` on the `Document` table. All the data in the column will be lost.
  - The `status` column on the `DocumentVersion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "DocumentVersion" ALTER COLUMN "version" SET DEFAULT 1,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'new';

-- DropEnum
DROP TYPE "Gender";
