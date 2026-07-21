import prisma from "../config/prisma.js";
import type {
  InvitationDelivery,
  DeliveryChannel,
  DeliveryStatus,
} from "../generated/prisma/client.js";

async function createInvitationDelivery(
  invitationId: number,
  channel: DeliveryChannel,
  status: DeliveryStatus,
  sentAt?: Date,
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.invitationDelivery.create({
      data: {
        invitationId,
        channel,
        status,
        sentAt,
      },
    });

    return {
      success: true,
      message: "Envío registrado exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al registrar el envío",
    };
  }
}

async function getInvitationDeliveryById(idDelivery: number): Promise<{
  success: boolean;
  message: string;
  invitationDelivery?: InvitationDelivery;
}> {
  try {
    const invitationDelivery = await prisma.invitationDelivery.findUnique({
      where: {
        idDelivery,
      },
    });

    if (!invitationDelivery) {
      return {
        success: false,
        message: "Envío no encontrado",
      };
    }

    return {
      success: true,
      message: "Envío encontrado",
      invitationDelivery,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar el envío",
    };
  }
}

async function getInvitationDeliveriesByInvitation(
  invitationId: number,
): Promise<{
  success: boolean;
  message: string;
  invitationDeliveries?: InvitationDelivery[];
}> {
  try {
    const invitationDeliveries = await prisma.invitationDelivery.findMany({
      where: {
        invitationId,
      },
    });

    if (invitationDeliveries.length === 0) {
      return {
        success: false,
        message: "No se encontraron envíos",
      };
    }

    return {
      success: true,
      message: "Envíos encontrados",
      invitationDeliveries,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al buscar los envíos",
    };
  }
}

async function updateInvitationDelivery(
  idDelivery: number,
  channel: DeliveryChannel,
  status: DeliveryStatus,
  sentAt?: Date,
): Promise<{
  success: boolean;
  message: string;
  invitationDelivery?: InvitationDelivery;
}> {
  try {
    const invitationDelivery = await prisma.invitationDelivery.update({
      where: {
        idDelivery,
      },
      data: {
        channel,
        status,
        sentAt,
      },
    });

    return {
      success: true,
      message: "Envío actualizado",
      invitationDelivery,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar el envío",
    };
  }
}

async function deleteInvitationDelivery(
  idDelivery: number,
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.invitationDelivery.delete({
      where: {
        idDelivery,
      },
    });

    return {
      success: true,
      message: "Envío eliminado",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar el envío",
    };
  }
}

export default {
  createInvitationDelivery,
  getInvitationDeliveryById,
  getInvitationDeliveriesByInvitation,
  updateInvitationDelivery,
  deleteInvitationDelivery,
};
