import { useState } from "react";

function VehicleFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    status: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      filters.minYear &&
      filters.maxYear &&
      Number(filters.minYear) > Number(filters.maxYear)
    ) {
      alert("El año mínimo no puede ser mayor al año máximo.");
      return;
    }

    if (
      filters.minPrice &&
      filters.maxPrice &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      alert("El precio mínimo no puede ser mayor al precio máximo.");
      return;
    }

    const cleanFilters = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "") {
        cleanFilters[key] = filters[key];
      }
    });

    onFilter(cleanFilters);
  };

  const handleClear = () => {
    setFilters({
      brand: "",
      model: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
      status: "",
    });

    onFilter({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl bg-white p-6 shadow"
    >
      <h2 className="mb-4 text-2xl font-bold text-slate-800">
        Buscar vehículos
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={filters.brand}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="text"
          name="model"
          placeholder="Modelo"
          value={filters.model}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="number"
          name="minYear"
          placeholder="Año mínimo"
          value={filters.minYear}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="number"
          name="maxYear"
          placeholder="Año máximo"
          value={filters.maxYear}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="number"
          name="minPrice"
          placeholder="Precio mínimo"
          value={filters.minPrice}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Precio máximo"
          value={filters.maxPrice}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="" disabled hidden>Estado del vehículo</option>
          <option value="available">Disponible</option>
          <option value="sold">Vendido</option>
        </select>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Buscar
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl bg-slate-300 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-400"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default VehicleFilters;