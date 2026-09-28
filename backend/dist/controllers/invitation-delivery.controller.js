import invitationDeliveryService from "../services/invitation-delivery.service.js";
async function createInvitationDelivery(req, res, next) {
    const { invitationId, channel, status, sentAt, } = req.body;
    try {
        const result = await invitationDeliveryService.createInvitationDelivery(invitationId, channel, status, sentAt);
        res.status(result.success ? 200 : 400).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getInvitationDeliveryById(req, res, next) {
    const { idDelivery } = req.params;
    try {
        const result = await invitationDeliveryService.getInvitationDeliveryById(Number(idDelivery));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getInvitationDeliveriesByInvitation(req, res, next) {
    const { idInvitation } = req.params;
    try {
        const result = await invitationDeliveryService.getInvitationDeliveriesByInvitation(Number(idInvitation));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function updateInvitationDelivery(req, res, next) {
    const { idDelivery } = req.params;
    const { channel, status, sentAt, } = req.body;
    try {
        const result = await invitationDeliveryService.updateInvitationDelivery(Number(idDelivery), channel, status, sentAt);
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function deleteInvitationDelivery(req, res, next) {
    const { idDelivery } = req.params;
    try {
        const result = await invitationDeliveryService.deleteInvitationDelivery(Number(idDelivery));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
export default {
    createInvitationDelivery,
    getInvitationDeliveryById,
    getInvitationDeliveriesByInvitation,
    updateInvitationDelivery,
    deleteInvitationDelivery,
};
