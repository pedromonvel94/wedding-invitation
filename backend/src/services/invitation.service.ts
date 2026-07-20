import prisma from "../config/prisma.js";
import type { Invitation } from "../generated/prisma/client.js";

async function createInvitation(
  familyName: string,
): Promise<{ success: boolean; message: string }> {
  await prisma.invitation.create({
    data: {
      familyName,
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
): Promise<{ success: boolean; message: string; invitation?: Invitation }> {
  try {
    const invitation = await prisma.invitation.update({
      where: { idInvitation },
      data: { familyName },
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
    await prisma.invitation.delete({
      where: { idInvitation },
    });

    return {
      success: true,
      message: "Invitación eliminada",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar la invitación",
    };
  }
}

export default {
  createInvitation,
  getInvitationByFamilyName,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
};
