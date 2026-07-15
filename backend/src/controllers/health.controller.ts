import { Request, Response } from "express";

function healthCheck(req: Request, res: Response) {
  res.status(200).json({
    success: true,
    message: "Servidor en funcionamiento",
  });
}

export default { healthCheck };
