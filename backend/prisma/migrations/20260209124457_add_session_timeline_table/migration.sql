-- CreateTable
CREATE TABLE "SessionTimeline" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timelineData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionTimeline_sessionId_key" ON "SessionTimeline"("sessionId");

-- CreateIndex
CREATE INDEX "SessionTimeline_sessionId_idx" ON "SessionTimeline"("sessionId");

-- AddForeignKey
ALTER TABLE "SessionTimeline" ADD CONSTRAINT "SessionTimeline_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
