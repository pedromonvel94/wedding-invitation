import prisma from "../config/prisma.js";
import type { Invitation } from "../generated/prisma/client.js";

async function createInvitation(
  familyName: string,
  side: "PEDRO" | "CATA" | "BOTH" = "BOTH",
): Promise<{ success: boolean; message: string }> {
  await prisma.invitation.create({
    data: {
      familyName,
      side,
    },
  });

  return {
    success: true,
    message: "Invitación creada exitosamente",
  };
}

async function getInvitationByFamilyName(
  familyName: string,
): Promise<{ success: boolean; message: string; invitation?: Invitation[] }> {
  try {
    const invitation = await prisma.invitation.findMany({
      where: { familyName },
    });

    if (invitation.length === 0) {
      return {
        success: false,
        message: "Invitación no encontrada",
      };
    }

    return {
      success: true,
      message: "Invitación encontrada",
      invitation,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar la invitación",
    };
  }
}

async function getInvitationById(
  idInvitation: number,
): Promise<{ success: boolean; message: string; invitation?: Invitation }> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { idInvitation },
    });

    if (!invitation) {
      return {
        success: false,
        message: "Invitación no encontrada",
      };
    }

    return {
      success: true,
      message: "Invitación encontrada",
      invitation,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar la invitación",
    };
  }
}

async function updateInvitation(
  idInvitation: number,
  familyName: string,
  side?: "PEDRO" | "CATA" | "BOTH",
): Promise<{ success: boolean; message: string; invitation?: Invitation }> {
  try {
    const invitation = await prisma.invitation.update({
      where: { idInvitation },
      data: {
        familyName,
        ...(side ? { side } : {}),
      },
    }); //Esto es como decir: Prisma, ve a la tabla Invitation, busca el registro cuyo idInvitation sea igual al recibido y actualiza los campos que están dentro de data.

    return {
      success: true,
      message: "Invitación actualizada",
      invitation,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar la invitación",
    };
  }
}

async function deleteInvitation(
  idInvitation: number,
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Obtener todos los invitados pertenecientes a esta invitación
    const guests = await prisma.guest.findMany({
      where: { invitationId: idInvitation },
      select: { idGuest: true },
    });
    const guestIds = guests.map((g) => g.idGuest);

    // 2. Eliminar todas las confirmaciones de los invitados
    if (guestIds.length > 0) {
      await prisma.confirmation.deleteMany({
        where: { guestId: { in: guestIds } },
      });
    }

    // 3. Eliminar entregas registradas para la invitación
    await prisma.invitationDelivery.deleteMany({
      where: { invitationId: idInvitation },
    });

    // 4. Eliminar los invitados
    await prisma.guest.deleteMany({
      where: { invitationId: idInvitation },
    });

    // 5. Eliminar la invitación
    await prisma.invitation.delete({
      where: { idInvitation },
    });

    return {
      success: true,
      message: "Invitación y sus integrantes eliminados exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar la invitación:", error);
    return {
      success: false,
      message: "Error al eliminar la invitación",
    };
  }
}

async function getAllInvitations() {
  try {
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        guests: {
          include: { confirmation: true },
        },
        invitationDeliveries: true,
      },
    });

    return {
      success: true,
      message: "Invitaciones encontradas",
      invitations,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener las invitaciones",
    };
  }
}

async function markAsSent(
  idInvitation: number,
  channel: "WHATSAPP" | "EMAIL" = "WHATSAPP",
  status?: "SENT" | "PENDING"
) {
  try {
    const existing = await prisma.invitationDelivery.findFirst({
      where: { invitationId: idInvitation, channel },
    });

    const targetStatus: "SENT" | "PENDING" =
      status !== undefined
        ? status
        : existing?.status === "SENT"
        ? "PENDING"
        : "SENT";

    if (existing) {
      await prisma.invitationDelivery.update({
        where: { idDelivery: existing.idDelivery },
        data: {
          status: targetStatus,
          sentAt: targetStatus === "SENT" ? new Date() : null,
        },
      });
    } else {
      await prisma.invitationDelivery.create({
        data: {
          invitationId: idInvitation,
          channel,
          status: targetStatus,
          sentAt: targetStatus === "SENT" ? new Date() : null,
        },
      });
    }

    return { success: true, message: "Estado de entrega actualizado." };
  } catch (error) {
    return { success: false, message: "Error al actualizar la entrega." };
  }
}

export default {
  createInvitation,
  getAllInvitations,
  getInvitationByFamilyName,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
  markAsSent,
};

