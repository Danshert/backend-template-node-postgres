-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pushSubscriptions" TEXT[] DEFAULT ARRAY[]::TEXT[];
