/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" TEXT NOT NULL,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "img" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
