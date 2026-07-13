-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('CONFIRMED', 'PENDING', 'DECLINED');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Admin" (
    "idAdmin" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("idAdmin")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "idInvitation" SERIAL NOT NULL,
    "familyName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("idInvitation")
);

-- CreateTable
CREATE TABLE "Guest" (
    "idGuest" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("idGuest")
);

-- CreateTable
CREATE TABLE "Confirmation" (
    "idConfirmation" SERIAL NOT NULL,
    "status" "ConfirmationStatus" NOT NULL DEFAULT 'PENDING',
    "responseDate" TIMESTAMP(3),
    "guestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Confirmation_pkey" PRIMARY KEY ("idConfirmation")
);

-- CreateTable
CREATE TABLE "InvitationDelivery" (
    "idDelivery" SERIAL NOT NULL,
    "channel" "DeliveryChannel",
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "invitationId" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvitationDelivery_pkey" PRIMARY KEY ("idDelivery")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_phoneNumber_key" ON "Guest"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_guestId_key" ON "Confirmation"("guestId");

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("idInvitation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("idGuest") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDelivery" ADD CONSTRAINT "InvitationDelivery_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("idInvitation") ON DELETE RESTRICT ON UPDATE CASCADE;
