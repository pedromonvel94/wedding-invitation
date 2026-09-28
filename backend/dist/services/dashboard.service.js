import prisma from "../config/prisma.js";
async function getDashboardStats() {
    const totalGuests = await prisma.guest.count();
    // Conteo de invitados cuya tarjeta de invitación ya fue enviada
    const sentGuestsCount = await prisma.guest.count({
        where: {
            invitation: {
                invitationDeliveries: {
                    some: { status: "SENT" },
                },
            },
        },
    });
    // Invitados que han confirmado que asistirán
    const confirmedGuestsCount = await prisma.guest.count({
        where: {
            confirmation: {
                status: "CONFIRMED",
            },
        },
    });
    // Invitados que han notificado que no podrán asistir
    const declinedGuestsCount = await prisma.guest.count({
        where: {
            confirmation: {
                status: "DECLINED",
            },
        },
    });
    // Pendientes de respuesta: Solo aquellos invitados a quienes YA se les envió la invitación y no han respondido aún
    const pendingResponseGuestsCount = await prisma.guest.count({
        where: {
            invitation: {
                invitationDeliveries: {
                    some: { status: "SENT" },
                },
            },
            OR: [
                { confirmation: { is: null } },
                { confirmation: { status: "PENDING" } },
            ],
        },
    });
    const totalAdmins = await prisma.admin.count({
        where: { active: true },
    });
    const recentInvitations = await prisma.invitation.findMany({
        take: 5,
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
        stats: {
            invitations: {
                total: totalGuests,
                sent: sentGuestsCount,
                pending: totalGuests - sentGuestsCount,
            },
            guests: {
                total: totalGuests,
                confirmed: confirmedGuestsCount,
                pending: pendingResponseGuestsCount,
                declined: declinedGuestsCount,
            },
            adminsCount: totalAdmins,
        },
        recentInvitations,
    };
}
export default {
    getDashboardStats,
};
