-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_userId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_boardId_fkey";

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
