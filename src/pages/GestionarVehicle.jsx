import { useEffect, useState } from "react";
import {
  createVehicle,
  deleteVehicle,
  markVehicleAsSold,
  updateVehicle,
  getMyVehicles,
} from "../services/vehicleService";
import { useNavigate } from "react-router-dom";

function GestionarVehicle() {
  const navigate = useNavigate();

  const initialForm = {
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    description: "",
    vehicleImage: [],
  };

  const [form, setForm] = useState(initialForm);
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditingVehicleId(null);
  };

  const loadVehicles = async () => {
    try {
      const data = await getMyVehicles();
      setVehicles(data.data || []);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/login");
      return;
    }

    loadVehicles();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "vehicleImage") {
      setForm({
        ...form,
        vehicleImage: files,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      alert("El título del vehículo es obligatorio.");
      return false;
    }

    if (!form.brand.trim()) {
      alert("La marca del vehículo es obligatoria.");
      return false;
    }

    if (!form.model.trim()) {
      alert("El modelo del vehículo es obligatorio.");
      return false;
    }

    if (!form.year) {
      alert("El año del vehículo es obligatorio.");
      return false;
    }

    if (Number(form.year) < 1900 || Number(form.year) > new Date().getFullYear()) {
      alert("Ingresa un año válido.");
      return false;
    }

    if (!form.price) {
      alert("El precio del vehículo es obligatorio.");
      return false;
    }

    if (Number(form.price) <= 0) {
      alert("El precio debe ser mayor a 0.");
      return false;
    }

    if (!form.description.trim()) {
      alert("La descripción del vehículo es obligatoria.");
      return false;
    }

    // Solo exigir imagen al crear, no al editar
    if (!editingVehicleId && (!form.vehicleImage || form.vehicleImage.length === 0)) {
      alert("Debes subir al menos una foto del vehículo.");
      return false;
    }

    return true;
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("brand", form.brand);
    formData.append("model", form.model);
    formData.append("year", form.year);
    formData.append("price", form.price);
    formData.append("description", form.description);

    if (form.vehicleImage && form.vehicleImage.length > 0) {
      for (let i = 0; i < form.vehicleImage.length; i++) {
        formData.append("vehicleImage", form.vehicleImage[i]);
      }
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = buildFormData();

      if (editingVehicleId) {
        await updateVehicle(editingVehicleId, formData);
        alert("Vehículo actualizado correctamente.");
      } else {
        await createVehicle(formData);
        alert("Vehículo creado correctamente.");
      }

      resetForm();
      await loadVehicles();
    } catch (error) {
      console.error("Error al guardar vehículo:", error);

      const message =
        error?.response?.data?.message ||
        "Ocurrió un error al guardar el vehículo.";

      alert(message);
    }
  };

  const handleEdit = (vehicle) => {
    setForm({
      title: vehicle.title || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      price: vehicle.price || "",
      description: vehicle.description || "",
      vehicleImage: [],
    });

    setEditingVehicleId(vehicle._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este vehículo?"
    );

    if (!confirmDelete) return;

    try {
      await deleteVehicle(id);
      alert("Vehículo eliminado correctamente.");
      await loadVehicles();
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      alert(error.response?.data?.message || "Error al eliminar vehículo.");
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      await markVehicleAsSold(id);
      alert("Vehículo marcado como vendido.");
      await loadVehicles();
    } catch (error) {
      console.error("Error al marcar como vendido:", error);
      alert(
        error.response?.data?.message || "Error al marcar vehículo como vendido."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">Gestión de Vehículos</h1>

        <div className="mb-10 rounded-3xl bg-slate-900 p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold">
            {editingVehicleId ? "Editar vehículo" : "Registrar vehículo"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={form.title}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="brand"
                placeholder="Marca"
                value={form.brand}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="text"
                name="model"
                placeholder="Modelo"
                value={form.model}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="number"
                name="year"
                placeholder="Año"
                value={form.year}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <textarea
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Fotos del vehículo
              </label>
              <input
                type="file"
                name="vehicleImage"
                multiple
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {editingVehicleId ? "Actualizar vehículo" : "Crear Vehículo"}
              </button>

              {editingVehicleId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="mb-6 text-3xl font-bold">Vehículos Registrados</h2>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl bg-slate-900 p-6 text-slate-300">
              No tienes vehículos registrados todavía.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="overflow-hidden rounded-3xl bg-slate-900 shadow-lg"
                >
                  <div className="relative">
                    {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 ? (
                      <img
                        src={`http://localhost:3000${vehicle.vehicleImage[0]}`}
                        alt={vehicle.title}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-slate-800 text-slate-400">
                        Sin imagen
                      </div>
                    )}

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold ${
                        vehicle.status === "sold"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {vehicle.status === "sold" ? "Vendido" : "Disponible"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-3 text-xl font-bold">{vehicle.title}</h3>

                    <div className="space-y-2 text-sm text-slate-300">
                      <p><span className="font-semibold">Marca:</span> {vehicle.brand}</p>
                      <p><span className="font-semibold">Modelo:</span> {vehicle.model}</p>
                      <p><span className="font-semibold">Año:</span> {vehicle.year}</p>
                      <p>
                        <span className="font-semibold">Precio:</span> ₡
                        {Number(vehicle.price).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold">Descripción:</span> {vehicle.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Eliminar
                      </button>

                      {vehicle.status !== "sold" && (
                        <button
                          onClick={() => handleMarkAsSold(vehicle._id)}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Marcar como vendido
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionarVehicle;