import { Router } from "express";
import { z } from "zod";
import { db } from "./db.js";
import { requireAuth } from "./middleware/requireAuth.js";

export const vehiclesRouter = Router();
vehiclesRouter.use(requireAuth);

const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD").nullish();

const vehicleSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required"),
  model: z.string().trim().min(1, "Model is required"),
  civil_liability_from: dateField,
  civil_liability_to: dateField,
  comprehensive_insurance_from: dateField,
  comprehensive_insurance_to: dateField,
  inspection_from: dateField,
  inspection_to: dateField,
  vignette_from: dateField,
  vignette_to: dateField,
  fire_extinguisher_from: dateField,
  fire_extinguisher_to: dateField,
  oil_change_km: z.number().int().min(0).nullish(),
  tyres_summer: z.number().int().min(0).default(0),
  tyres_winter: z.number().int().min(0).default(0),
  tyres_allseason: z.number().int().min(0).default(0),
});

type VehicleRow = {
  id: number;
  user_id: number;
  brand: string;
  model: string;
  civil_liability_from: string | null;
  civil_liability_to: string | null;
  comprehensive_insurance_from: string | null;
  comprehensive_insurance_to: string | null;
  inspection_from: string | null;
  inspection_to: string | null;
  vignette_from: string | null;
  vignette_to: string | null;
  fire_extinguisher_from: string | null;
  fire_extinguisher_to: string | null;
  oil_change_km: number | null;
  tyres_summer: number;
  tyres_winter: number;
  tyres_allseason: number;
  created_at: string;
  updated_at: string;
};

function toApi(row: VehicleRow) {
  const { user_id, ...rest } = row;
  return rest;
}

vehiclesRouter.get("/", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.userId) as VehicleRow[];
  res.json(rows.map(toApi));
});

vehiclesRouter.post("/", (req, res) => {
  const parsed = vehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const v = parsed.data;

  const result = db
    .prepare(
      `INSERT INTO vehicles
        (user_id, brand, model, civil_liability_from, civil_liability_to,
         comprehensive_insurance_from, comprehensive_insurance_to,
         inspection_from, inspection_to, vignette_from, vignette_to,
         fire_extinguisher_from, fire_extinguisher_to,
         oil_change_km, tyres_summer, tyres_winter, tyres_allseason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.userId,
      v.brand,
      v.model,
      v.civil_liability_from ?? null,
      v.civil_liability_to ?? null,
      v.comprehensive_insurance_from ?? null,
      v.comprehensive_insurance_to ?? null,
      v.inspection_from ?? null,
      v.inspection_to ?? null,
      v.vignette_from ?? null,
      v.vignette_to ?? null,
      v.fire_extinguisher_from ?? null,
      v.fire_extinguisher_to ?? null,
      v.oil_change_km ?? null,
      v.tyres_summer,
      v.tyres_winter,
      v.tyres_allseason
    );

  const row = db
    .prepare("SELECT * FROM vehicles WHERE id = ?")
    .get(result.lastInsertRowid) as VehicleRow;
  res.status(201).json(toApi(row));
});

function findOwnedVehicle(id: number, userId: number) {
  return db
    .prepare("SELECT * FROM vehicles WHERE id = ? AND user_id = ?")
    .get(id, userId) as VehicleRow | undefined;
}

vehiclesRouter.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = findOwnedVehicle(id, req.userId!);
  if (!existing) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const parsed = vehicleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const v = parsed.data;

  db.prepare(
    `UPDATE vehicles SET
      brand = ?, model = ?,
      civil_liability_from = ?, civil_liability_to = ?,
      comprehensive_insurance_from = ?, comprehensive_insurance_to = ?,
      inspection_from = ?, inspection_to = ?,
      vignette_from = ?, vignette_to = ?,
      fire_extinguisher_from = ?, fire_extinguisher_to = ?,
      oil_change_km = ?,
      tyres_summer = ?, tyres_winter = ?, tyres_allseason = ?,
      updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  ).run(
    v.brand,
    v.model,
    v.civil_liability_from ?? null,
    v.civil_liability_to ?? null,
    v.comprehensive_insurance_from ?? null,
    v.comprehensive_insurance_to ?? null,
    v.inspection_from ?? null,
    v.inspection_to ?? null,
    v.vignette_from ?? null,
    v.vignette_to ?? null,
    v.fire_extinguisher_from ?? null,
    v.fire_extinguisher_to ?? null,
    v.oil_change_km ?? null,
    v.tyres_summer,
    v.tyres_winter,
    v.tyres_allseason,
    id,
    req.userId
  );

  const row = findOwnedVehicle(id, req.userId!)!;
  res.json(toApi(row));
});

vehiclesRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = findOwnedVehicle(id, req.userId!);
  if (!existing) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  db.prepare("DELETE FROM vehicles WHERE id = ? AND user_id = ?").run(id, req.userId);
  res.status(204).send();
});
