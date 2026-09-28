import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { db } from "./db.js";
import { IS_PRODUCTION, JWT_SECRET } from "./env.js";
import { requireAuth } from "./middleware/requireAuth.js";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: IS_PRODUCTION,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

function issueSession(res: import("express").Response, userId: number) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
  res.cookie("token", token, COOKIE_OPTIONS);
}

authRouter.post("/register", (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const result = db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, passwordHash);

  issueSession(res, Number(result.lastInsertRowid));
  res.status(201).json({ id: result.lastInsertRowid, email, is_admin: false });
});

authRouter.post("/login", (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = db
    .prepare("SELECT id, email, password_hash, is_admin FROM users WHERE email = ?")
    .get(email) as
    | { id: number; email: string; password_hash: string; is_admin: number }
    | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  issueSession(res, user.id);
  res.json({ id: user.id, email: user.email, is_admin: Boolean(user.is_admin) });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: undefined });
  res.status(204).send();
});

authRouter.get("/me", requireAuth, (req, res) => {
  const user = db
    .prepare("SELECT id, email, is_admin FROM users WHERE id = ?")
    .get(req.userId) as { id: number; email: string; is_admin: number } | undefined;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ id: user.id, email: user.email, is_admin: Boolean(user.is_admin) });
});
