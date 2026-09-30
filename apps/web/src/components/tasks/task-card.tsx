'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import { isBefore, isToday, parseISO } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  client: string;
  status: string;
  dueDate: string;
  assignee: { name: string; avatar?: string };
  priority: 'Baixa' | 'Média' | 'Alta';
  department: string;
}

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const date = parseISO(task.dueDate);
  let dateColor = 'text-gray-500';
  if (isBefore(date, new Date()) && !isToday(date)) dateColor = 'text-danger font-semibold';
  else if (isToday(date)) dateColor = 'text-warning font-semibold';
  else dateColor = 'text-success font-semibold';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onClick?.(task)} className="touch-none">
      <Card className="cursor-grab active:cursor-grabbing hover:border-primary transition-colors mb-3">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-semibold text-sm leading-tight text-gray-600 line-clamp-2">{task.title}</h4>
            <Badge variant={task.priority === 'Alta' ? 'danger' : task.priority === 'Média' ? 'warning' : 'default'} className="shrink-0 text-[10px] px-1.5 py-0">
              {task.priority}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-400 font-medium truncate">{task.client}</p>
          
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className={dateColor}>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
          </div>

          <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">{task.department}</span>
            <Avatar fallback={task.assignee.name[0]} src={task.assignee.avatar} className="w-6 h-6 text-[10px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
