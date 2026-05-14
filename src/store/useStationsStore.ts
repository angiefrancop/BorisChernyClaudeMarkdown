import { create } from 'zustand'
import type { Electrolinera, FiltrosElectrolinera } from '../types'
import {
  fetchElectrolineras,
  createElectrolinera,
  updateElectrolinera,
  deleteElectrolinera,
  uploadFoto,
} from '../services/stations'

interface StationsStore {
  items: Electrolinera[]
  loading: boolean
  error: string | null
  filtros: FiltrosElectrolinera
  selectedId: string | null

  load: () => Promise<void>
  add: (payload: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  update: (id: string, payload: Omit<Electrolinera, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  remove: (id: string) => Promise<void>
  addFoto: (id: string, file: File) => Promise<string>
  setFiltros: (f: Partial<FiltrosElectrolinera>) => void
  setSelectedId: (id: string | null) => void
}

export const useStationsStore = create<StationsStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  filtros: { empresa: '', estado: '', conector: '' },
  selectedId: null,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const items = await fetchElectrolineras()
      set({ items, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  add: async (payload) => {
    const item = await createElectrolinera(payload)
    set((s) => ({ items: [item, ...s.items] }))
  },

  update: async (id, payload) => {
    const updated = await updateElectrolinera(id, payload)
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }))
  },

  remove: async (id) => {
    await deleteElectrolinera(id)
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
  },

  addFoto: async (id, file) => {
    const url = await uploadFoto(id, file)
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id ? { ...i, fotos: [...i.fotos, url] } : i,
      ),
    }))
    return url
  },

  setFiltros: (f) => set((s) => ({ filtros: { ...s.filtros, ...f } })),

  setSelectedId: (id) => set({ selectedId: id }),
}))

export function useFilteredStations() {
  const { items, filtros } = useStationsStore()
  return items.filter((s) => {
    if (filtros.empresa && !s.empresa.toLowerCase().includes(filtros.empresa.toLowerCase()))
      return false
    if (filtros.estado && s.estado !== filtros.estado) return false
    if (filtros.conector && !s.conectores.some((c) => c.tipo === filtros.conector))
      return false
    return true
  })
}
