import { Request, Response, NextFunction } from "express";
import publicService from "../services/public.service.js";

export class PublicController {
  /**
   * Endpoint GET /api/public/invitations/:id
   */
  async getPublicInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const idInvitation = Number(req.params.id);
      const invitation = await publicService.getPublicInvitation(idInvitation);
      res.json({
        success: true,
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint POST /api/public/rsvp
   */
  async submitPublicRsvp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, status, email, phoneNumber, guestId, invitationId } = req.body;
      const result = await publicService.submitPublicRsvp({
        name,
        status: status === "DECLINED" ? "DECLINED" : "CONFIRMED",
        email,
        phoneNumber,
        guestId: guestId ? Number(guestId) : undefined,
        invitationId: invitationId ? Number(invitationId) : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Endpoint POST /api/public/rsvp/batch
   */
  async submitBatchPublicRsvp(req: Request, res: Response, next: NextFunction) {
    try {
      const { invitationId, respondedByName, responses } = req.body;
      const result = await publicService.submitBatchPublicRsvp({
        invitationId: invitationId ? Number(invitationId) : undefined,
        respondedByName: respondedByName ? String(respondedByName).trim() : undefined,
        responses: Array.isArray(responses) ? responses : [],
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new PublicController();
