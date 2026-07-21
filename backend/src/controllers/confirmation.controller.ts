import { Request, Response } from "express";
import type { ConfirmationStatus } from "../generated/prisma/client.js";
import confirmationService from "../services/confirmation.service.js";

type GuestIdParams = {
  guestId: string;
};

async function createConfirmation(req: Request, res: Response) {
  const {
    guestId,
    status,
    responseDate,
  }: {
    guestId: number;
    status: ConfirmationStatus;
    responseDate?: Date;
  } = req.body;

  try {
    const result = await confirmationService.createConfirmation(
      guestId,
      status,
      responseDate,
    );

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function getConfirmationByGuestId(
  req: Request<GuestIdParams>,
  res: Response,
) {
  const { guestId } = req.params;

  try {
    const result = await confirmationService.getConfirmationByGuestId(
      Number(guestId),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function updateConfirmation(req: Request<GuestIdParams>, res: Response) {
  const { guestId } = req.params;

  const {
    status,
    responseDate,
  }: {
    status: ConfirmationStatus;
    responseDate?: Date;
  } = req.body;

  try {
    const result = await confirmationService.updateConfirmation(
      Number(guestId),
      status,
      responseDate,
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

async function deleteConfirmation(req: Request<GuestIdParams>, res: Response) {
  const { guestId } = req.params;

  try {
    const result = await confirmationService.deleteConfirmation(
      Number(guestId),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

export default {
  createConfirmation,
  getConfirmationByGuestId,
  updateConfirmation,
  deleteConfirmation,
};
