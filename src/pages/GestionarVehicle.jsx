import { useEffect, useState } from "react";
import {
  createVehicle,
  deleteVehicle,
  markVehicleAsSold,
  updateVehicle,
  getMyVehicles,
} from "../services/vehicleService";
import { useNavigate } from "react-router-dom";
import VehicleForm from "../components/Vehicles/VehicleForm";
import MyVehicleCard from "../components/Vehicles/MyVehicleCard";

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

    if (
      Number(form.year) < 1900 ||
      Number(form.year) > new Date().getFullYear()
    ) {
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
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Gestión de Vehículos
          </h1>
          <p className="mt-2 text-slate-600">
            Registra, edita y administra los vehículos publicados en tu cuenta.
          </p>
        </div>

        <VehicleForm
          form={form}
          editingVehicleId={editingVehicleId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Vehículos registrados
            </h2>
            <p className="mt-1 text-slate-600">
              Administra tus publicaciones desde aquí.
            </p>
          </div>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow ring-1 ring-slate-200">
            {vehicles.length} {vehicles.length === 1 ? "vehículo" : "vehículos"}
          </span>
        </div>

        {vehicles.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow ring-1 ring-slate-200">
            No tienes vehículos registrados todavía.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <MyVehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkAsSold={handleMarkAsSold}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionarVehicle;