import type { NextFunction, Request, Response } from "express";
import { db } from "../db.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = db
    .prepare("SELECT is_admin FROM users WHERE id = ?")
    .get(req.userId) as { is_admin: number } | undefined;

  if (!user || !user.is_admin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
