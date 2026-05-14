import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusCircle, Trash2, MapPin, Loader2 } from 'lucide-react'
import type { Electrolinera, ConectorTipo, ServicioAdicional } from '../../types'
import { CONECTOR_LABELS, SERVICIO_LABELS } from '../../types'
import { cn } from '../../utils/cn'

const schema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  empresa: z.string().min(1, 'Empresa requerida'),
  direccion: z.string().default(''),
  latitud: z.coerce.number({ invalid_type_error: 'Latitud inválida' }).min(-90).max(90),
  longitud: z.coerce.number({ invalid_type_error: 'Longitud inválida' }).min(-180).max(180),
  estado: z.enum(['en_servicio', 'fuera_de_servicio']),
  costo_kwh: z.coerce.number().optional(),
  total_cargadores: z.coerce.number().int().min(1),
  conectores: z.array(
    z.object({
      tipo: z.string(),
      cantidad: z.coerce.number().int().min(1),
      potencia_kw: z.coerce.number().optional(),
    }),
  ),
  horario_247: z.boolean(),
  hora_apertura: z.string().optional(),
  hora_cierre: z.string().optional(),
  servicios: z.array(z.string()),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  defaultValues?: Partial<Electrolinera>
  onSubmit: (values: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  submitLabel?: string
}

export function StationForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? '',
      empresa: defaultValues?.empresa ?? '',
      direccion: defaultValues?.direccion ?? '',
      latitud: defaultValues?.latitud,
      longitud: defaultValues?.longitud,
      estado: defaultValues?.estado ?? 'en_servicio',
      costo_kwh: defaultValues?.costo_kwh,
      total_cargadores: defaultValues?.total_cargadores ?? 1,
      conectores: defaultValues?.conectores ?? [],
      horario_247: defaultValues?.horario_247 ?? true,
      hora_apertura: defaultValues?.hora_apertura ?? '',
      hora_cierre: defaultValues?.hora_cierre ?? '',
      servicios: defaultValues?.servicios ?? [],
      notas: defaultValues?.notas ?? '',
    },
  })

  const { fields: conectoresFields, append: appendConector, remove: removeConector } =
    useFieldArray({ control, name: 'conectores' })

  const horario247 = watch('horario_247')
  const serviciosWatch = watch('servicios')

  const geolocate = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue('latitud', pos.coords.latitude)
        setValue('longitud', pos.coords.longitude)
        setLocating(false)
      },
      () => setLocating(false),
    )
  }

  const toggleServicio = (s: ServicioAdicional) => {
    const current = serviciosWatch as string[]
    const next = current.includes(s) ? current.filter((x) => x !== s) : [...current, s]
    setValue('servicios', next)
  }

  const submit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      await onSubmit({
        ...values,
        costo_kwh: values.costo_kwh,
        conectores: values.conectores as Electrolinera['conectores'],
        servicios: values.servicios as ServicioAdicional[],
        fotos: defaultValues?.fotos ?? [],
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5 pb-32">
      <Field label="Nombre de la electrolinera" error={errors.nombre?.message}>
        <input {...register('nombre')} placeholder="Ej: Electrolinera Laureles" className={inputCls} />
      </Field>

      <Field label="Empresa / operador" error={errors.empresa?.message}>
        <input {...register('empresa')} placeholder="Ej: EPM, Terpel, Enel" className={inputCls} />
      </Field>

      <Field label="Dirección" error={errors.direccion?.message}>
        <input {...register('direccion')} placeholder="Calle / carrera / barrio" className={inputCls} />
      </Field>

      {/* Ubicación */}
      <div>
        <label className={labelCls}>Ubicación GPS</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              {...register('latitud')}
              placeholder="Latitud"
              type="number"
              step="any"
              className={cn(inputCls, errors.latitud && 'border-red-400')}
            />
            {errors.latitud && <p className={errCls}>{errors.latitud.message}</p>}
          </div>
          <div>
            <input
              {...register('longitud')}
              placeholder="Longitud"
              type="number"
              step="any"
              className={cn(inputCls, errors.longitud && 'border-red-400')}
            />
            {errors.longitud && <p className={errCls}>{errors.longitud.message}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={geolocate}
          disabled={locating}
          className="mt-2 flex items-center gap-1.5 text-sm text-brand-600 font-medium"
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
          Usar mi ubicación actual
        </button>
      </div>

      <Field label="Estado">
        <select {...register('estado')} className={inputCls}>
          <option value="en_servicio">En servicio</option>
          <option value="fuera_de_servicio">Fuera de servicio</option>
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Costo por kWh ($COP)" error={errors.costo_kwh?.message}>
          <input {...register('costo_kwh')} type="number" min="0" step="any" placeholder="800" className={inputCls} />
        </Field>
        <Field label="Total cargadores" error={errors.total_cargadores?.message}>
          <input {...register('total_cargadores')} type="number" min="1" className={inputCls} />
        </Field>
      </div>

      {/* Conectores */}
      <div>
        <label className={labelCls}>Tipos de conector</label>
        <div className="space-y-2">
          {conectoresFields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
              <select {...register(`conectores.${i}.tipo`)} className={cn(inputCls, 'flex-1 text-sm')}>
                {(Object.keys(CONECTOR_LABELS) as ConectorTipo[]).map((t) => (
                  <option key={t} value={t}>{CONECTOR_LABELS[t]}</option>
                ))}
              </select>
              <input
                {...register(`conectores.${i}.cantidad`)}
                type="number"
                min="1"
                placeholder="Cant."
                className={cn(inputCls, 'w-16 text-sm')}
              />
              <input
                {...register(`conectores.${i}.potencia_kw`)}
                type="number"
                min="0"
                step="any"
                placeholder="kW"
                className={cn(inputCls, 'w-16 text-sm')}
              />
              <button type="button" onClick={() => removeConector(i)} className="text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendConector({ tipo: 'tipo2', cantidad: 1 })}
          className="mt-2 flex items-center gap-1.5 text-sm text-brand-600 font-medium"
        >
          <PlusCircle size={15} /> Agregar conector
        </button>
      </div>

      {/* Horario */}
      <div>
        <label className={labelCls}>Horario</label>
        <label className="flex items-center gap-2 text-sm">
          <input {...register('horario_247')} type="checkbox" className="accent-brand-500 w-4 h-4" />
          Disponible 24 / 7
        </label>
        {!horario247 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Field label="Apertura">
              <input {...register('hora_apertura')} type="time" className={inputCls} />
            </Field>
            <Field label="Cierre">
              <input {...register('hora_cierre')} type="time" className={inputCls} />
            </Field>
          </div>
        )}
      </div>

      {/* Servicios adicionales */}
      <div>
        <label className={labelCls}>Servicios adicionales</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SERVICIO_LABELS) as ServicioAdicional[]).map((s) => {
            const active = (serviciosWatch as string[]).includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleServicio(s)}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-full border transition-colors',
                  active
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-gray-600 border-gray-200',
                )}
              >
                {SERVICIO_LABELS[s]}
              </button>
            )
          })}
        </div>
      </div>

      <Field label="Notas personales">
        <textarea
          {...register('notas')}
          rows={3}
          placeholder="Observaciones, dificultades de acceso, etc."
          className={cn(inputCls, 'resize-none')}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting && <Loader2 size={18} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  )
}

const inputCls =
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

const errCls = 'text-xs text-red-500 mt-1'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className={errCls}>{error}</p>}
    </div>
  )
}
