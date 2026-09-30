import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientQueryDto } from './dto/client-query.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, tenantId: string) {
    return this.prisma.client.create({
      data: { ...createClientDto, tenantId } as any,
    });
  }

  async findAll(query: ClientQueryDto, tenantId: string) {
    const { search, taxRegime, status, page = 1, limit = 10 } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

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
        take: limitNum,
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
      data: updateClientDto as any,
    });
  }

  async remove(id: string, tenantId: string) {
    const client = await this.findOne(id, tenantId);
    return this.prisma.client.update({
      where: { id: client.id },
      data: { status: 'inactive' },
    });
  }
  
  async addContact(clientId: string, contactDto: any, tenantId: string) {
    const client = await this.findOne(clientId, tenantId);
    return this.prisma.clientContact.create({
      data: {
        ...contactDto,
        clientId: client.id,
      }
    });
  }

  async updateContact(clientId: string, contactId: string, contactDto: any, tenantId: string) {
    await this.findOne(clientId, tenantId);
    return this.prisma.clientContact.update({
      where: { id: contactId },
      data: contactDto,
    });
  }

  async removeContact(clientId: string, contactId: string, tenantId: string) {
    await this.findOne(clientId, tenantId);
    return this.prisma.clientContact.delete({
      where: { id: contactId },
    });
  }
}
