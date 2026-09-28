import { Request, Response, NextFunction } from "express";
import invitationService from "../services/invitation.service.js";

type InvitationParams = {
  familyName: string;
};

type InvitationIdParams = {
  idInvitation: string;
};

async function createInvitation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { familyName, side } = req.body;

  try {
    const result = await invitationService.createInvitation(familyName, side);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
}

async function getInvitationByFamilyName(
  req: Request<InvitationParams>,
  res: Response,
  next: NextFunction,
) {
  const { familyName } = req.params;

  try {
    const result =
      await invitationService.getInvitationByFamilyName(familyName);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function getInvitationById(
  req: Request<InvitationIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idInvitation } = req.params;

  try {
    const result = await invitationService.getInvitationById(
      Number(idInvitation),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateInvitation(
  req: Request<InvitationIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idInvitation } = req.params;
  const { familyName, side } = req.body;

  try {
    const result = await invitationService.updateInvitation(
      Number(idInvitation),
      familyName,
      side,
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteInvitation(
  req: Request<InvitationIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idInvitation } = req.params;

  try {
    const result = await invitationService.deleteInvitation(
      Number(idInvitation),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function getAllInvitations(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await invitationService.getAllInvitations();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
}

async function markAsSent(
  req: Request<InvitationIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idInvitation } = req.params;
  const { channel } = req.body;

  try {
    const result = await invitationService.markAsSent(
      Number(idInvitation),
      channel || "WHATSAPP",
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  createInvitation,
  getAllInvitations,
  getInvitationByFamilyName,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
  markAsSent,
};

