/*
  Warnings:

  - The values [FIVE_MINS,TEN_MINS,FIFTEEN_MINS,THIRTY_MINS,ONE_HOUR,TWO_HOURS,ONE_DAY,TWO_DAYS] on the enum `ReminderTime` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReminderTime_new" AS ENUM ('NONE', 'DUE_DATE', 'MINS_5', 'MINS_10', 'MINS_15', 'MINS_30', 'HOUR_1', 'HOURS_2', 'DAY_1', 'DAYS_2');
ALTER TABLE "Task" ALTER COLUMN "reminderTime" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "reminderTime" TYPE "ReminderTime_new" USING ("reminderTime"::text::"ReminderTime_new");
ALTER TYPE "ReminderTime" RENAME TO "ReminderTime_old";
ALTER TYPE "ReminderTime_new" RENAME TO "ReminderTime";
DROP TYPE "ReminderTime_old";
ALTER TABLE "Task" ALTER COLUMN "reminderTime" SET DEFAULT 'NONE';
COMMIT;
