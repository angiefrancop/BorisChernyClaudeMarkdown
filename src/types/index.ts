export type ConectorTipo =
  | 'tipo1'       // J1772 AC
  | 'tipo2'       // Mennekes AC
  | 'ccs1'        // Combo 1 DC
  | 'ccs2'        // Combo 2 DC
  | 'chademo'     // CHAdeMO DC
  | 'gbt'         // GB/T DC (BYD, JAC, Changan)
  | 'tesla_nacs'  // Tesla / NACS

export type ServicioAdicional =
  | 'wifi'
  | 'lavadero'
  | 'tienda'
  | 'cafe'
  | 'restaurante'
  | 'bano'
  | 'estacionamiento_techado'
  | 'hotel'
  | 'gimnasio'

export type EstadoElectrolinera = 'en_servicio' | 'fuera_de_servicio'

export interface Conector {
  tipo: ConectorTipo
  cantidad: number
  potencia_kw?: number
}

export interface Electrolinera {
  id: string
  nombre: string
  empresa: string
  direccion: string
  latitud: number
  longitud: number
  estado: EstadoElectrolinera
  costo_kwh?: number
  total_cargadores: number
  conectores: Conector[]
  horario_247: boolean
  hora_apertura?: string
  hora_cierre?: string
  servicios: ServicioAdicional[]
  notas?: string
  fotos: string[]
  created_at: string
  updated_at: string
}

export interface FiltrosElectrolinera {
  empresa?: string
  estado?: EstadoElectrolinera | ''
  conector?: ConectorTipo | ''
}

export const CONECTOR_LABELS: Record<ConectorTipo, string> = {
  tipo1:      'Tipo 1 (J1772)',
  tipo2:      'Tipo 2 (Mennekes)',
  ccs1:       'CCS1 (Combo 1)',
  ccs2:       'CCS2 (Combo 2)',
  chademo:    'CHAdeMO',
  gbt:        'GB/T',
  tesla_nacs: 'Tesla / NACS',
}

export const SERVICIO_LABELS: Record<ServicioAdicional, string> = {
  wifi:                    'WiFi',
  lavadero:                'Lavadero de autos',
  tienda:                  'Tienda / Supermercado',
  cafe:                    'Café',
  restaurante:             'Restaurante',
  bano:                    'Baño',
  estacionamiento_techado: 'Parqueadero techado',
  hotel:                   'Hotel',
  gimnasio:                'Gimnasio',
}
