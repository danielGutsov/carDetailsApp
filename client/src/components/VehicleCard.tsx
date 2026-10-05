import { formatDateRange, vehicleNeedsAttention } from "../lib/expiry";
import { useLanguage } from "../lib/i18n";
import type { Vehicle } from "../types";

interface Props {
  vehicle: Vehicle;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, onClick }: Props) {
  const { t } = useLanguage();
  const needsAttention = vehicleNeedsAttention(vehicle);

  return (
    <button
      className={`vehicle-card${needsAttention ? " vehicle-card--warning" : ""}`}
      onClick={onClick}
      type="button"
    >
      <h3>
        {vehicle.brand} {vehicle.model}
      </h3>
      <dl>
        <dt>{t("civilLiability")}</dt>
        <dd>{formatDateRange(vehicle.civil_liability_from, vehicle.civil_liability_to)}</dd>
        <dt>{t("comprehensiveInsurance")}</dt>
        <dd>
          {formatDateRange(
            vehicle.comprehensive_insurance_from,
            vehicle.comprehensive_insurance_to
          )}
        </dd>
        <dt>{t("inspection")}</dt>
        <dd>{formatDateRange(vehicle.inspection_from, vehicle.inspection_to)}</dd>
        <dt>{t("vignette")}</dt>
        <dd>{formatDateRange(vehicle.vignette_from, vehicle.vignette_to)}</dd>
        <dt>{t("fireExtinguisher")}</dt>
        <dd>{formatDateRange(vehicle.fire_extinguisher_from, vehicle.fire_extinguisher_to)}</dd>
        <dt>{t("oilChange")}</dt>
        <dd>{vehicle.oil_change_km != null ? `${vehicle.oil_change_km} ${t("km")}` : "—"}</dd>
        <dt>{t("tyres")}</dt>
        <dd>
          {t("summer")}: {vehicle.tyres_summer} · {t("winter")}: {vehicle.tyres_winter} ·{" "}
          {t("allSeason")}: {vehicle.tyres_allseason}
        </dd>
      </dl>
    </button>
  );
}
