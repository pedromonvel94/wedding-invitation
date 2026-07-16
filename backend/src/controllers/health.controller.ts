import { Request, Response } from "express";
import healthService from "../services/health.service.js";

function healthCheck(req: Request, res: Response) {
  const result = healthService.getServerStatus();

  res.status(200).json(result);
}

export default { healthCheck };
