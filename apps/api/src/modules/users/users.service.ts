import { Injectable, NotFoundException } from '@nestjs/common';
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
        profile: { select: { fullName: true } },
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
        profile: { select: { fullName: true } },
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
        profile: { select: { fullName: true } },
        role: true,
      }
    });
  }
}
