const fs = require('fs');
const path = require('path');

const root = path.join('C:', 'Users', 'gmedeiros', '.gemini', 'antigravity', 'scratch', 'inova-erp', 'apps', 'api');

const files = {
  'package.json': `{
  "name": "@inova/api",
  "version": "1.0.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:seed": "prisma db seed"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@prisma/client": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.13",
    "prisma": "^5.0.0",
    "typescript": "^5.1.3"
  }
}
`,
  'tsconfig.json': `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
`,
  'tsconfig.build.json': `{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
`,
  'nest-cli.json': `{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
`,
  'src/main.ts': `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3001);
}
bootstrap();
`,
  'src/app.module.ts': `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
`,
  'src/prisma/prisma.module.ts': `import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
`,
  'src/prisma/prisma.service.ts': `import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
`,
  'src/modules/auth/auth.module.ts': `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'super-secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
`,
  'src/modules/auth/auth.controller.ts': `import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refresh(@CurrentUser() user: any) {
    return this.authService.refreshToken(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
`,
  'src/modules/auth/auth.service.ts': `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { email: user.email, sub: user.id, tenantId: user.tenantId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const hash = await bcrypt.hash(registerDto.password, 10);
    
    const tenant = await this.prisma.tenant.create({
      data: {
        name: registerDto.companyName,
        document: registerDto.companyCnpj,
        users: {
          create: {
            email: registerDto.email,
            passwordHash: hash,
            fullName: registerDto.fullName,
            role: 'ADMIN',
          }
        },
        departments: {
          create: [
            { name: 'Contábil' },
            { name: 'Fiscal' },
            { name: 'Pessoal' },
            { name: 'Legalização' }
          ]
        }
      },
      include: {
        users: true
      }
    });

    const user = tenant.users[0];
    const { passwordHash, ...result } = user;
    return result;
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.userId || user.sub, tenantId: user.tenantId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
`,
  'src/modules/auth/dto/login.dto.ts': `import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;
}
`,
  'src/modules/auth/dto/register.dto.ts': `import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  fullName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  companyName!: string;

  @IsString()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  companyCnpj!: string;
}
`,
  'src/modules/auth/strategies/jwt.strategy.ts': `import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'super-secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, tenantId: payload.tenantId, role: payload.role };
  }
}
`,
  'src/modules/auth/guards/jwt-auth.guard.ts': `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`,
  'src/modules/auth/guards/roles.guard.ts': `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
`,
  'src/modules/auth/decorators/roles.decorator.ts': `import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
`,
  'src/modules/auth/decorators/current-user.decorator.ts': `import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
`,
  'src/modules/clients/clients.module.ts': `import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
`,
  'src/modules/clients/clients.controller.ts': `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClientQueryDto } from './dto/client-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto, @CurrentUser() user: any) {
    return this.clientsService.create(createClientDto, user.tenantId);
  }

  @Get()
  findAll(@Query() query: ClientQueryDto, @CurrentUser() user: any) {
    return this.clientsService.findAll(query, user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clientsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto, @CurrentUser() user: any) {
    return this.clientsService.update(id, updateClientDto, user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clientsService.remove(id, user.tenantId);
  }
  
  @Post(':id/contacts')
  addContact(@Param('id') id: string, @Body() contactDto: any, @CurrentUser() user: any) {
    return this.clientsService.addContact(id, contactDto, user.tenantId);
  }

  @Patch(':id/contacts/:contactId')
  updateContact(@Param('id') id: string, @Param('contactId') contactId: string, @Body() contactDto: any, @CurrentUser() user: any) {
    return this.clientsService.updateContact(id, contactId, contactDto, user.tenantId);
  }

  @Delete(':id/contacts/:contactId')
  removeContact(@Param('id') id: string, @Param('contactId') contactId: string, @CurrentUser() user: any) {
    return this.clientsService.removeContact(id, contactId, user.tenantId);
  }
}
`,
  'src/modules/clients/clients.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, tenantId: string) {
    return this.prisma.client.create({
      data: {
        ...createClientDto,
        tenantId,
      },
    });
  }

  async findAll(query: ClientQueryDto, tenantId: string) {
    const { search, taxRegime, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    
    if (status) {
      where.status = status;
    }
    
    if (taxRegime) {
      where.taxRegime = taxRegime;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { document: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: +limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return { data, total, page: +page, limit: +limit };
  }

  async findOne(id: string, tenantId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, tenantId },
      include: { contacts: true },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, tenantId: string) {
    const client = await this.findOne(id, tenantId);
    return this.prisma.client.update({
      where: { id: client.id },
      data: updateClientDto,
    });
  }

  async remove(id: string, tenantId: string) {
    const client = await this.findOne(id, tenantId);
    return this.prisma.client.update({
      where: { id: client.id },
      data: { status: 'INACTIVE' },
    });
  }
  
  async addContact(clientId: string, contactDto: any, tenantId: string) {
    const client = await this.findOne(clientId, tenantId);
    return this.prisma.contact.create({
      data: {
        ...contactDto,
        clientId: client.id,
      }
    });
  }

  async updateContact(clientId: string, contactId: string, contactDto: any, tenantId: string) {
    await this.findOne(clientId, tenantId);
    return this.prisma.contact.update({
      where: { id: contactId },
      data: contactDto,
    });
  }

  async removeContact(clientId: string, contactId: string, tenantId: string) {
    await this.findOne(clientId, tenantId);
    return this.prisma.contact.delete({
      where: { id: contactId },
    });
  }
}
`,
  'src/modules/clients/dto/create-client.dto.ts': `import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'CNPJ/CPF é obrigatório' })
  @Matches(/^\\d{11,14}$/, { message: 'Documento inválido' })
  document!: string;

  @IsOptional()
  @IsString()
  taxRegime?: string;

  @IsOptional()
  @IsString()
  tradeName?: string;

  @IsOptional()
  @IsString()
  ibgeCode?: string;
}
`,
  'src/modules/clients/dto/update-client.dto.ts': `import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  status?: string;
}
`,
  'src/modules/clients/dto/client-query.dto.ts': `import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class ClientQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  taxRegime?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
`,
  'src/modules/tasks/tasks.module.ts': `import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
`,
  'src/modules/tasks/tasks.controller.ts': `import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
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
`,
  'src/modules/tasks/tasks.service.ts': `import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    const prefix = \`INV-\${date.getFullYear()}\${String(date.getMonth() + 1).padStart(2, '0')}\`;
    
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
    
    return \`\${prefix}-\${String(sequence).padStart(4, '0')}\`;
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
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (clientId) where.clientId = clientId;
    if (assigneeId) where.assignments = { some: { userId: assigneeId } };
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
        take: +limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true } },
          assignments: { include: { user: { select: { id: true, fullName: true } } } }
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
        assignments: { include: { user: { select: { id: true, fullName: true } } } },
        comments: { include: { author: { select: { id: true, fullName: true } } }, orderBy: { createdAt: 'asc' } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
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
      data: updateTaskDto,
    });
  }

  async changeStatus(id: string, changeStatusDto: ChangeStatusDto, tenantId: string, userId: string) {
    const task = await this.findOne(id, tenantId);
    const { status: newStatus, reason } = changeStatusDto;

    if (!canTransition(task.status, newStatus)) {
      throw new BadRequestException(\`Transição de \${task.status} para \${newStatus} não permitida.\`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: { status: newStatus },
      });

      await tx.taskStatusHistory.create({
        data: {
          taskId: id,
          status: newStatus,
          reason,
          userId
        }
      });

      return updated;
    });
  }

  async assignUser(taskId: string, userId: string, tenantId: string) {
    const task = await this.findOne(taskId, tenantId);
    return this.prisma.taskAssignment.create({
      data: { taskId: task.id, userId }
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
      data: { completed: true, completedAt: new Date() }
    });
  }

  async addComment(taskId: string, createCommentDto: CreateCommentDto, tenantId: string, authorId: string) {
    const task = await this.findOne(taskId, tenantId);
    return this.prisma.taskComment.create({
      data: {
        content: createCommentDto.content,
        taskId: task.id,
        authorId
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
        dueDate: { lt: new Date() }
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

  async batchUpdateStatus(taskIds: string[], status: string, tenantId: string, userId: string) {
    for (const taskId of taskIds) {
      await this.changeStatus(taskId, { status }, tenantId, userId).catch(e => console.error(e));
    }
    return { success: true };
  }
}
`,
  'src/modules/tasks/dto/create-task.dto.ts': `import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  competence?: string;
}
`,
  'src/modules/tasks/dto/update-task.dto.ts': `import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
`,
  'src/modules/tasks/dto/change-status.dto.ts': `import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChangeStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
`,
  'src/modules/tasks/dto/task-query.dto.ts': `import { IsOptional, IsString, IsNumberString, IsDateString } from 'class-validator';

export class TaskQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @IsOptional()
  @IsString()
  competence?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
`,
  'src/modules/tasks/dto/create-comment.dto.ts': `import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Conteúdo do comentário é obrigatório' })
  content!: string;
}
`,
  'src/modules/tasks/task-state-machine.ts': `export type TaskStatus = 'draft' | 'pending' | 'in_progress' | 'waiting' | 'in_review' | 'completed' | 'cancelled';

const transitions: Record<string, TaskStatus[]> = {
  'draft': ['pending'],
  'pending': ['in_progress', 'cancelled'],
  'in_progress': ['waiting', 'in_review', 'completed', 'cancelled'],
  'waiting': ['in_progress', 'cancelled'],
  'in_review': ['in_progress', 'completed'],
  'completed': [],
  'cancelled': []
};

export function getAvailableTransitions(from: string): TaskStatus[] {
  return transitions[from] || [];
}

export function canTransition(from: string, to: string): boolean {
  const available = getAvailableTransitions(from);
  return available.includes(to as TaskStatus);
}
`,
  'src/modules/users/users.module.ts': `import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
`,
  'src/modules/users/users.controller.ts': `import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.usersService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.usersService.update(id, updateData, user.tenantId);
  }
}
`,
  'src/modules/users/users.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, data: any, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    });
  }
}
`,
  'src/common/interceptors/tenant.interceptor.ts': `import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Logic can be applied here to attach tenantId to services if using AsyncLocalStorage
    return next.handle();
  }
}
`,
  'src/common/filters/http-exception.filter.ts': `import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exceptionResponse.message || exception.message,
        error: exceptionResponse.error || 'Erro',
      });
  }
}
`,
  'src/common/dto/pagination.dto.ts': `export class PaginationDto<T> {
  data!: T[];
  total!: number;
  page!: number;
  limit!: number;
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', fullPath);
}
