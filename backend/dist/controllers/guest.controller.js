import guestService from "../services/guest.service.js";
async function createGuest(req, res, next) {
    const { name, phoneNumber, email, invitationId, side } = req.body;
    try {
        const result = await guestService.createGuest(name, phoneNumber, email, invitationId, side);
        res.status(result.success ? 200 : 400).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getGuestById(req, res, next) {
    const { idGuest } = req.params;
    try {
        const result = await guestService.getGuestById(Number(idGuest));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getGuestsByInvitation(req, res, next) {
    const { idInvitation } = req.params;
    try {
        const result = await guestService.getGuestsByInvitation(Number(idInvitation));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function updateGuest(req, res, next) {
    const { idGuest } = req.params;
    const { name, phoneNumber, email, side } = req.body;
    try {
        const result = await guestService.updateGuest(Number(idGuest), name, phoneNumber, email, side);
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function deleteGuest(req, res, next) {
    const { idGuest } = req.params;
    try {
        const result = await guestService.deleteGuest(Number(idGuest));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getAllGuests(_req, res, next) {
    try {
        const result = await guestService.getAllGuests();
        res.status(result.success ? 200 : 400).json(result);
    }
    catch (error) {
        next(error);
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
