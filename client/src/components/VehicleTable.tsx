import { formatDateRange, vehicleNeedsAttention } from "../lib/expiry";
import type { Vehicle } from "../types";

interface Props {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ vehicles, onSelect }: Props) {
  if (vehicles.length === 0) {
    return <p className="empty-state">No vehicles yet. Press "+" to add your first one.</p>;
  }

  return (
    <div className="vehicle-table-scroll">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Brand / Model</th>
            <th>Civil liability</th>
            <th>Comprehensive insurance</th>
            <th>Inspection</th>
            <th>Fire extinguisher</th>
            <th>Oil change</th>
            <th>Tyres (S/W/A)</th>
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
              <td>{v.oil_change_km != null ? `${v.oil_change_km} km` : "—"}</td>
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
