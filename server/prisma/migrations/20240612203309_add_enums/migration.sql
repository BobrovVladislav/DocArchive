/*
  Warnings:

  - The `status` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('DOCUMENTS', 'INFO_ANALYTICS', 'ORG_METHOD', 'REHAB_DIAGNOSTICS', 'EXPERT_COMPOSITIONS', 'HR', 'LEGAL', 'SUPPLY_PROCUREMENT', 'GENERAL_ISSUES', 'FINANCE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NEW', 'IN_PROGRESS', 'UNDER_REVIEW', 'CORRECTION', 'REJECTED', 'APPROVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL;
