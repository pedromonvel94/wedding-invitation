import { Request, Response } from "express";
import guestService from "../services/guest.service.js";

type GuestIdParams = {
  idGuest: string;
};

type InvitationIdParams = {
  idInvitation: string;
};

async function createGuest(req: Request, res: Response) {
  const { name, phoneNumber, email, invitationId } = req.body;

  try {
    const result = await guestService.createGuest(
      name,
      phoneNumber,
      email,
      invitationId,
    );

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function getGuestById(req: Request<GuestIdParams>, res: Response) {
  const { idGuest } = req.params;

  try {
    const result = await guestService.getGuestById(Number(idGuest));

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function getGuestsByInvitation(
  req: Request<InvitationIdParams>,
  res: Response,
) {
  const { idInvitation } = req.params;

  try {
    const result = await guestService.getGuestsByInvitation(
      Number(idInvitation),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function updateGuest(req: Request<GuestIdParams>, res: Response) {
  const { idGuest } = req.params;

  const { name, phoneNumber, email } = req.body;

  try {
    const result = await guestService.updateGuest(
      Number(idGuest),
      name,
      phoneNumber,
      email,
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function deleteGuest(req: Request<GuestIdParams>, res: Response) {
  const { idGuest } = req.params;

  try {
    const result = await guestService.deleteGuest(Number(idGuest));

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

export default {
  createGuest,
  getGuestById,
  getGuestsByInvitation,
  updateGuest,
  deleteGuest,
};
