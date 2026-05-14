import { supabase, supabaseConfigured } from '../lib/supabase'
import type { Electrolinera } from '../types'

const LOCAL_KEY = 'electrolineras_data'

function loadLocal(): Electrolinera[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as Electrolinera[]) : []
  } catch {
    return []
  }
}

function saveLocal(items: Electrolinera[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
}

export async function fetchElectrolineras(): Promise<Electrolinera[]> {
  if (!supabaseConfigured || !supabase) return loadLocal()

  const { data, error } = await supabase
    .from('electrolineras')
    .select('*, conectores(*), fotos(*), servicios_adicionales(*)')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map(mapFromSupabase)
}

export async function createElectrolinera(
  payload: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>,
): Promise<Electrolinera> {
  if (!supabaseConfigured || !supabase) {
    const newItem: Electrolinera = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const items = loadLocal()
    saveLocal([newItem, ...items])
    return newItem
  }

  const { conectores, servicios, fotos, ...rest } = payload

  const { data: station, error } = await supabase
    .from('electrolineras')
    .insert(rest)
    .select()
    .single()

  if (error) throw error

  await Promise.all([
    conectores.length
      ? supabase
          .from('conectores')
          .insert(conectores.map((c) => ({ ...c, electrolinera_id: station.id })))
      : Promise.resolve(),
    servicios.length
      ? supabase
          .from('servicios_adicionales')
          .insert(servicios.map((s) => ({ servicio: s, electrolinera_id: station.id })))
      : Promise.resolve(),
  ])

  return mapFromSupabase({ ...station, conectores, servicios_adicionales: servicios.map((s) => ({ servicio: s })), fotos: [] })
}

export async function updateElectrolinera(
  id: string,
  payload: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>,
): Promise<Electrolinera> {
  if (!supabaseConfigured || !supabase) {
    const items = loadLocal()
    const updated: Electrolinera = {
      ...payload,
      id,
      created_at: items.find((i) => i.id === id)?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    saveLocal(items.map((i) => (i.id === id ? updated : i)))
    return updated
  }

  const { conectores, servicios, fotos: _fotos, ...rest } = payload

  const { data: station, error } = await supabase
    .from('electrolineras')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await Promise.all([
    supabase.from('conectores').delete().eq('electrolinera_id', id),
    supabase.from('servicios_adicionales').delete().eq('electrolinera_id', id),
  ])

  await Promise.all([
    conectores.length
      ? supabase
          .from('conectores')
          .insert(conectores.map((c) => ({ ...c, electrolinera_id: id })))
      : Promise.resolve(),
    servicios.length
      ? supabase
          .from('servicios_adicionales')
          .insert(servicios.map((s) => ({ servicio: s, electrolinera_id: id })))
      : Promise.resolve(),
  ])

  return mapFromSupabase({ ...station, conectores, servicios_adicionales: servicios.map((s) => ({ servicio: s })), fotos: [] })
}

export async function deleteElectrolinera(id: string): Promise<void> {
  if (!supabaseConfigured || !supabase) {
    saveLocal(loadLocal().filter((i) => i.id !== id))
    return
  }
  const { error } = await supabase.from('electrolineras').delete().eq('id', id)
  if (error) throw error
}

export async function uploadFoto(
  electrolineraId: string,
  file: File,
): Promise<string> {
  if (!supabaseConfigured || !supabase) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const items = loadLocal()
        const updated = items.map((i) =>
          i.id === electrolineraId ? { ...i, fotos: [...i.fotos, dataUrl] } : i,
        )
        saveLocal(updated)
        resolve(dataUrl)
      }
      reader.readAsDataURL(file)
    })
  }

  const ext = file.name.split('.').pop()
  const path = `${electrolineraId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('electrolineras-fotos')
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('electrolineras-fotos')
    .getPublicUrl(path)

  await supabase
    .from('fotos')
    .insert({ electrolinera_id: electrolineraId, url: data.publicUrl })

  return data.publicUrl
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFromSupabase(row: any): Electrolinera {
  return {
    id: row.id,
    nombre: row.nombre,
    empresa: row.empresa,
    direccion: row.direccion ?? '',
    latitud: row.latitud,
    longitud: row.longitud,
    estado: row.estado,
    costo_kwh: row.costo_kwh,
    total_cargadores: row.total_cargadores,
    horario_247: row.horario_247,
    hora_apertura: row.hora_apertura,
    hora_cierre: row.hora_cierre,
    notas: row.notas,
    conectores: (row.conectores ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => ({ tipo: c.tipo, cantidad: c.cantidad, potencia_kw: c.potencia_kw }),
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    servicios: (row.servicios_adicionales ?? []).map((s: any) => s.servicio),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fotos: (row.fotos ?? []).map((f: any) => (typeof f === 'string' ? f : f.url)),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}
