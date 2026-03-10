import { useEffect, useState } from "react";
import { createVehicle, getVehicles, deleteVehicle, markVehicleAsSold, updateVehicle } from "../services/vehicleService";
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
        vehicleImage: []
    };

    const [form, setForm] = useState(initialForm);
    const [vehicles, setVehicles] = useState([]);
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [previewImages, setPreviewVehicleImage] = useState([]);

    const resetForm = () => {
        setForm(initialForm);
        setEditingVehicleId(null);
        setPreviewVehicleImage([]);
    };

    const loadVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data.data);
        } catch (error) {
            console.error("Error al cargar vehículos:", error);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            alert('Debes iniciar sesión para gestionar tus vehículos');
            navigate('/login');
            return;
        } 
        loadVehicles();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "vehicleImage") {
            const fileArray = Array.from(files);

            setForm({
                ...form,
                vehicleImage: fileArray
            });
        
        const preview = fileArray.map(file => URL.createObjectURL(file));
        setPreviewVehicleImage(preview);
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("brand", form.brand);
            formData.append("model", form.model);
            formData.append("year", form.year);
            formData.append("price", form.price);
            formData.append("description", form.description);

            if (form.vehicleImage && form.vehicleImage.length > 0) {
                form.vehicleImage.forEach((image) => {
                    formData.append("vehicleImage", image);
                });
            }

            if (editingVehicleId) {
                await updateVehicle(editingVehicleId, formData);
                alert('Vehículo actualizado correctamente');
            } else {
                await createVehicle(formData);
                alert('Vehículo creado correctamente');
            }

            resetForm();
            loadVehicles();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al guardar el vehículo');
        }
    };

    const handleEdit = (vehicle) => {
        setEditingVehicleId(vehicle._id);
        setForm({
            title: vehicle.title || "",
            brand: vehicle.brand || "",
            model: vehicle.model || "",
            year: vehicle.year || "",
            price: vehicle.price || "",
            description: vehicle.description || "",
            vehicleImage: []
        });
        setPreviewVehicleImage([]);
    }

    const handleDelete = async (id) => {
        try {
            await deleteVehicle(id);
            alert('Vehículo eliminado correctamente');
            
            if (editingVehicleId === id) {
                resetForm();
            }

            loadVehicles();

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al eliminar el vehículo');
        }
    };

    const handleMarkAsSold = async (id) => {
        try {
            await markVehicleAsSold(id);
            alert('Vehículo marcado como vendido');
            loadVehicles();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al marcar el vehículo como vendido');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8">
             <div className="mx-auto max-w-6xl">
                <h2 className="mb-6 text-3xl font-bold text-slate-800">Gestión de Vehículos</h2>
                
                <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-slate-700">
                        {editingVehicleId ? "Editar vehículo" : "Registrar vehículo"}
                    </h3>

                     <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                        <input type="text" name="title" placeholder="Título" value={form.title} onChange={handleChange} required className="rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                        <input type="text" name="brand" placeholder="Marca" value={form.brand} onChange={handleChange} required className="rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                        <input type="text" name="model" placeholder="Modelo" value={form.model} onChange={handleChange} required className="rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                        <input type="number" name="year" placeholder="Año" value={form.year} onChange={handleChange} required className="rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                        <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required className="rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="col-span-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>

                        <div className="col-span-full">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Fotos del vehículo</label>
                            <input type="file" name="vehicleImage" accept="image/*" multiple onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-3"/>
                        </div>

                        {previewImages.length > 0 && (
                            <div className="col-span-full">
                                <p className="mb-3 text-sm font-medium text-slate-700">Vista previa</p>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    {previewImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={
                                                image.startsWith("/uploads")
                                                    ? `http://localhost:3000${image}`
                                                    : image
                                            }
                                            alt={`Preview ${index + 1}`}
                                            className="h-32 w-full rounded-xl object-cover shadow"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 md:col-span-2">
                            <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
                                {editingVehicleId ? "Actualizar Vehículo" : "Crear Vehículo"}
                            </button>

                            {editingVehicleId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white transition hover:bg-gray-600"
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <h3 className="mb-4 text-2xl font-semibold text-slate-800">Vehículos Registrados</h3>

                {vehicles.length === 0 ? (
                    <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-md"> No hay vehículos registrados.</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg">
                                {vehicle.vehicleImage && vehicle.vehicleImage.length > 0 && (
                                    <img
                                        src={`http://localhost:3000${vehicle.vehicleImage[0]}`}
                                        alt={vehicle.title}
                                        className="h-56 w-full object-cover"
                                    />
                                )}

                                <div className="p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <h4 className="text-xl font-bold text-slate-800">{vehicle.title}</h4>

                                        {vehicle.status === "sold" && (
                                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Vendido</span>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-slate-600">
                                        <p><span className="font-semibold">Marca:</span> {vehicle.brand}</p>
                                        <p><span className="font-semibold">Modelo:</span> {vehicle.model}</p>
                                        <p><span className="font-semibold">Año:</span> {vehicle.year}</p>
                                        <p><span className="font-semibold">Precio:</span> ₡{vehicle.price}</p>
                                        <p><span className="font-semibold">Descripción:</span> {vehicle.description}</p>
                                    </div>

                                    {vehicle.vehicleImage && vehicle.vehicleImage.length > 1 && (
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {vehicle.vehicleImage.slice(1, 4).map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={`http://localhost:3000${img}`}
                                                    alt={`Vehículo ${index + 2}`}
                                                    className="h-20 w-full rounded-lg object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <button onClick={() => handleEdit(vehicle)} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
                                            Editar
                                        </button>

                                        <button onClick={() => handleDelete(vehicle._id)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                                            Eliminar
                                        </button>

                                        <button onClick={() => handleMarkAsSold(vehicle._id)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                                            Marcar como vendido
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
    );
}

export default GestionarVehicle;