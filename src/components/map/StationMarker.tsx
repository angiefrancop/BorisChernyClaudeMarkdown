import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import type { Electrolinera } from '../../types'

function makeIcon(estado: Electrolinera['estado'], selected: boolean) {
  const color = estado === 'en_servicio' ? '#10b981' : '#ef4444'
  const size = selected ? 36 : 28
  const ring = selected ? `<circle cx="18" cy="18" r="17" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>` : ''
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size + 8}" height="${size + 8}" viewBox="0 0 44 44">
      ${ring}
      <circle cx="22" cy="22" r="${size / 2}" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="22" y="27" text-anchor="middle" font-size="14" fill="white">⚡</text>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -((size + 8) / 2)],
  })
}

interface Props {
  station: Electrolinera
  isSelected: boolean
  onSelect: (id: string) => void
}

export function StationMarker({ station, isSelected, onSelect }: Props) {
  const navigate = useNavigate()

  return (
    <Marker
      position={[station.latitud, station.longitud]}
      icon={makeIcon(station.estado, isSelected)}
      eventHandlers={{ click: () => onSelect(station.id) }}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup>
        <div className="min-w-[160px]">
          <p className="font-semibold text-sm">{station.nombre}</p>
          <p className="text-xs text-gray-500">{station.empresa}</p>
          <button
            onClick={() => navigate(`/station/${station.id}`)}
            className="mt-2 text-xs text-brand-600 font-medium underline"
          >
            Ver detalle →
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
