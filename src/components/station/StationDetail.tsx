import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Trash2, MapPin, Zap, Clock,
  DollarSign, StickyNote, Image, ExternalLink,
} from 'lucide-react'
import type { Electrolinera } from '../../types'
import { CONECTOR_LABELS, SERVICIO_LABELS } from '../../types'
import { useStationsStore } from '../../store/useStationsStore'
import { cn } from '../../utils/cn'

const NAV_OPTIONS = [
  {
    label: 'Google Maps',
    url: (lat: number, lng: number) =>
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  },
  {
    label: 'Waze',
    url: (lat: number, lng: number) =>
      `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
  },
  {
    label: 'Apple Maps',
    url: (lat: number, lng: number) =>
      `https://maps.apple.com/?daddr=${lat},${lng}`,
  },
]

interface Props {
  station: Electrolinera
}

export function StationDetail({ station }: Props) {
  const navigate = useNavigate()
  const remove = useStationsStore((s) => s.remove)
  const addFoto = useStationsStore((s) => s.addFoto)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta electrolinera?')) return
    await remove(station.id)
    navigate('/', { replace: true })
  }

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await addFoto(station.id, file)
    e.target.value = ''
  }

  const isActive = station.estado === 'en_servicio'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero / fotos */}
      <div className="relative bg-gray-200 h-52">
        {station.fotos[0] ? (
          <img
            src={station.fotos[0]}
            alt={station.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Zap size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => navigate(`/edit/${station.id}`)}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{station.nombre}</h1>
              <p className="text-sm text-gray-500">{station.empresa}</p>
            </div>
            <span
              className={cn(
                'shrink-0 text-xs font-semibold px-3 py-1 rounded-full',
                isActive ? 'bg-brand-100 text-brand-700' : 'bg-red-100 text-red-700',
              )}
            >
              {isActive ? 'En servicio' : 'Fuera de servicio'}
            </span>
          </div>

          {station.direccion && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <MapPin size={14} className="shrink-0" />
              {station.direccion}
            </div>
          )}

          {/* Navegar */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {NAV_OPTIONS.map((opt) => (
              <a
                key={opt.label}
                href={opt.url(station.latitud, station.longitud)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-brand-500 text-white px-3 py-1.5 rounded-full font-medium"
              >
                <ExternalLink size={11} />
                {opt.label}
              </a>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Stat
            icon={<Zap size={16} className="text-brand-500" />}
            label="Cargadores"
            value={String(station.total_cargadores)}
          />
          {station.costo_kwh != null && (
            <Stat
              icon={<DollarSign size={16} className="text-brand-500" />}
              label="Costo por kWh"
              value={`$${station.costo_kwh.toLocaleString('es-CO')}`}
            />
          )}
          <Stat
            icon={<Clock size={16} className="text-brand-500" />}
            label="Horario"
            value={
              station.horario_247
                ? '24 / 7'
                : `${station.hora_apertura ?? '--'} – ${station.hora_cierre ?? '--'}`
            }
          />
        </div>

        {/* Conectores */}
        <Section title="Tipos de conector">
          <div className="flex flex-wrap gap-2">
            {station.conectores.map((c) => (
              <div
                key={c.tipo}
                className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-1.5"
              >
                <Zap size={13} className="text-brand-500" />
                <span className="text-sm font-medium">{CONECTOR_LABELS[c.tipo]}</span>
                <span className="text-xs text-gray-500">×{c.cantidad}</span>
                {c.potencia_kw && (
                  <span className="text-xs text-gray-400">{c.potencia_kw} kW</span>
                )}
              </div>
            ))}
            {station.conectores.length === 0 && (
              <p className="text-sm text-gray-400">Sin información</p>
            )}
          </div>
        </Section>

        {/* Servicios adicionales */}
        {station.servicios.length > 0 && (
          <Section title="Servicios adicionales">
            <div className="flex flex-wrap gap-2">
              {station.servicios.map((s) => (
                <span
                  key={s}
                  className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                >
                  {SERVICIO_LABELS[s]}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Notas */}
        {station.notas && (
          <Section title="Notas personales">
            <div className="flex gap-2">
              <StickyNote size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 whitespace-pre-line">{station.notas}</p>
            </div>
          </Section>
        )}

        {/* Fotos */}
        <Section title="Fotos">
          <div className="grid grid-cols-3 gap-2">
            {station.fotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Foto ${i + 1}`}
                className="w-full aspect-square object-cover rounded-xl"
              />
            ))}
            <button
              onClick={() => fileRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center bg-gray-100 rounded-xl text-gray-400 border-2 border-dashed border-gray-200"
            >
              <Image size={20} />
              <span className="text-xs mt-1">Agregar</span>
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFotoChange}
          />
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
      {children}
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
