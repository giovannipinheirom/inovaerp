'use client';

import { Menu, Search, Bell } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from './breadcrumb';

export function Topbar() {
  const { toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumb />
      </div>

      <div className="flex-1 max-w-md hidden md:flex items-center">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-9 pr-12 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-md text-sm transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-white px-1.5 py-0.5 rounded border border-gray-200">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 relative group cursor-pointer">
          <Avatar fallback={user?.name?.[0] || 'U'} />
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-gray-600">{user?.name || 'Usuário'}</p>
          </div>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-gray-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
