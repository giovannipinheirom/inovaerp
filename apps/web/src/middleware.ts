import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export function middleware(request: NextRequest) {
  // Renova sessão Supabase automaticamente
  const response = updateSession(request);

  // Rotas públicas (não precisam de autenticação)
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return response;
  }

  // Para rotas protegidas, verificar se há token de autenticação
  // O auth-store do Zustand persiste no localStorage (client-side),
  // então a proteção real é feita no layout do dashboard
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
