'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  ChevronDown,
  KanbanSquare,
  List,
  Calendar
} from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Tarefas', 
    href: '/tasks', 
    icon: CheckSquare, 
    badge: 3,
    subItems: [
      { name: 'Kanban', href: '/tasks', icon: KanbanSquare },
      { name: 'Lista', href: '/tasks/list', icon: List },
      { name: 'Calendário', href: '/tasks/calendar', icon: Calendar },
    ]
  },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  const { sidebarCollapsed } = useUiStore();
  const pathname = usePathname();
  const [tasksOpen, setTasksOpen] = useState(true);

  return (
    <aside className={cn(
      "flex flex-col bg-gray-600 text-gray-400 transition-all duration-300 h-full relative",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-center border-b border-gray-500">
        {sidebarCollapsed ? (
          <div className="text-white font-bold text-xl">I</div>
        ) : (
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-xs">I</span>
            </div>
            Inova Com Valor
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href));
            return (
              <li key={item.name} className="px-2">
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
                    isActive ? "bg-gray-500 text-white" : "hover:bg-gray-500 hover:text-white"
                  )}
                  onClick={(e) => {
                    if (item.subItems && !sidebarCollapsed) {
                      e.preventDefault();
                      setTasksOpen(!tasksOpen);
                    }
                  }}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md" />}
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex-1 font-medium">{item.name}</span>
                  )}
                  {item.badge && !sidebarCollapsed && (
                    <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.subItems && !sidebarCollapsed && (
                    <ChevronDown className={cn("w-4 h-4 transition-transform", tasksOpen ? "rotate-180" : "")} />
                  )}
                  
                  {sidebarCollapsed && (
                    <div className="absolute left-14 bg-gray-600 text-white px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none z-50 text-sm whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>

                {item.subItems && tasksOpen && !sidebarCollapsed && isActive && (
                  <ul className="mt-1 space-y-1 pl-9 pr-2">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <li key={sub.name}>
                          <Link
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                              isSubActive ? "text-white bg-gray-500" : "hover:text-white hover:bg-gray-500"
                            )}
                          >
                            <sub.icon className="w-4 h-4 shrink-0" />
                            {sub.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-500 mt-auto">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-500 hover:text-white group relative"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!sidebarCollapsed && <span className="font-medium">Configurações</span>}
          {sidebarCollapsed && (
            <div className="absolute left-14 bg-gray-600 text-white px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none z-50 text-sm whitespace-nowrap">
              Configurações
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
