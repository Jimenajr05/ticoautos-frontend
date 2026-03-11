import { useState } from "react";

function VehicleFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    status: "available",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice)) {
    alert("El precio mínimo no puede ser mayor al precio máximo.");
    return;
  }

  if (filters.minYear && filters.maxYear && Number(filters.minYear) > Number(filters.maxYear)) {
    alert("El año mínimo no puede ser mayor al año máximo.");
    return;
  }

  onFilter(filters);
};

  const handleClear = () => {
    const emptyFilters = {
      brand: "",
      model: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      status: "available",
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-slate-800">
        Buscar vehículos
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={filters.brand}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          name="model"
          placeholder="Modelo"
          value={filters.model}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="minPrice"
          placeholder="Precio mínimo"
          value={filters.minPrice}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Precio máximo"
          value={filters.maxPrice}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="minYear"
          placeholder="Año mínimo"
          value={filters.minYear}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="maxYear"
          placeholder="Año máximo"
          value={filters.maxYear}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="available">Disponible</option>
          <option value="sold">Vendido</option>
          <option value="">Todos</option>
        </select>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-cyan-500 text-white px-5 py-2 rounded-lg hover:bg-cyan-600"
        >
          Buscar
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="bg-slate-300 text-slate-800 px-5 py-2 rounded-lg hover:bg-slate-400"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default VehicleFilters;