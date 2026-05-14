import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, PlusCircle } from 'lucide-react'
import { MapView } from '../components/map/MapView'
import { FilterPanel } from '../components/station/FilterPanel'
import { useStationsStore, useFilteredStations } from '../store/useStationsStore'

export function MapPage() {
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const { selectedId, setSelectedId, filtros } = useStationsStore()
  const stations = useFilteredStations()

  const activeFilters =
    Number(Boolean(filtros.empresa)) +
    Number(Boolean(filtros.estado)) +
    Number(Boolean(filtros.conector))

  return (
    <div className="relative h-full">
      <MapView
        stations={stations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* FAB filtros */}
      <button
        onClick={() => setShowFilters(true)}
        className="absolute top-4 right-4 z-40 bg-white shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2 text-sm font-medium"
      >
        <SlidersHorizontal size={16} />
        Filtros
        {activeFilters > 0 && (
          <span className="bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {activeFilters}
          </span>
        )}
      </button>

      {/* FAB agregar */}
      <button
        onClick={() => navigate('/add')}
        className="absolute bottom-6 right-4 z-40 bg-brand-500 text-white shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2 text-sm font-semibold"
      >
        <PlusCircle size={18} />
        Agregar
      </button>

      {/* Bottom sheet filtros */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="relative w-full">
            <FilterPanel onClose={() => setShowFilters(false)} />
          </div>
        </div>
      )}

      {/* Contador */}
      <div className="absolute bottom-6 left-4 z-40 bg-white/90 backdrop-blur-sm shadow rounded-xl px-3 py-1.5 text-xs font-medium text-gray-600">
        {stations.length} electrolinera{stations.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
