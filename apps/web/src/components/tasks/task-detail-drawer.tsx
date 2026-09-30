'use client';

import { X } from 'lucide-react';
import { Task } from './task-card';
import { Badge } from '@/components/ui/badge';

interface TaskDetailDrawerProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, onClose }: TaskDetailDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-600">Detalhes da Tarefa</h2>
            <Badge variant="default" className="uppercase">{task.status}</Badge>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-600 mb-2">{task.title}</h1>
            <p className="text-gray-500">{task.client}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-400 block mb-1">Responsável</span>
              <span className="font-medium text-gray-600">{task.assignee.name}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-400 block mb-1">Data Limite</span>
              <span className="font-medium text-gray-600">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-400 block mb-1">Prioridade</span>
              <Badge variant={task.priority === 'Alta' ? 'danger' : 'default'}>{task.priority}</Badge>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-400 block mb-1">Departamento</span>
              <span className="font-medium text-gray-600">{task.department}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-600 mb-4">Checklist</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-600">Verificar documentação pendente</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-600">Validar impostos calculados</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-600">Enviar para aprovação do cliente</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50" onClick={onClose}>
            Fechar
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
            Salvar Alterações
          </button>
        </div>

      </div>
    </div>
  );
}
