/*
  Warnings:

  - You are about to drop the column `img` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `board` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "img",
ADD COLUMN     "imgageUrl" TEXT,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "board";

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
