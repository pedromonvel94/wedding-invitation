import confirmationService from "../services/confirmation.service.js";
async function createConfirmation(req, res, next) {
    const { guestId, status, responseDate, } = req.body;
    try {
        const result = await confirmationService.createConfirmation(guestId, status, responseDate);
        res.status(result.success ? 200 : 400).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getConfirmationByGuestId(req, res, next) {
    const { guestId } = req.params;
    try {
        const result = await confirmationService.getConfirmationByGuestId(Number(guestId));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function updateConfirmation(req, res, next) {
    const { guestId } = req.params;
    const { status, responseDate, } = req.body;
    try {
        const result = await confirmationService.updateConfirmation(Number(guestId), status, responseDate);
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function deleteConfirmation(req, res, next) {
    const { guestId } = req.params;
    try {
        const result = await confirmationService.deleteConfirmation(Number(guestId));
        res.status(result.success ? 200 : 404).json(result);
    }
    catch (error) {
        next(error);
    }
}
export default {
    createConfirmation,
    getConfirmationByGuestId,
    updateConfirmation,
    deleteConfirmation,
};
