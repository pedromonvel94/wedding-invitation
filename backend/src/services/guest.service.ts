import prisma from "../config/prisma.js";
import type { Guest } from "../generated/prisma/client.js";

async function createGuest(
  name: string,
  phoneNumber: string,
  email: string,
  invitationId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.guest.create({
      data: {
        name,
        phoneNumber,
        email,
        invitationId,
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
  email: string,
): Promise<{ success: boolean; message: string; guest?: Guest }> {
  try {
    const guest = await prisma.guest.update({
      where: {
        idGuest,
      },
      data: {
        name,
        phoneNumber,
        email,
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
    await prisma.guest.delete({
      where: {
        idGuest,
      },
    });

    return {
      success: true,
      message: "Invitado eliminado",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar el invitado",
    };
  }
}

export default {
  createGuest,
  getGuestById,
  getGuestsByInvitation,
  updateGuest,
  deleteGuest,
};
