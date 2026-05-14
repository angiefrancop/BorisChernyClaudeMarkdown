import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StationDetail } from '../components/station/StationDetail'
import { useStationsStore } from '../store/useStationsStore'

export function StationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const items = useStationsStore((s) => s.items)
  const station = items.find((s) => s.id === id)

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-gray-500">Electrolinera no encontrada</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-brand-600 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Volver al mapa
        </button>
      </div>
    )
  }

  return <StationDetail station={station} />
}
