import { useState, type FormEvent } from "react";
import { translateError, useLanguage } from "../lib/i18n";
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
  vignette_from: null,
  vignette_to: null,
  fire_extinguisher_from: null,
  fire_extinguisher_to: null,
  oil_change_km: null,
  tyres_summer: 0,
  tyres_winter: 0,
  tyres_allseason: 0,
};

export default function VehicleFormModal({ vehicle, onClose, onSave, onDelete }: Props) {
  const { t, lang } = useLanguage();
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
          vignette_from: vehicle.vignette_from,
          vignette_to: vehicle.vignette_to,
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
      setError(err instanceof Error ? translateError(err.message, lang) : t("somethingWrong"));
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
      setError(err instanceof Error ? translateError(err.message, lang) : t("somethingWrong"));
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
        <h2>{vehicle ? t("editVehicle") : t("addVehicleTitle")}</h2>

        <div className="field-row">
          <label>
            {t("brand")}
            <input
              value={form.brand}
              onChange={(e) => setField("brand", e.target.value)}
              required
            />
          </label>
          <label>
            {t("model")}
            <input
              value={form.model}
              onChange={(e) => setField("model", e.target.value)}
              required
            />
          </label>
        </div>

        <fieldset>
          <legend>{t("civilLiability")}</legend>
          <div className="field-row">
            <label>
              {t("from")}
              <input
                type="date"
                value={form.civil_liability_from ?? ""}
                onChange={(e) => setField("civil_liability_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              {t("to")}
              <input
                type="date"
                value={form.civil_liability_to ?? ""}
                onChange={(e) => setField("civil_liability_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>{t("comprehensiveInsurance")}</legend>
          <div className="field-row">
            <label>
              {t("from")}
              <input
                type="date"
                value={form.comprehensive_insurance_from ?? ""}
                onChange={(e) =>
                  setField("comprehensive_insurance_from", dateOrNull(e.target.value))
                }
              />
            </label>
            <label>
              {t("to")}
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
          <legend>{t("inspection")}</legend>
          <div className="field-row">
            <label>
              {t("from")}
              <input
                type="date"
                value={form.inspection_from ?? ""}
                onChange={(e) => setField("inspection_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              {t("to")}
              <input
                type="date"
                value={form.inspection_to ?? ""}
                onChange={(e) => setField("inspection_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>{t("vignette")}</legend>
          <div className="field-row">
            <label>
              {t("from")}
              <input
                type="date"
                value={form.vignette_from ?? ""}
                onChange={(e) => setField("vignette_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              {t("to")}
              <input
                type="date"
                value={form.vignette_to ?? ""}
                onChange={(e) => setField("vignette_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>{t("fireExtinguisher")}</legend>
          <div className="field-row">
            <label>
              {t("from")}
              <input
                type="date"
                value={form.fire_extinguisher_from ?? ""}
                onChange={(e) => setField("fire_extinguisher_from", dateOrNull(e.target.value))}
              />
            </label>
            <label>
              {t("to")}
              <input
                type="date"
                value={form.fire_extinguisher_to ?? ""}
                onChange={(e) => setField("fire_extinguisher_to", dateOrNull(e.target.value))}
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>{t("oilChange")}</legend>
          <label>
            {t("kilometers")}
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
          <legend>{t("tyresCount")}</legend>
          <div className="field-row">
            <label>
              {t("summer")}
              <input
                type="number"
                min={0}
                value={form.tyres_summer}
                onChange={(e) => setField("tyres_summer", Number(e.target.value))}
              />
            </label>
            <label>
              {t("winter")}
              <input
                type="number"
                min={0}
                value={form.tyres_winter}
                onChange={(e) => setField("tyres_winter", Number(e.target.value))}
              />
            </label>
            <label>
              {t("allSeason")}
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
                {confirmingDelete ? t("confirmDelete") : t("delete")}
              </button>
              {confirmingDelete && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setConfirmingDelete(false)}
                  disabled={submitting}
                >
                  {t("keepIt")}
                </button>
              )}
            </div>
          )}
          <div className="modal-actions-right">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              {t("cancel")}
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
