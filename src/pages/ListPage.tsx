import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Search, PlusCircle } from 'lucide-react'
import { StationCard } from '../components/station/StationCard'
import { FilterPanel } from '../components/station/FilterPanel'
import { useFilteredStations, useStationsStore } from '../store/useStationsStore'

export function ListPage() {
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')
  const { setSelectedId, filtros } = useStationsStore()
  const stations = useFilteredStations()

  const activeFilters =
    Number(Boolean(filtros.empresa)) +
    Number(Boolean(filtros.estado)) +
    Number(Boolean(filtros.conector))

  const filtered = stations.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.empresa.toLowerCase().includes(search.toLowerCase()) ||
      s.direccion?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleMapFocus = (id: string) => {
    setSelectedId(id)
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-4 py-3 flex gap-2 bg-gray-50 border-b border-gray-100">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar electrolinera..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="bg-white border border-gray-200 rounded-xl px-3 flex items-center gap-1.5 text-sm font-medium relative"
        >
          <SlidersHorizontal size={16} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-400 text-sm">No se encontraron electrolineras</p>
            <button
              onClick={() => navigate('/add')}
              className="mt-4 flex items-center gap-1.5 bg-brand-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
            >
              <PlusCircle size={16} />
              Agregar la primera
            </button>
          </div>
        ) : (
          filtered.map((s) => (
            <StationCard key={s.id} station={s} onMapFocus={handleMapFocus} />
          ))
        )}
      </div>

      {/* Filter sheet */}
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
    </div>
  )
}
