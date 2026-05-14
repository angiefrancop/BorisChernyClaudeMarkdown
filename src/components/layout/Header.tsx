import { Zap } from 'lucide-react'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3 shadow-sm">
      <Zap className="text-brand-500" size={22} fill="currentColor" />
      <span className="font-semibold text-gray-900 text-base leading-tight">
        Electrolineras
        <span className="block text-xs font-normal text-gray-500">Valle de Aburrá</span>
      </span>
    </header>
  )
}
