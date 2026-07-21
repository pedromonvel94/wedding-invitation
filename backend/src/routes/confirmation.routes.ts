import { Router } from "express";
import confirmationController from "../controllers/confirmation.controller.js";

const confirmationRouter = Router();

confirmationRouter.post(
  "/confirmations",
  confirmationController.createConfirmation,
);

confirmationRouter.get(
  "/confirmations/:guestId",
  confirmationController.getConfirmationByGuestId,
);

confirmationRouter.put(
  "/confirmations/:guestId",
  confirmationController.updateConfirmation,
);

confirmationRouter.delete(
  "/confirmations/:guestId",
  confirmationController.deleteConfirmation,
);

export default confirmationRouter;
