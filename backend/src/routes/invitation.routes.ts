import { Router } from "express";
import invitationController from "../controllers/invitation.controller.js";

const invitationRouter = Router();

invitationRouter.post("/invitations", invitationController.createInvitation);

invitationRouter.get(
  "/invitations/:familyName",
  invitationController.getInvitationByFamilyName,
);

invitationRouter.get(
  "/invitations/:idInvitation",
  invitationController.getInvitationById,
);

invitationRouter.put(
  "/invitations/:idInvitation",
  invitationController.updateInvitation,
);

invitationRouter.delete(
  "/invitations/:idInvitation",
  invitationController.deleteInvitation,
);

export default invitationRouter;
