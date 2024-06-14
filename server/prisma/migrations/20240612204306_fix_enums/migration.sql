/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [NEW,IN_PROGRESS,UNDER_REVIEW,CORRECTION,REJECTED,APPROVED,CANCELLED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('male', 'female');
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'user');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('new', 'progress', 'under_review', 'correction', 'rejected', 'approved');
ALTER TABLE "Document" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Document" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT 'new';
COMMIT;

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "status" SET DEFAULT 'new';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user',
DROP COLUMN "department",
ADD COLUMN     "department" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Department";
