import type { Vehicle } from "../types";
import VehicleCard from "./VehicleCard";

interface Props {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleGrid({ vehicles, onSelect }: Props) {
  if (vehicles.length === 0) {
    return <p className="empty-state">No vehicles yet. Press "+" to add your first one.</p>;
  }

  return (
    <div className="vehicle-grid">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} onClick={() => onSelect(v)} />
      ))}
    </div>
  );
}
