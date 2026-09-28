import prisma from "../config/prisma.js";
import type { ConfirmationStatus } from "../generated/prisma/client.js";
import { AppError } from "../utils/app-error.js";

export interface PublicRsvpInput {
  name: string;
  status: "CONFIRMED" | "DECLINED";
  email?: string;
  phoneNumber?: string;
  guestId?: number;
  invitationId?: number;
}

export class PublicService {
  /**
   * Obtener detalles públicos de una invitación por su ID (incluyendo sus invitados)
   */
  async getPublicInvitation(idInvitation: number) {
    const invitation = await prisma.invitation.findUnique({
      where: { idInvitation },
      include: {
        guests: {
          include: {
            confirmation: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new AppError("Invitación no encontrada", 404);
    }

    return invitation;
  }

  /**
   * Confirmar o rechazar asistencia desde la landing pública
   */
  async submitPublicRsvp(data: PublicRsvpInput) {
    const { name, status, email, phoneNumber, guestId, invitationId } = data;

    let targetGuest;

    // 1. Buscar por guestId explícito si fue proporcionado
    if (guestId) {
      targetGuest = await prisma.guest.findUnique({
        where: { idGuest: guestId },
        include: { confirmation: true },
      });
    }

    // 2. Si no hay guestId o no se encontró, buscar por nombre o email
    if (!targetGuest && email) {
      targetGuest = await prisma.guest.findFirst({
        where: { email },
        include: { confirmation: true },
      });
    }

    if (!targetGuest && name) {
      targetGuest = await prisma.guest.findFirst({
        where: { name: { contains: name, mode: "insensitive" } },
        include: { confirmation: true },
      });
    }

    // 3. Si aún no existe el invitado, lo creamos asignándolo a la invitación especificada o a una por defecto
    if (!targetGuest) {
      let targetInvitationId = invitationId;

      if (!targetInvitationId) {
        let defaultInv = await prisma.invitation.findFirst({
          where: { familyName: "Familiares y Amigos" },
        });

        if (!defaultInv) {
          defaultInv = await prisma.invitation.create({
            data: { familyName: "Familiares y Amigos" },
          });
        }
        targetInvitationId = defaultInv.idInvitation;
      }

      const randomTag = Math.floor(1000 + Math.random() * 9000);
      const safeEmail = email && email.trim() !== "" ? email.trim() : null;
      const safePhone = phoneNumber && phoneNumber.trim() !== "" ? phoneNumber.trim() : `+57000${Date.now()}${randomTag}`;

      targetGuest = await prisma.guest.create({
        data: {
          name: name.trim(),
          email: safeEmail,
          phoneNumber: safePhone,
          invitationId: targetInvitationId,
        },
        include: { confirmation: true },
      });
    } else {
      const updateData: { email?: string; phoneNumber?: string } = {};
      if (email && email.trim() !== "" && !email.includes("@wedding.temp")) {
        updateData.email = email.trim();
      }
      if (phoneNumber && phoneNumber.trim() !== "" && !phoneNumber.startsWith("+57000")) {
        updateData.phoneNumber = phoneNumber.trim();
      }

      if (Object.keys(updateData).length > 0) {
        try {
          targetGuest = await prisma.guest.update({
            where: { idGuest: targetGuest.idGuest },
            data: updateData,
            include: { confirmation: true },
          });
        } catch {
          // Ignores update on constraint
        }
      }
    }

    // 4. Mapear estado al enum de Prisma
    const prismaStatus: ConfirmationStatus = status === "DECLINED" ? ("DECLINED" as ConfirmationStatus) : ("CONFIRMED" as ConfirmationStatus);

    // 5. Crear o actualizar la confirmación (Upsert)
    const confirmation = await prisma.confirmation.upsert({
      where: { guestId: targetGuest.idGuest },
      update: {
        status: prismaStatus,
        responseDate: new Date(),
      },
      create: {
        guestId: targetGuest.idGuest,
        status: prismaStatus,
        responseDate: new Date(),
      },
    });

    return {
      success: true,
      message: status === "DECLINED" ? "Respuesta registrada: No asistirá" : "¡Asistencia confirmada con éxito!",
      guest: {
        idGuest: targetGuest.idGuest,
        name: targetGuest.name,
        email: targetGuest.email,
        phoneNumber: targetGuest.phoneNumber,
      },
      confirmation,
    };
  }

  /**
   * Confirmar o rechazar asistencia en lote para todos los integrantes de una familia
   */
  async submitBatchPublicRsvp(data: {
    invitationId?: number;
    responses: Array<{
      guestId: number;
      status: "CONFIRMED" | "DECLINED";
    }>;
  }) {
    const results = [];
    for (const item of data.responses) {
      if (item.guestId) {
        const prismaStatus: ConfirmationStatus =
          item.status === "DECLINED" ? ("DECLINED" as ConfirmationStatus) : ("CONFIRMED" as ConfirmationStatus);

        const conf = await prisma.confirmation.upsert({
          where: { guestId: item.guestId },
          update: {
            status: prismaStatus,
            responseDate: new Date(),
          },
          create: {
            guestId: item.guestId,
            status: prismaStatus,
            responseDate: new Date(),
          },
        });
        results.push(conf);
      }
    }

    return {
      success: true,
      message: "¡Asistencia de la familia confirmada con éxito!",
      results,
    };
  }
}

export default new PublicService();
