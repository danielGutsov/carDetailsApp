import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { AdminUser } from "../types";

export default function AdminAccounts() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminListUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Accounts (admin)</h1>
        <div className="header-actions">
          <Link to="/admin" className="btn-secondary">
            All vehicles
          </Link>
          <Link to="/" className="btn-secondary">
            Back to my vehicles
          </Link>
        </div>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Admin</th>
              <th>Joined</th>
              <th>Vehicles</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.is_admin ? "Yes" : "—"}</td>
                <td>{u.created_at}</td>
                <td>{u.vehicle_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
