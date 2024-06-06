-- DropForeignKey
ALTER TABLE "ContactInfo" DROP CONSTRAINT "ContactInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
