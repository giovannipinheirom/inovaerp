import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
