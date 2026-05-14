import { NavLink } from 'react-router-dom'
import { Map, List, PlusCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

const links = [
  { to: '/',     label: 'Mapa',    Icon: Map },
  { to: '/list', label: 'Lista',   Icon: List },
  { to: '/add',  label: 'Agregar', Icon: PlusCircle },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex safe-bottom">
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-brand-600' : 'text-gray-400',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
