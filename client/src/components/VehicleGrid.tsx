import { useLanguage } from "../lib/i18n";
import type { Vehicle } from "../types";
import VehicleCard from "./VehicleCard";

interface Props {
  vehicles: Vehicle[];
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleGrid({ vehicles, onSelect }: Props) {
  const { t } = useLanguage();

  if (vehicles.length === 0) {
    return <p className="empty-state">{t("noVehiclesYet")}</p>;
  }

  return (
    <div className="vehicle-grid">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} onClick={() => onSelect(v)} />
      ))}
    </div>
  );
}
