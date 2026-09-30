'use client';

import { useState } from 'react';
import { TaskKanban } from '@/components/tasks/task-kanban';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDetailDrawer } from '@/components/tasks/task-detail-drawer';
import { Task } from '@/components/tasks/task-card';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Revisão Fiscal Q3', client: 'Empresa Alpha Ltda', status: 'pendente', dueDate: '2026-10-05T00:00:00Z', assignee: { name: 'João Silva' }, priority: 'Alta', department: 'Fiscal' },
  { id: '2', title: 'Fechamento de Folha', client: 'Tech Solutions SA', status: 'andamento', dueDate: '2026-09-30T00:00:00Z', assignee: { name: 'Maria Souza' }, priority: 'Alta', department: 'DP' },
  { id: '3', title: 'Declaração IR', client: 'Carlos Alberto', status: 'aguardando', dueDate: '2026-10-10T00:00:00Z', assignee: { name: 'João Silva' }, priority: 'Média', department: 'Contábil' },
  { id: '4', title: 'Auditoria Interna', client: 'Comércio Beta', status: 'revisao', dueDate: '2026-09-28T00:00:00Z', assignee: { name: 'Ana Costa' }, priority: 'Baixa', department: 'Auditoria' },
  { id: '5', title: 'Abertura de Empresa', client: 'Nova Startup', status: 'concluida', dueDate: '2026-09-15T00:00:00Z', assignee: { name: 'Pedro Alves' }, priority: 'Média', department: 'Paralegal' },
];

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-bold text-gray-600">Quadro de Tarefas</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex gap-4 shrink-0 bg-white p-3 rounded-lg border border-gray-200">
        <select className="text-sm border-gray-300 rounded-md bg-transparent p-1.5">
          <option>Todos os Clientes</option>
        </select>
        <select className="text-sm border-gray-300 rounded-md bg-transparent p-1.5">
          <option>Todos os Responsáveis</option>
        </select>
        <select className="text-sm border-gray-300 rounded-md bg-transparent p-1.5">
          <option>Todos os Departamentos</option>
        </select>
      </div>

      <div className="flex-1 overflow-hidden">
        <TaskKanban initialTasks={MOCK_TASKS} onTaskClick={setSelectedTask} />
      </div>

      {selectedTask && (
        <TaskDetailDrawer 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}
