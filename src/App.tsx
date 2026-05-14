import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { BottomNav } from './components/layout/BottomNav'
import { MapPage } from './pages/MapPage'
import { ListPage } from './pages/ListPage'
import { AddPage, EditPage } from './pages/AddEditPage'
import { StationDetailPage } from './pages/StationDetailPage'
import { useStationsStore } from './store/useStationsStore'
import { supabaseConfigured } from './lib/supabase'

export default function App() {
  const load = useStationsStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {!supabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center">
          Modo local — los datos se guardan en este dispositivo.{' '}
          <a href="#setup" className="underline font-medium">
            Configura Supabase
          </a>{' '}
          para sincronizar en la nube.
        </div>
      )}
      <Header />
      <main className="flex-1 overflow-hidden mt-14">
        <Routes>
          <Route path="/"              element={<MapPage />} />
          <Route path="/list"          element={<ListPage />} />
          <Route path="/add"           element={<AddPage />} />
          <Route path="/edit/:id"      element={<EditPage />} />
          <Route path="/station/:id"   element={<StationDetailPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
