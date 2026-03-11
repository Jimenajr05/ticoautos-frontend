import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";
import Navbar from "../components/Navbar";
import HeroSection from "../components/Home/HeroSection";
import VehicleFilters from "../components/Home/VehicleFilters";
import VehicleCard from "../components/Home/VehicleCard";
import Pagination from "../components/Home/Pagination";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getVehicles(filters);

      const vehiclesList = data.data || data;
      const availableVehicles = vehiclesList.filter(
        (vehicle) => vehicle.status !== "sold"
      );

      setVehicles(availableVehicles);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Vehículos en venta
          </h1>
          <p className="text-slate-600 mt-2">
            Explora los autos disponibles y encuentra el que más te interese.
          </p>
        </div>

        <VehicleFilters onFilter={loadVehicles} />

        {loading ? (
          <div className="text-center py-10 text-slate-600">
            Cargando vehículos...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-slate-600">
            No se encontraron vehículos con esos filtros.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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