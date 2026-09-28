import { useState, type FormEvent } from "react";
import type { Vehicle, VehicleInput } from "../types";

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (data: VehicleInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const emptyForm: VehicleInput = {
  brand: "",
  model: "",
  civil_liability_from: null,
  civil_liability_to: null,
  comprehensive_insurance_from: null,
  comprehensive_insurance_to: null,
  inspection_from: null,
  inspection_to: null,
  fire_extinguisher_from: null,
  fire_extinguisher_to: null,
  oil_change_km: null,
  tyres_summer: 0,
  tyres_winter: 0,
  tyres_allseason: 0,
};

export default function VehicleFormModal({ vehicle, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<VehicleInput>(
    vehicle
      ? {
          brand: vehicle.brand,
          model: vehicle.model,
          civil_liability_from: vehicle.civil_liability_from,
          civil_liability_to: vehicle.civil_liability_to,
          comprehensive_insurance_from: vehicle.comprehensive_insurance_from,
          comprehensive_insurance_to: vehicle.comprehensive_insurance_to,
          inspection_from: vehicle.inspection_from,
          inspection_to: vehicle.inspection_to,
          fire_extinguisher_from: vehicle.fire_extinguisher_from,
          fire_extinguisher_to: vehicle.fire_extinguisher_to,
          oil_change_km: vehicle.oil_change_km,
          tyres_summer: vehicle.tyres_summer,
          tyres_winter: vehicle.tyres_winter,
          tyres_allseason: vehicle.tyres_allseason,
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function setField<K extends keyof VehicleInput>(key: K, value: VehicleInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function dateOrNull(value: string): string | null {
    return value === "" ? null : value;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!vehicle) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setSubmitting(true);
    try {
      await onDelete(vehicle.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{vehicle ? "Edit vehicle" : "Add vehicle"}</h2>

        <div className="field-row">
          <label>
            Brand
            <input
              value={form.brand}
              onChange={(e) => setField("brand", e.target.value)}
              required
            />
          </label>
          <label>
            Model
            <input
              value={form.model}
              onChange={(e) => setField("model", e.target.value)}
              required
            />
          </label>
        </div>

        <fieldset>
          <legend>Civil liability</legend>
          <div className="field-row">
            <label>
              From
              <input
                type="date"
                value={form.civil_liability_from ?? ""}
                onChange={(e) => setField("civil_liability_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={form.civil_liability_to ?? ""}
                onChange={(e) => setField("civil_liability_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Comprehensive insurance</legend>
          <div className="field-row">
            <label>
              From
              <input
                type="date"
                value={form.comprehensive_insurance_from ?? ""}
                onChange={(e) =>
                  setField("comprehensive_insurance_from", dateOrNull(e.target.value))
                }
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={form.comprehensive_insurance_to ?? ""}
                onChange={(e) =>
                  setField("comprehensive_insurance_to", dateOrNull(e.target.value))
                }
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Inspection</legend>
          <div className="field-row">
            <label>
              From
              <input
                type="date"
                value={form.inspection_from ?? ""}
                onChange={(e) => setField("inspection_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={form.inspection_to ?? ""}
                onChange={(e) => setField("inspection_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Fire extinguisher</legend>
          <div className="field-row">
            <label>
              From
              <input
                type="date"
                value={form.fire_extinguisher_from ?? ""}
                onChange={(e) => setField("fire_extinguisher_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={form.fire_extinguisher_to ?? ""}
                onChange={(e) => setField("fire_extinguisher_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Oil change</legend>
          <label>
            Kilometers
            <input
              type="number"
              min={0}
              value={form.oil_change_km ?? ""}
              onChange={(e) =>
                setField("oil_change_km", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Tyres (count)</legend>
          <div className="field-row">
            <label>
              Summer
              <input
                type="number"
                min={0}
                value={form.tyres_summer}
                onChange={(e) => setField("tyres_summer", Number(e.target.value))}
              />
            </label>
            <label>
              Winter
              <input
                type="number"
                min={0}
                value={form.tyres_winter}
                onChange={(e) => setField("tyres_winter", Number(e.target.value))}
              />
            </label>
            <label>
              All-season
              <input
                type="number"
                min={0}
                value={form.tyres_allseason}
                onChange={(e) => setField("tyres_allseason", Number(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          {vehicle && (
            <div className="delete-actions">
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={submitting}
              >
                {confirmingDelete ? "Confirm delete?" : "Delete"}
              </button>
              {confirmingDelete && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={submitting}
                >
                  Keep it
                </button>
              )}
            </div>
          )}
          <div className="modal-actions-right">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
