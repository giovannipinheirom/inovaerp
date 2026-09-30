'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Client, ClientCard } from '@/components/clients/client-card';
import { ClientForm } from '@/components/clients/client-form';

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Tech Solutions SA', cnpj: '12.345.678/0001-90', regime: 'Lucro Presumido', status: 'Ativo', pendingTasks: 5 },
  { id: '2', name: 'Empresa Alpha Ltda', cnpj: '98.765.432/0001-10', regime: 'Simples Nacional', status: 'Ativo', pendingTasks: 2 },
  { id: '3', name: 'Comércio Beta', cnpj: '45.678.901/0001-23', regime: 'Lucro Real', status: 'Ativo', pendingTasks: 8 },
  { id: '4', name: 'Nova Startup', cnpj: '23.456.789/0001-34', regime: 'Simples Nacional', status: 'Ativo', pendingTasks: 1 },
  { id: '5', name: 'Consultoria Zeta', cnpj: '87.654.321/0001-45', regime: 'Simples Nacional', status: 'Inativo', pendingTasks: 0 },
];

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-600">Clientes</h1>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CNPJ..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-md text-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="text-sm border border-gray-200 rounded-md bg-gray-50 px-3 py-2">
            <option>Todos os Regimes</option>
            <option>Simples Nacional</option>
            <option>Lucro Presumido</option>
            <option>Lucro Real</option>
          </select>
          <select className="text-sm border border-gray-200 rounded-md bg-gray-50 px-3 py-2">
            <option>Todos os Status</option>
            <option>Ativos</option>
            <option>Inativos</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_CLIENTS.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {isFormOpen && <ClientForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
