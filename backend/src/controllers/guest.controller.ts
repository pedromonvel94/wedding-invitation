import { Request, Response, NextFunction } from "express";
import guestService from "../services/guest.service.js";

type GuestIdParams = {
  idGuest: string;
};

type InvitationIdParams = {
  idInvitation: string;
};

async function createGuest(req: Request, res: Response, next: NextFunction) {
  const { name, phoneNumber, email, invitationId, side } = req.body;

  try {
    const result = await guestService.createGuest(
      name,
      phoneNumber,
      email,
      invitationId,
      side,
    );

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
}

async function getGuestById(
  req: Request<GuestIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idGuest } = req.params;

  try {
    const result = await guestService.getGuestById(Number(idGuest));

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function getGuestsByInvitation(
  req: Request<InvitationIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idInvitation } = req.params;

  try {
    const result = await guestService.getGuestsByInvitation(
      Number(idInvitation),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateGuest(
  req: Request<GuestIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idGuest } = req.params;

  const { name, phoneNumber, email, side } = req.body;

  try {
    const result = await guestService.updateGuest(
      Number(idGuest),
      name,
      phoneNumber,
      email,
      side,
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteGuest(
  req: Request<GuestIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idGuest } = req.params;

  try {
    const result = await guestService.deleteGuest(Number(idGuest));

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function getAllGuests(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await guestService.getAllGuests();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
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
