import type { Vehicle } from "../types";

const WARNING_WINDOW_DAYS = 10;

/** True when the date is already past, or within WARNING_WINDOW_DAYS from today. */
export function isExpiringSoon(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= WARNING_WINDOW_DAYS;
}

/** True when any tracked expiry date on the vehicle is expiring soon or already expired. */
export function vehicleNeedsAttention(vehicle: Vehicle): boolean {
  return (
    isExpiringSoon(vehicle.civil_liability_to) ||
    isExpiringSoon(vehicle.comprehensive_insurance_to) ||
    isExpiringSoon(vehicle.inspection_to) ||
    isExpiringSoon(vehicle.vignette_to) ||
    isExpiringSoon(vehicle.fire_extinguisher_to)
  );
}

export function formatDateRange(from: string | null, to: string | null): string {
  if (!from && !to) return "—";
  return `${from ?? "?"} → ${to ?? "?"}`;
}
