import prisma from "../config/prisma.js";
import type { Guest } from "../generated/prisma/client.js";

async function createGuest(
  name: string,
  phoneNumber: string,
  email?: string,
  invitationId?: number,
  side: "PEDRO" | "CATA" | "BOTH" = "BOTH",
): Promise<{ success: boolean; message: string }> {
  try {
    let targetInvitationId = invitationId;
    let finalSide = side;

    if (targetInvitationId) {
      const parentInv = await prisma.invitation.findUnique({
        where: { idInvitation: targetInvitationId },
      });
      if (parentInv) {
        finalSide = parentInv.side;
      }
    } else {
      const newInv = await prisma.invitation.create({
        data: {
          familyName: name,
          side,
        },
      });
      targetInvitationId = newInv.idInvitation;
    }

    await prisma.guest.create({
      data: {
        name,
        phoneNumber,
        email: email || null,
        invitationId: targetInvitationId,
        side: finalSide,
      },
    });

    return {
      success: true,
      message: "Invitado creado exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear el invitado",
    };
  }
}

async function getGuestById(
  idGuest: number,
): Promise<{ success: boolean; message: string; guest?: Guest }> {
  try {
    const guest = await prisma.guest.findUnique({
      where: {
        idGuest,
      },
    });

    if (!guest) {
      return {
        success: false,
        message: "Invitado no encontrado",
      };
    }

    return {
      success: true,
      message: "Invitado encontrado",
      guest,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar el invitado",
    };
  }
}

async function getGuestsByInvitation(
  invitationId: number,
): Promise<{ success: boolean; message: string; guests?: Guest[] }> {
  try {
    const guests = await prisma.guest.findMany({
      where: {
        invitationId,
      },
    });

    if (guests.length === 0) {
      return {
        success: false,
        message: "No se encontraron invitados",
      };
    }

    return {
      success: true,
      message: "Invitados encontrados",
      guests,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar los invitados",
    };
  }
}

async function updateGuest(
  idGuest: number,
  name: string,
  phoneNumber: string,
  email?: string,
  side?: "PEDRO" | "CATA" | "BOTH",
  invitationId?: number | null,
): Promise<{ success: boolean; message: string; guest?: Guest }> {
  try {
    const existingGuest = await prisma.guest.findUnique({
      where: { idGuest },
    });

    if (!existingGuest) {
      return { success: false, message: "Invitado no encontrado" };
    }

    const currentInvId = existingGuest.invitationId;
    let targetInvitationId = currentInvId;
    let finalSide = side || existingGuest.side;

    if (invitationId !== undefined && invitationId !== currentInvId) {
      if (invitationId) {
        const targetInv = await prisma.invitation.findUnique({
          where: { idInvitation: invitationId },
        });
        if (targetInv) {
          targetInvitationId = invitationId;
          finalSide = targetInv.side;
        }
      } else {
        const newInv = await prisma.invitation.create({
          data: {
            familyName: name,
            side: finalSide,
          },
        });
        targetInvitationId = newInv.idInvitation;
      }

      if (currentInvId && currentInvId !== targetInvitationId) {
        const remainingCount = await prisma.guest.count({
          where: { invitationId: currentInvId, idGuest: { not: idGuest } },
        });
        if (remainingCount === 0) {
          await prisma.invitationDelivery.deleteMany({
            where: { invitationId: currentInvId },
          });
          await prisma.invitation.delete({
            where: { idInvitation: currentInvId },
          });
        }
      }
    }

    const guest = await prisma.guest.update({
      where: { idGuest },
      data: {
        name,
        phoneNumber,
        email: email || null,
        side: finalSide,
        invitationId: targetInvitationId,
      },
    });

    return {
      success: true,
      message: "Invitado actualizado",
      guest,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar el invitado",
    };
  }
}

async function deleteGuest(
  idGuest: number,
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Eliminar la confirmación asociada si existe
    await prisma.confirmation.deleteMany({
      where: { guestId: idGuest },
    });

    // 2. Eliminar el invitado
    const deletedGuest = await prisma.guest.delete({
      where: {
        idGuest,
      },
    });

    // 3. Verificar si la invitación asociada quedó sin invitados y limpiarla
    if (deletedGuest.invitationId) {
      const remainingGuestsCount = await prisma.guest.count({
        where: { invitationId: deletedGuest.invitationId },
      });

      if (remainingGuestsCount === 0) {
        await prisma.invitationDelivery.deleteMany({
          where: { invitationId: deletedGuest.invitationId },
        });
        await prisma.invitation.delete({
          where: { idInvitation: deletedGuest.invitationId },
        });
      }
    }

    return {
      success: true,
      message: "Invitado eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el invitado:", error);
    return {
      success: false,
      message: "Error al eliminar el invitado",
    };
  }
}

async function getAllGuests() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        invitation: {
          include: {
            invitationDeliveries: true,
          },
        },
        confirmation: true,
      },
    });

    return {
      success: true,
      message: "Invitados encontrados",
      guests,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener la lista de invitados",
    };
  }
}

export default {
  createGuest,
  getAllGuests,
  getGuestById,
  getGuestsByInvitation,
  updateGuest,
  deleteGuest,
};
