import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getVehicleById } from "../services/vehicleService";

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/vehicles/${id}`;

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const data = await getVehicleById(id);
      setVehicle(data.data);
    } catch (error) {
      console.error("Error al cargar el detalle del vehículo:", error);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error al copiar el enlace:", error);
      alert("No se pudo copiar el enlace.");
    }
  };

  const handleInterestClick = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para contactar al vendedor.");
      navigate("/login");
      return;
    }

    navigate(`/chat?vehicleId=${vehicle._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
          <p className="text-center text-slate-600">
            Cargando detalle del vehículo...
          </p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-2xl font-bold text-slate-800">
            Vehículo no encontrado
          </h2>
          <Link
            to="/"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block rounded-xl bg-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-300"
          >
            ← Volver
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 ? (
              <img
                src={`http://localhost:3000${vehicle.vehicleImage[0]}`}
                alt={vehicle.title}
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-slate-200 text-slate-500">
                Sin imagen
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-slate-900">
                {vehicle.title}
              </h1>
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  vehicle.status === "sold"
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {vehicle.status === "sold" ? "Vendido" : "Disponible"}
              </span>
            </div>

            <p className="mb-6 text-3xl font-extrabold text-blue-600">
              ₡{Number(vehicle.price).toLocaleString()}
            </p>

            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-semibold">Marca:</span> {vehicle.brand}
              </p>
              <p>
                <span className="font-semibold">Modelo:</span> {vehicle.model}
              </p>
              <p>
                <span className="font-semibold">Año:</span> {vehicle.year}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                {vehicle.status === "sold" ? "Vendido" : "Disponible"}
              </p>
              <p>
                <span className="font-semibold">Descripción:</span>{" "}
                {vehicle.description || "No disponible"}
              </p>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Información del propietario
              </h2>

              <div className="flex items-center gap-4">
                {vehicle.user?.profileImage ? (
                  <img
                    src={`http://localhost:3000${vehicle.user.profileImage}`}
                    alt={vehicle.user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-300 font-bold text-slate-700">
                    {vehicle.user?.name?.charAt(0) || "U"}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-slate-900">
                    {vehicle.user?.name} {vehicle.user?.lastName}
                  </p>
                  <p className="text-sm text-slate-500">
                    Propietario del vehículo
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleInterestClick}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                ¿Te interesa este vehículo?
              </button>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <h2 className="mb-4 text-xl font-bold text-slate-800">
                Compartir vehículo
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none"
                />

                <button
                  onClick={handleCopyLink}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Copiar enlace
                </button>
              </div>

              {copied && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Enlace copiado correctamente.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;