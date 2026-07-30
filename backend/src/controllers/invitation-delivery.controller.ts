import { Request, Response, NextFunction } from "express";
import type {
  DeliveryChannel,
  DeliveryStatus,
} from "../generated/prisma/client.js";
import invitationDeliveryService from "../services/invitation-delivery.service.js";

type DeliveryIdParams = {
  idDelivery: string;
};

type InvitationIdParams = {
  idInvitation: string;
};

async function createInvitationDelivery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    invitationId,
    channel,
    status,
    sentAt,
  }: {
    invitationId: number;
    channel: DeliveryChannel;
    status: DeliveryStatus;
    sentAt?: Date;
  } = req.body;

  try {
    const result = await invitationDeliveryService.createInvitationDelivery(
      invitationId,
      channel,
      status,
      sentAt,
    );

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
}

async function getInvitationDeliveryById(
  req: Request<DeliveryIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idDelivery } = req.params;

  try {
    const result = await invitationDeliveryService.getInvitationDeliveryById(
      Number(idDelivery),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function getInvitationDeliveriesByInvitation(
  req: Request<InvitationIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idInvitation } = req.params;

  try {
    const result =
      await invitationDeliveryService.getInvitationDeliveriesByInvitation(
        Number(idInvitation),
      );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateInvitationDelivery(
  req: Request<DeliveryIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idDelivery } = req.params;

  const {
    channel,
    status,
    sentAt,
  }: {
    channel: DeliveryChannel;
    status: DeliveryStatus;
    sentAt?: Date;
  } = req.body;

  try {
    const result = await invitationDeliveryService.updateInvitationDelivery(
      Number(idDelivery),
      channel,
      status,
      sentAt,
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteInvitationDelivery(
  req: Request<DeliveryIdParams>,
  res: Response,
  next: NextFunction,
) {
  const { idDelivery } = req.params;

  try {
    const result = await invitationDeliveryService.deleteInvitationDelivery(
      Number(idDelivery),
    );

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  createInvitationDelivery,
  getInvitationDeliveryById,
  getInvitationDeliveriesByInvitation,
  updateInvitationDelivery,
  deleteInvitationDelivery,
};
