import { Router } from "express";
import publicController from "../controllers/public.controller.js";
const publicRouter = Router();
// Endpoint público para consultar detalles de invitación por id
publicRouter.get("/public/invitations/:id", publicController.getPublicInvitation);
// Endpoint público para confirmar o rechazar asistencia (RSVP)
publicRouter.post("/public/rsvp", publicController.submitPublicRsvp);
publicRouter.post("/public/rsvp/batch", publicController.submitBatchPublicRsvp);
export default publicRouter;
