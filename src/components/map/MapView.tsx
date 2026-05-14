import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Electrolinera } from '../../types'
import { StationMarker } from './StationMarker'

// Fix leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MEDELLIN: [number, number] = [6.2442, -75.5812]

function FlyToSelected({ station }: { station: Electrolinera | null }) {
  const map = useMap()
  useEffect(() => {
    if (station) {
      map.flyTo([station.latitud, station.longitud], 16, { duration: 0.8 })
    }
  }, [station, map])
  return null
}

interface Props {
  stations: Electrolinera[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MapView({ stations, selectedId, onSelect }: Props) {
  const selected = stations.find((s) => s.id === selectedId) ?? null

  return (
    <MapContainer
      center={MEDELLIN}
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected station={selected} />
      {stations.map((s) => (
        <StationMarker
          key={s.id}
          station={s}
          isSelected={s.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  )
}
