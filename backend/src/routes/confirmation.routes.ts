import { Router } from "express";
import confirmationController from "../controllers/confirmation.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const confirmationRouter = Router();

confirmationRouter.use(authenticateToken);

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
