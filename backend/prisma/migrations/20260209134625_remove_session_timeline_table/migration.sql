/*
  Warnings:

  - You are about to drop the `SessionTimeline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionTimeline" DROP CONSTRAINT "SessionTimeline_sessionId_fkey";

-- DropTable
DROP TABLE "SessionTimeline";
