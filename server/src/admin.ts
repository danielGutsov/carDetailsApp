import { Router } from "express";
import { db } from "./db.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import { requireAuth } from "./middleware/requireAuth.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/vehicles", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT vehicles.*, users.email AS owner_email
       FROM vehicles
       JOIN users ON users.id = vehicles.user_id
       ORDER BY users.email, vehicles.created_at DESC`
    )
    .all() as Array<Record<string, unknown> & { user_id: number }>;

  res.json(rows.map(({ user_id, ...rest }) => rest));
});

adminRouter.get("/users", (_req, res) => {
  const rows = db
    .prepare(
      `SELECT users.id, users.email, users.is_admin, users.created_at,
              COUNT(vehicles.id) AS vehicle_count
       FROM users
       LEFT JOIN vehicles ON vehicles.user_id = users.id
       GROUP BY users.id
       ORDER BY users.email`
    )
    .all() as Array<{
    id: number;
    email: string;
    is_admin: number;
    created_at: string;
    vehicle_count: number;
  }>;

  res.json(
    rows.map((r) => ({
      id: r.id,
      email: r.email,
      is_admin: Boolean(r.is_admin),
      created_at: r.created_at,
      vehicle_count: r.vehicle_count,
    }))
  );
});
