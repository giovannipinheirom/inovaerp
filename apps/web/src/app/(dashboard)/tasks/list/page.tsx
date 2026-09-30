'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Task } from '@/components/tasks/task-card';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Revisão Fiscal Q3', client: 'Empresa Alpha Ltda', status: 'pendente', dueDate: '2026-10-05T00:00:00Z', assignee: { name: 'João Silva' }, priority: 'Alta', department: 'Fiscal' },
  { id: '2', title: 'Fechamento de Folha', client: 'Tech Solutions SA', status: 'andamento', dueDate: '2026-09-30T00:00:00Z', assignee: { name: 'Maria Souza' }, priority: 'Alta', department: 'DP' },
  { id: '3', title: 'Declaração IR', client: 'Carlos Alberto', status: 'aguardando', dueDate: '2026-10-10T00:00:00Z', assignee: { name: 'João Silva' }, priority: 'Média', department: 'Contábil' },
  { id: '4', title: 'Auditoria Interna', client: 'Comércio Beta', status: 'revisao', dueDate: '2026-09-28T00:00:00Z', assignee: { name: 'Ana Costa' }, priority: 'Baixa', department: 'Auditoria' },
  { id: '5', title: 'Abertura de Empresa', client: 'Nova Startup', status: 'concluida', dueDate: '2026-09-15T00:00:00Z', assignee: { name: 'Pedro Alves' }, priority: 'Média', department: 'Paralegal' },
];

export default function TasksListPage() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedTasks.length === MOCK_TASKS.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(MOCK_TASKS.map(t => t.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-600">Lista de Tarefas</h1>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {selectedTasks.length > 0 && (
        <div className="bg-primary-light text-primary px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="font-medium">{selectedTasks.length} tarefas selecionadas</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Mudar Status</Button>
            <Button variant="secondary" size="sm">Atribuir</Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="rounded border-gray-300" checked={selectedTasks.length === MOCK_TASKS.length} onChange={toggleAll} />
                </th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Prioridade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {MOCK_TASKS.map((task, index) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" checked={selectedTasks.includes(task.id)} onChange={() => toggleSelect(task.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" className="uppercase text-[10px]">{task.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">#{1000 + index}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{task.title}</td>
                  <td className="px-4 py-3 text-gray-500">{task.client}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Avatar fallback={task.assignee.name[0]} className="w-6 h-6" />
                    <span className="text-gray-600">{task.assignee.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3">
                    <Badge variant={task.priority === 'Alta' ? 'danger' : task.priority === 'Média' ? 'warning' : 'default'} className="text-[10px]">
                      {task.priority}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
