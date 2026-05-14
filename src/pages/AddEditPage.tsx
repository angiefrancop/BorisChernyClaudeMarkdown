import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StationForm } from '../components/station/StationForm'
import { useStationsStore } from '../store/useStationsStore'
import type { Electrolinera } from '../types'

export function AddPage() {
  const navigate = useNavigate()
  const { add } = useStationsStore()

  const handleSubmit = async (
    payload: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    await add(payload)
    navigate('/', { replace: true })
  }

  return (
    <PageShell title="Agregar electrolinera">
      <StationForm onSubmit={handleSubmit} submitLabel="Guardar electrolinera" />
    </PageShell>
  )
}

export function EditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, update } = useStationsStore()
  const station = items.find((s) => s.id === id)

  if (!station) {
    return (
      <PageShell title="Editar electrolinera">
        <p className="text-gray-500 text-sm">Electrolinera no encontrada.</p>
      </PageShell>
    )
  }

  const handleSubmit = async (
    payload: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    await update(station.id, payload)
    navigate(`/station/${station.id}`, { replace: true })
  }

  return (
    <PageShell title="Editar electrolinera">
      <StationForm
        defaultValues={station}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    </PageShell>
  )
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-semibold">{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {children}
      </div>
    </div>
  )
}
