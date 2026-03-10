import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";
import HeroSection from "../components/Home/HeroSection";
import VehicleFilters from "../components/Home/VehicleFilters";
import VehicleCard from "../components/Home/VehicleCard";
import Pagination from "../components/Home/Pagination";

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalVehicles: 0
    });

    const initialFilters = {
        brand: searchParams.get('brand') || "",
        model: searchParams.get('model') || "",
        minYear: searchParams.get('minYear') || "",
        maxYear: searchParams.get('maxYear') || "",
        minPrice: searchParams.get('minPrice') || "",
        maxPrice: searchParams.get('maxPrice') || "",
        status: searchParams.get('status') || "",
        page: Number(searchParams.get('page')) || 1,
        limit: 6
    };

    const [filters, setFilters] = useState(initialFilters);

    const buildParams = (data) => {
        const params = {};
        Object.keys(data).forEach(key => {
            if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
                params[key] = data[key];
            }
        });
        return params;
    };

    const loadVehicles = async (customFilters = filters) => {
        try {
            setLoading(true);

            const cleanFilters = buildParams(customFilters);
            const data = await getVehicles(cleanFilters);

            setVehicles(data.data || []);
            setPagination({ 
                currentPage: data.currentPage || 1,
                totalPages: data.totalPages || 1,
                totalVehicles: data.totalVehicles || 0
            });
        } catch (error) {
            console.error("Error al cargar vehículos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const updatedFilters = {    
            ...filters,
            page: 1 
        };

        setFilters(updatedFilters);
        setSearchParams(buildParams(updatedFilters));
        loadVehicles(updatedFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            brand: "",
            model: "",
            minYear: "",
            maxYear: "",
            minPrice: "",
            maxPrice: "",
            status: "",
            page: 1,
            limit: 6
        };
        setFilters(clearedFilters);
        setSearchParams({});
        loadVehicles(clearedFilters);
    };

    const changePage = (page) => {
        const updatedFilters = {
            ...filters,
            page
        };
        setFilters(updatedFilters);
        setSearchParams(buildParams(updatedFilters));
        loadVehicles(updatedFilters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <HeroSection />

            <section className="mx-auto max-w-7xl px-6 py-10">
                <VehicleFilters filters={filters} onChange={handleChange} onSubmit={handleFilterSubmit} onClear={handleClearFilters}/>

                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">Vehículos publicados</h3>
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow ring-1 ring-slate-200">
                        {pagination.totalVehicles} resultados
                    </span>
                </div>

                {loading ? (
                    <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow ring-1 ring-slate-200">
                        Cargando vehículos...
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow ring-1 ring-slate-200">
                        No se encontraron vehículos con esos filtros.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle._id} vehicle={vehicle}/>
                        ))}
                    </div>
                )}

                <Pagination pagination={pagination} onPageChange={changePage}/>
            </section>
        </div>
    );
}

export default Home;