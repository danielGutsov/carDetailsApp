import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
import { api } from "../lib/api";
import { translateError, useLanguage } from "../lib/i18n";
import type { AdminUser } from "../types";

export default function AdminAccounts() {
  const { t, lang } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminListUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? translateError(err.message, lang) : t("somethingWrong"))
      )
      .finally(() => setLoading(false));
  }, [lang, t]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{t("accountsAdmin")}</h1>
        <div className="header-actions">
          <LanguageToggle />
          <Link to="/admin" className="btn-secondary">
            {t("allVehicles")}
          </Link>
          <Link to="/" className="btn-secondary">
            {t("backToMyVehicles")}
          </Link>
        </div>
      </header>

      {loading && <p>{t("loading")}</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>{t("email")}</th>
              <th>{t("admin")}</th>
              <th>{t("joined")}</th>
              <th>{t("vehiclesCount")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.is_admin ? t("yes") : "—"}</td>
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
