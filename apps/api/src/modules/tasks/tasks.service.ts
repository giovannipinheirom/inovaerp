import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { canTransition } from './task-state-machine';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async generateReadableCode(tenantId: string) {
    const date = new Date();
    const prefix = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const lastTask = await this.prisma.task.findFirst({
      where: { tenantId, readableCode: { startsWith: prefix } },
      orderBy: { readableCode: 'desc' },
    });

    let sequence = 1;
    if (lastTask && lastTask.readableCode) {
      const parts = lastTask.readableCode.split('-');
      if (parts.length === 3) {
        sequence = parseInt(parts[2], 10) + 1;
      }
    }
    
    return `${prefix}-${String(sequence).padStart(4, '0')}`;
  }

  async create(createTaskDto: CreateTaskDto, tenantId: string) {
    const readableCode = await this.generateReadableCode(tenantId);
    
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        tenantId,
        readableCode,
        status: 'draft',
      },
    });
  }

  async findAll(query: TaskQueryDto, tenantId: string) {
    const { status, priority, clientId, assigneeId, dueDateFrom, dueDateTo, competence, search, page = 1, limit = 10 } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { tenantId };
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (clientId) where.clientId = clientId;
    if (assigneeId) where.assignments = { some: { changedById: assigneeId } };
    if (competence) where.competence = competence;
    
    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) where.dueDate.gte = new Date(dueDateFrom);
      if (dueDateTo) where.dueDate.lte = new Date(dueDateTo);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { readableCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true } },
          assignments: { include: { user: { select: { id: true, profile: { select: { fullName: true } } } } } }
        }
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data, total, page: +page, limit: +limit };
  }

  async findOne(id: string, tenantId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId },
      include: {
        client: true,
        steps: true,
        assignments: { include: { user: { select: { id: true, profile: { select: { fullName: true } } } } } },
        comments: { include: { user: { select: { id: true, profile: { select: { fullName: true } } } } }, orderBy: { createdAt: 'asc' } },
        statusHistory: { orderBy: { changedAt: 'desc' } },
        attachments: true
      },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, tenantId: string) {
    const task = await this.findOne(id, tenantId);
    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto as any,
    });
  }

  async changeStatus(id: string, changeStatusDto: ChangeStatusDto, tenantId: string, changedById: string) {
    const task = await this.findOne(id, tenantId);
    const { status: newStatus, reason } = changeStatusDto as any;

    if (!canTransition(task.status, newStatus)) {
      throw new BadRequestException(`Transição de ${task.status} para ${newStatus} não permitida.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: { status: newStatus as any },
      });

      await tx.taskStatusHistory.create({
        data: {
          taskId: id,
          newStatus: newStatus as any, oldStatus: task.status as any,
          reason,
          changedById
        }
      });

      return updated;
    });
  }

  async assignUser(taskId: string, changedById: string, tenantId: string) {
    const task = await this.findOne(taskId, tenantId);
    return this.prisma.taskAssignment.create({
      data: { taskId: task.id, changedById }
    });
  }

  async addStep(taskId: string, stepDto: any, tenantId: string) {
    const task = await this.findOne(taskId, tenantId);
    return this.prisma.taskStep.create({
      data: { ...stepDto, taskId: task.id, completed: false }
    });
  }

  async completeStep(taskId: string, stepId: string, tenantId: string) {
    await this.findOne(taskId, tenantId);
    return this.prisma.taskStep.update({
      where: { id: stepId },
      data: { status: 'completed' }
    });
  }

  async addComment(taskId: string, createCommentDto: CreateCommentDto, tenantId: string, changedById: string) {
    const task = await this.findOne(taskId, tenantId);
    return this.prisma.taskComment.create({
      data: {
        text: createCommentDto.content,
        taskId: task.id,
        changedById
      }
    });
  }

  async getDashboardMetrics(tenantId: string) {
    const counts = await this.prisma.task.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    });

    const overdueCount = await this.prisma.task.count({
      where: { 
        tenantId,
        status: { notIn: ['completed', 'cancelled'] },
        dueDateInternal: { lt: new Date() }
      }
    });

    const totalCompleted = await this.prisma.task.count({
      where: { tenantId, status: 'completed' }
    });

    const slaCompliant = await this.prisma.task.count({
      where: { 
        tenantId, 
        status: 'completed',
      }
    });

    return {
      statusCounts: counts.map(c => ({ status: c.status, count: c._count.id })),
      overdueCount,
      slaPercentage: totalCompleted > 0 ? (slaCompliant / totalCompleted) * 100 : 100
    };
  }

  async batchUpdateStatus(taskIds: string[], status: string, tenantId: string, changedById: string) {
    for (const taskId of taskIds) {
      await this.changeStatus(taskId, { status }, tenantId, changedById).catch(e => console.error(e));
    }
    return { success: true };
  }
}
