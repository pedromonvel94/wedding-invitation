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
  const { familyName } = req.body;

  try {
    const result = await invitationService.createInvitation(familyName);
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
  const { familyName } = req.body;

  try {
    const result = await invitationService.updateInvitation(
      Number(idInvitation),
      familyName,
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

export default {
  createInvitation,
  getInvitationByFamilyName,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
};
