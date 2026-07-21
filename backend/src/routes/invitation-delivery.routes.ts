import { Router } from "express";
import invitationDeliveryController from "../controllers/invitation-delivery.controller.js";

const invitationDeliveryRouter = Router();

invitationDeliveryRouter.post(
  "/invitation-deliveries",
  invitationDeliveryController.createInvitationDelivery,
);

invitationDeliveryRouter.get(
  "/invitation-deliveries/:idDelivery",
  invitationDeliveryController.getInvitationDeliveryById,
);

invitationDeliveryRouter.get(
  "/invitation-deliveries/invitation/:idInvitation",
  invitationDeliveryController.getInvitationDeliveriesByInvitation,
);

invitationDeliveryRouter.put(
  "/invitation-deliveries/:idDelivery",
  invitationDeliveryController.updateInvitationDelivery,
);

invitationDeliveryRouter.delete(
  "/invitation-deliveries/:idDelivery",
  invitationDeliveryController.deleteInvitationDelivery,
);

export default invitationDeliveryRouter;
