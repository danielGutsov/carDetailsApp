import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDateRange, vehicleNeedsAttention } from "../lib/expiry";
import { api } from "../lib/api";
import type { AdminVehicle } from "../types";

export default function Admin() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminListVehicles()
      .then(setVehicles)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>All vehicles (admin)</h1>
        <div className="header-actions">
          <Link to="/admin/accounts" className="btn-secondary">
            Accounts
          </Link>
          <Link to="/" className="btn-secondary">
            Back to my vehicles
          </Link>
        </div>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && vehicles.length === 0 && (
        <p className="empty-state">No vehicles have been added by any account yet.</p>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="vehicle-table-scroll">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Owner</th>
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
                <tr key={v.id} className={vehicleNeedsAttention(v) ? "vehicle-row--warning" : ""}>
                  <td>{v.owner_email}</td>
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
      )}
    </div>
  );
}
