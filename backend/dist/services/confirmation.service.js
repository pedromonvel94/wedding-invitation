import prisma from "../config/prisma.js";
async function createConfirmation(guestId, status, responseDate) {
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
    }
    catch (error) {
        return {
            success: false,
            message: "Error al crear la confirmación",
        };
    }
}
async function getConfirmationByGuestId(guestId) {
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
    }
    catch (error) {
        return {
            success: false,
            message: "Error al buscar la confirmación",
        };
    }
}
async function updateConfirmation(guestId, status, responseDate) {
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
    }
    catch (error) {
        return {
            success: false,
            message: "Error al actualizar la confirmación",
        };
    }
}
async function deleteConfirmation(guestId) {
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
    }
    catch (error) {
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
