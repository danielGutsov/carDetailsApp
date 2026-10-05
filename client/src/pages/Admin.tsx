import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
import { formatDateRange, vehicleNeedsAttention } from "../lib/expiry";
import { api } from "../lib/api";
import { translateError, useLanguage } from "../lib/i18n";
import type { AdminVehicle } from "../types";

export default function Admin() {
  const { t, lang } = useLanguage();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminListVehicles()
      .then(setVehicles)
      .catch((err) =>
        setError(err instanceof Error ? translateError(err.message, lang) : t("somethingWrong"))
      )
      .finally(() => setLoading(false));
  }, [lang, t]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{t("allVehiclesAdmin")}</h1>
        <div className="header-actions">
          <LanguageToggle />
          <Link to="/admin/accounts" className="btn-secondary">
            {t("accounts")}
          </Link>
          <Link to="/" className="btn-secondary">
            {t("backToMyVehicles")}
          </Link>
        </div>
      </header>

      {loading && <p>{t("loading")}</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && vehicles.length === 0 && (
        <p className="empty-state">{t("noVehiclesAnyAccount")}</p>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="vehicle-table-scroll">
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>{t("owner")}</th>
                <th>{t("brandModel")}</th>
                <th>{t("civilLiability")}</th>
                <th>{t("comprehensiveInsurance")}</th>
                <th>{t("inspection")}</th>
                <th>{t("vignette")}</th>
                <th>{t("fireExtinguisher")}</th>
                <th>{t("oilChange")}</th>
                <th>{t("tyresShort")}</th>
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
                  <td>{formatDateRange(v.vignette_from, v.vignette_to)}</td>
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
      )}
    </div>
  );
}
