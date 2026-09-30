'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  const translatePath = (path: string) => {
    const dict: Record<string, string> = {
      dashboard: 'Dashboard',
      tasks: 'Tarefas',
      list: 'Lista',
      clients: 'Clientes',
      reports: 'Relatórios',
      settings: 'Configurações'
    };
    return dict[path] || path;
  };

  return (
    <div className="hidden sm:flex items-center text-sm text-gray-500">
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;

        return (
          <div key={path} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />}
            {isLast ? (
              <span className="font-medium text-gray-600">{translatePath(path)}</span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors">
                {translatePath(path)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
