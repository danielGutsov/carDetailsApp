import { formatDateRange, vehicleNeedsAttention } from "../lib/expiry";
import type { Vehicle } from "../types";

interface Props {
  vehicle: Vehicle;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, onClick }: Props) {
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
        <dt>Civil liability</dt>
        <dd>{formatDateRange(vehicle.civil_liability_from, vehicle.civil_liability_to)}</dd>
        <dt>Comprehensive insurance</dt>
        <dd>
          {formatDateRange(
            vehicle.comprehensive_insurance_from,
            vehicle.comprehensive_insurance_to
          )}
        </dd>
        <dt>Inspection</dt>
        <dd>{formatDateRange(vehicle.inspection_from, vehicle.inspection_to)}</dd>
        <dt>Fire extinguisher</dt>
        <dd>{formatDateRange(vehicle.fire_extinguisher_from, vehicle.fire_extinguisher_to)}</dd>
        <dt>Oil change</dt>
        <dd>{vehicle.oil_change_km != null ? `${vehicle.oil_change_km} km` : "—"}</dd>
        <dt>Tyres</dt>
        <dd>
          Summer: {vehicle.tyres_summer} · Winter: {vehicle.tyres_winter} · All-season:{" "}
          {vehicle.tyres_allseason}
        </dd>
      </dl>
    </button>
  );
}
