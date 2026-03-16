import { useEffect, useState } from "react";
import { getVehicles } from "../services/vehicleService";
import HeroSection from "../components/Home/HeroSection";
import VehicleFilters from "../components/Home/VehicleFilters";
import VehicleCard from "../components/Home/VehicleCard";
import Pagination from "../components/Home/Pagination";

function PublicHome() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVehicles: 0
  });

  const [currentFilters, setCurrentFilters] = useState({});

  const loadVehicles = async (filters = currentFilters, page = 1) => {
    try {
      setLoading(true);

      const finalFilters = { ...filters, page, limit: 6 };
      const data = await getVehicles(finalFilters);

      setVehicles(data.data || []);

      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalVehicles: data.totalVehicles || 0
      });

      setCurrentFilters(filters);

    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles({}, 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      <HeroSection />

      <div className="mx-auto max-w-7xl px-6 py-8">

        <VehicleFilters onFilter={(filters) => loadVehicles(filters, 1)} />

        <div className="mb-6 flex justify-end">
          <span className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow ring-1 ring-slate-200">
            {pagination.totalVehicles} resultados
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-600">
            Cargando vehículos...
          </div>

        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow">
            No se encontraron vehículos con esos filtros.
          </div>

        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={(page) => loadVehicles(currentFilters, page)}
            />
          </>
        )}

      </div>
    </div>
  );
}

export default PublicHome;