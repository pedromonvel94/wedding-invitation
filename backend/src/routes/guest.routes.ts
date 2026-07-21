import { Router } from "express";
import guestController from "../controllers/guest.controller.js";

const guestRouter = Router();

guestRouter.post("/guests", guestController.createGuest);

guestRouter.get("/guests/:idGuest", guestController.getGuestById);

guestRouter.get(
  "/guests/invitation/:idInvitation",
  guestController.getGuestsByInvitation,
);

guestRouter.put("/guests/:idGuest", guestController.updateGuest);

guestRouter.delete("/guests/:idGuest", guestController.deleteGuest);

export default guestRouter;
