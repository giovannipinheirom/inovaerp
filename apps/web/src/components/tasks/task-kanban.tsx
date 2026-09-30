'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { KanbanColumn } from './kanban-column';
import { Task, TaskCard } from './task-card';
import { arrayMove } from '@dnd-kit/sortable';

const COLUMNS = [
  { id: 'pendente', title: 'Pendente' },
  { id: 'andamento', title: 'Em Andamento' },
  { id: 'aguardando', title: 'Aguardando' },
  { id: 'revisao', title: 'Em Revisão' },
  { id: 'concluida', title: 'Concluída' },
];

interface TaskKanbanProps {
  initialTasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskKanban({ initialTasks, onTaskClick }: TaskKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    setTasks((prev) => {
      const activeIndex = prev.findIndex(t => t.id === activeId);
      const overIndex = prev.findIndex(t => t.id === overId);

      if (isOverTask) {
        const activeTask = prev[activeIndex];
        const overTask = prev[overIndex];

        if (activeTask.status !== overTask.status) {
          activeTask.status = overTask.status;
          return arrayMove(prev, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      }

      if (isOverColumn) {
        const activeTask = prev[activeIndex];
        activeTask.status = overId as string;
        return arrayMove(prev, activeIndex, activeIndex); 
      }

      return prev;
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-[calc(100vh-12rem)] overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <KanbanColumn 
            key={col.id} 
            id={col.id} 
            title={col.title} 
            tasks={tasks.filter(t => t.status === col.id)} 
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
