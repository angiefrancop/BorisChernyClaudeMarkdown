import { X } from 'lucide-react'
import type { ConectorTipo } from '../../types'
import { CONECTOR_LABELS } from '../../types'
import { useStationsStore } from '../../store/useStationsStore'

interface Props {
  onClose: () => void
}

export function FilterPanel({ onClose }: Props) {
  const { filtros, setFiltros, items } = useStationsStore()

  const empresas = [...new Set(items.map((i) => i.empresa))].sort()

  const reset = () =>
    setFiltros({ empresa: '', estado: '', conector: '' })

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl px-5 pt-4 pb-8 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Filtros</h2>
        <div className="flex gap-3">
          <button onClick={reset} className="text-sm text-brand-600 font-medium">
            Limpiar
          </button>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>
      </div>

      <section className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Estado</p>
        <div className="flex gap-2">
          {[
            { value: '', label: 'Todos' },
            { value: 'en_servicio', label: 'En servicio' },
            { value: 'fuera_de_servicio', label: 'Fuera de servicio' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFiltros({ estado: opt.value as typeof filtros.estado })}
              className={chip(filtros.estado === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tipo de conector</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltros({ conector: '' })}
            className={chip(filtros.conector === '')}
          >
            Todos
          </button>
          {(Object.keys(CONECTOR_LABELS) as ConectorTipo[]).map((t) => (
            <button
              key={t}
              onClick={() => setFiltros({ conector: t })}
              className={chip(filtros.conector === t)}
            >
              {CONECTOR_LABELS[t]}
            </button>
          ))}
        </div>
      </section>

      {empresas.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Empresa</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltros({ empresa: '' })}
              className={chip(filtros.empresa === '')}
            >
              Todas
            </button>
            {empresas.map((e) => (
              <button
                key={e}
                onClick={() => setFiltros({ empresa: e })}
                className={chip(filtros.empresa === e)}
              >
                {e}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

const chip = (active: boolean) =>
  `text-sm px-3 py-1.5 rounded-full border transition-colors ${
    active
      ? 'bg-brand-500 text-white border-brand-500'
      : 'bg-white text-gray-600 border-gray-200'
  }`
