import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('dashboard/metrics')
  getDashboardMetrics(@CurrentUser() user: any) {
    return this.tasksService.getDashboardMetrics(user.tenantId);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.tenantId);
  }

  @Get()
  findAll(@Query() query: TaskQueryDto, @CurrentUser() user: any) {
    return this.tasksService.findAll(query, user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.update(id, updateTaskDto, user.tenantId);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body() changeStatusDto: ChangeStatusDto, @CurrentUser() user: any) {
    return this.tasksService.changeStatus(id, changeStatusDto, user.tenantId, user.userId);
  }

  @Post(':id/assign')
  assignUser(@Param('id') id: string, @Body('userId') targetUserId: string, @CurrentUser() user: any) {
    return this.tasksService.assignUser(id, targetUserId, user.tenantId);
  }

  @Post(':id/steps')
  addStep(@Param('id') id: string, @Body() stepDto: any, @CurrentUser() user: any) {
    return this.tasksService.addStep(id, stepDto, user.tenantId);
  }

  @Patch(':id/steps/:stepId/complete')
  completeStep(@Param('id') id: string, @Param('stepId') stepId: string, @CurrentUser() user: any) {
    return this.tasksService.completeStep(id, stepId, user.tenantId);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
    return this.tasksService.addComment(id, createCommentDto, user.tenantId, user.userId);
  }
  
  @Patch('batch/status')
  batchUpdateStatus(@Body() body: { taskIds: string[], status: string }, @CurrentUser() user: any) {
    return this.tasksService.batchUpdateStatus(body.taskIds, body.status, user.tenantId, user.userId);
  }
}
