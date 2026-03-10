function VehicleFilters({ filters, onChange, onSubmit, onClear }) {
    return (
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Búsqueda y filtrado</h2>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <input type="text" name="brand" placeholder="Marca" value={filters.brand} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>

                <input type="text" name="model" placeholder="Modelo" value={filters.model} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>

                <input type="number" name="minYear" placeholder="Año mínimo" value={filters.minYear} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>

                <input type="number" name="maxYear" placeholder="Año máximo" value={filters.maxYear} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>

                <input type="number" name="minPrice" placeholder="Precio mínimo" value={filters.minPrice} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>

                <input type="number" name="maxPrice" placeholder="Precio máximo" value={filters.maxPrice} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>

                <select name="status" value={filters.status} onChange={onChange} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                    <option value="">Estado</option>
                    <option value="available">Disponible</option>
                    <option value="sold">Vendido</option>
                </select>

                <div className="flex gap-3 lg:col-span-1">
                    <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Buscar</button>
                    <button type="button" onClick={onClear} className="w-full rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">Limpiar</button>
                </div>
            </form>
        </div>
    );
}

export default VehicleFilters;