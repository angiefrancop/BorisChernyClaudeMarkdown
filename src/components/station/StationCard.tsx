import { useNavigate } from 'react-router-dom'
import { MapPin, Zap, ChevronRight } from 'lucide-react'
import type { Electrolinera } from '../../types'
import { CONECTOR_LABELS } from '../../types'
import { cn } from '../../utils/cn'

interface Props {
  station: Electrolinera
  onMapFocus?: (id: string) => void
}

export function StationCard({ station, onMapFocus }: Props) {
  const navigate = useNavigate()
  const isActive = station.estado === 'en_servicio'

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
      onClick={() => navigate(`/station/${station.id}`)}
    >
      {station.fotos[0] && (
        <img
          src={station.fotos[0]}
          alt={station.nombre}
          className="w-full h-32 object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{station.nombre}</p>
            <p className="text-sm text-gray-500 truncate">{station.empresa}</p>
          </div>
          <span
            className={cn(
              'shrink-0 text-xs font-medium px-2 py-0.5 rounded-full',
              isActive
                ? 'bg-brand-100 text-brand-700'
                : 'bg-red-100 text-red-700',
            )}
          >
            {isActive ? 'En servicio' : 'Fuera de servicio'}
          </span>
        </div>

        {station.direccion && (
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <MapPin size={12} />
            <span className="truncate">{station.direccion}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {station.conectores.slice(0, 3).map((c) => (
            <span
              key={c.tipo}
              className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              <Zap size={10} />
              {CONECTOR_LABELS[c.tipo]}
            </span>
          ))}
          {station.conectores.length > 3 && (
            <span className="text-xs text-gray-400">
              +{station.conectores.length - 3} más
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{station.total_cargadores} cargador{station.total_cargadores !== 1 ? 'es' : ''}</span>
            {station.costo_kwh != null && (
              <span className="font-medium text-gray-700">
                ${station.costo_kwh.toLocaleString('es-CO')}/kWh
              </span>
            )}
          </div>
          {onMapFocus && (
            <button
              onClick={(e) => { e.stopPropagation(); onMapFocus(station.id) }}
              className="flex items-center gap-0.5 text-xs text-brand-600 font-medium"
            >
              Ver en mapa <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
