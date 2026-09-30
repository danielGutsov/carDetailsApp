import { formatDateRange, vehicleNeedsAttention } from "../lib/expiry";
import { useLanguage } from "../lib/i18n";
import type { Vehicle } from "../types";

interface Props {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ vehicles, onSelect }: Props) {
  const { t } = useLanguage();

  if (vehicles.length === 0) {
    return <p className="empty-state">{t("noVehiclesYet")}</p>;
  }

  return (
    <div className="vehicle-table-scroll">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>{t("brandModel")}</th>
            <th>{t("civilLiability")}</th>
            <th>{t("comprehensiveInsurance")}</th>
            <th>{t("inspection")}</th>
            <th>{t("fireExtinguisher")}</th>
            <th>{t("oilChange")}</th>
            <th>{t("tyresShort")}</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr
              key={v.id}
              className={vehicleNeedsAttention(v) ? "vehicle-row--warning" : ""}
              onClick={() => onSelect(v)}
            >
              <td>
                {v.brand} {v.model}
              </td>
              <td>{formatDateRange(v.civil_liability_from, v.civil_liability_to)}</td>
              <td>
                {formatDateRange(v.comprehensive_insurance_from, v.comprehensive_insurance_to)}
              </td>
              <td>{formatDateRange(v.inspection_from, v.inspection_to)}</td>
              <td>{formatDateRange(v.fire_extinguisher_from, v.fire_extinguisher_to)}</td>
              <td>{v.oil_change_km != null ? `${v.oil_change_km} ${t("km")}` : "—"}</td>
              <td>
                {v.tyres_summer} / {v.tyres_winter} / {v.tyres_allseason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
