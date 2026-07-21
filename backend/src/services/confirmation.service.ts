import prisma from "../config/prisma.js";
import type {
  Confirmation,
  ConfirmationStatus,
} from "../generated/prisma/client.js";

async function createConfirmation(
  guestId: number,
  status: ConfirmationStatus,
  responseDate?: Date,
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.confirmation.create({
      data: {
        guestId,
        status,
        responseDate,
      },
    });

    return {
      success: true,
      message: "Confirmación creada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la confirmación",
    };
  }
}

async function getConfirmationByGuestId(guestId: number): Promise<{
  success: boolean;
  message: string;
  confirmation?: Confirmation;
}> {
  try {
    const confirmation = await prisma.confirmation.findUnique({
      where: {
        guestId,
      },
    });

    if (!confirmation) {
      return {
        success: false,
        message: "Confirmación no encontrada",
      };
    }

    return {
      success: true,
      message: "Confirmación encontrada",
      confirmation,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar la confirmación",
    };
  }
}

async function updateConfirmation(
  guestId: number,
  status: ConfirmationStatus,
  responseDate?: Date,
): Promise<{
  success: boolean;
  message: string;
  confirmation?: Confirmation;
}> {
  try {
    const confirmation = await prisma.confirmation.update({
      where: {
        guestId,
      },
      data: {
        status,
        responseDate,
      },
    });

    return {
      success: true,
      message: "Confirmación actualizada",
      confirmation,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar la confirmación",
    };
  }
}

async function deleteConfirmation(
  guestId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.confirmation.delete({
      where: {
        guestId,
      },
    });

    return {
      success: true,
      message: "Confirmación eliminada",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar la confirmación",
    };
  }
}

export default {
  createConfirmation,
  getConfirmationByGuestId,
  updateConfirmation,
  deleteConfirmation,
};
