import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";
import VehicleFilters from "../components/Home/VehicleFilters";
import VehicleCard from "../components/Home/VehicleCard";

function Home() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getVehicles(filters);
      setVehicles(data.data || []);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadVehicles({ status: "available" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Vehículos en venta
          </h1>
          <p className="mt-2 text-slate-600">
            Explora los autos disponibles y encuentra el que más te interese.
          </p>
        </div>

        <VehicleFilters onFilter={loadVehicles} />

        {loading ? (
          <div className="py-10 text-center text-slate-600">
            Cargando vehículos...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow">
            No se encontraron vehículos con esos filtros.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;