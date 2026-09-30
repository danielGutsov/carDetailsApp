import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LanguageToggle from "../components/LanguageToggle";
import VehicleFormModal from "../components/VehicleFormModal";
import VehicleGrid from "../components/VehicleGrid";
import VehicleTable from "../components/VehicleTable";
import { api } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { useLanguage } from "../lib/i18n";
import type { Vehicle, VehicleInput } from "../types";

type ViewMode = "normal" | "excel";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("normal");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);

  useEffect(() => {
    api
      .listVehicles()
      .then(setVehicles)
      .finally(() => setLoading(false));
  }, []);

  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEditModal(vehicle: Vehicle) {
    setEditing(vehicle);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSave(data: VehicleInput) {
    if (editing) {
      const updated = await api.updateVehicle(editing.id, data);
      setVehicles((vs) => vs.map((v) => (v.id === updated.id ? updated : v)));
    } else {
      const created = await api.createVehicle(data);
      setVehicles((vs) => [created, ...vs]);
    }
    closeModal();
  }

  async function handleDelete(id: number) {
    await api.deleteVehicle(id);
    setVehicles((vs) => vs.filter((v) => v.id !== id));
    closeModal();
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{t("appTitle")}</h1>
        <div className="header-actions">
          <LanguageToggle />
          <span className="user-email">{user?.email}</span>
          {user?.is_admin && (
            <>
              <Link to="/admin" className="btn-secondary">
                {t("adminView")}
              </Link>
              <Link to="/admin/accounts" className="btn-secondary">
                {t("accounts")}
              </Link>
            </>
          )}
          <button className="btn-secondary" onClick={() => logout()}>
            {t("logOut")}
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="view-toggle">
          <button
            className={view === "normal" ? "active" : ""}
            onClick={() => setView("normal")}
          >
            {t("normal")}
          </button>
          <button
            className={view === "excel" ? "active" : ""}
            onClick={() => setView("excel")}
          >
            {t("excel")}
          </button>
        </div>
        <button className="btn-add" onClick={openAddModal} aria-label={t("addVehicle")}>
          +
        </button>
      </div>

      <main className="dashboard-content">
        {loading ? (
          <p>{t("loading")}</p>
        ) : view === "normal" ? (
          <VehicleGrid vehicles={vehicles} onSelect={openEditModal} />
        ) : (
          <VehicleTable vehicles={vehicles} onSelect={openEditModal} />
        )}
      </main>

      {modalOpen && (
        <VehicleFormModal
          vehicle={editing}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
