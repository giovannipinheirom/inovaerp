'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface ClientFormProps {
  onClose: () => void;
}

export function ClientForm({ onClose }: ClientFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-600">Novo Cliente</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Input label="Razão Social" placeholder="Empresa Exemplo Ltda" required />
          <Input label="Nome Fantasia" placeholder="Exemplo Soluções" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="CNPJ" placeholder="00.000.000/0001-00" required />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-gray-600">Regime Tributário</label>
              <select className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                <option>Simples Nacional</option>
                <option>Lucro Presumido</option>
                <option>Lucro Real</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefone" placeholder="(00) 0000-0000" />
            <Input label="E-mail de Contato" type="email" placeholder="contato@exemplo.com" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button>Salvar Cliente</Button>
        </div>
      </div>
    </div>
  );
}
