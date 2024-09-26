/*
  Warnings:

  - You are about to drop the column `reminder` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReminderTime" AS ENUM ('NONE', 'FIVE_MINS', 'TEN_MINS', 'FIFTEEN_MINS', 'THIRTY_MINS', 'ONE_HOUR', 'TWO_HOURS', 'ONE_DAY', 'TWO_DAYS');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "reminder",
ADD COLUMN     "reminderTime" "ReminderTime" NOT NULL DEFAULT 'NONE';
