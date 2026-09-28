export interface User {
  id: number;
  email: string;
  is_admin: boolean;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  civil_liability_from: string | null;
  civil_liability_to: string | null;
  comprehensive_insurance_from: string | null;
  comprehensive_insurance_to: string | null;
  inspection_from: string | null;
  inspection_to: string | null;
  fire_extinguisher_from: string | null;
  fire_extinguisher_to: string | null;
  oil_change_km: number | null;
  tyres_summer: number;
  tyres_winter: number;
  tyres_allseason: number;
  created_at: string;
  updated_at: string;
}

export type VehicleInput = Omit<Vehicle, "id" | "created_at" | "updated_at">;

export type AdminVehicle = Vehicle & { owner_email: string };

export interface AdminUser {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
  vehicle_count: number;
}
