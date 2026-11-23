CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CANCELLED');

CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "spaceId" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Reservation_spaceId_startAt_endAt_idx" ON "Reservation"("spaceId", "startAt", "endAt");
CREATE INDEX "Reservation_userId_startAt_idx" ON "Reservation"("userId", "startAt");

ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
