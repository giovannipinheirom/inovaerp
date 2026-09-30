import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Escritório Inova Contabilidade',
      cnpj: '12345678000199',
      plan: 'professional',
    },
  });

  const deptFiscal = await prisma.department.create({
    data: { name: 'Fiscal', tenantId: tenant.id },
  });
  const deptContabil = await prisma.department.create({
    data: { name: 'Contábil', tenantId: tenant.id },
  });
  const deptPessoal = await prisma.department.create({
    data: { name: 'Pessoal', tenantId: tenant.id },
  });
  const deptSocietario = await prisma.department.create({
    data: { name: 'Societário', tenantId: tenant.id },
  });

  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@inova.com',
      passwordHash: 'hashedpassword_123456', // In a real app this would be properly hashed
      role: 'super_admin',
      profile: {
        create: {
          fullName: 'Administrador do Sistema',
        }
      }
    },
  });

  const client1 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Tech Solutions LTDA',
      document: '11111111000111',
      taxRegime: 'lucro_presumido',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'Comércio de Alimentos Silva',
      document: '22222222000122',
      taxRegime: 'simples_nacional',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      tenantId: tenant.id,
      name: 'João Pintor MEI',
      document: '33333333000133',
      taxRegime: 'mei',
    },
  });

  const templateDas = await prisma.taskTemplate.create({
    data: {
      tenantId: tenant.id,
      name: 'Apuração DAS',
      category: 'fiscal',
      defaultPriority: 'normal',
      slaInternalDays: 3,
    },
  });

  await prisma.holiday.createMany({
    data: [
      { date: new Date('2026-01-01'), name: 'Confraternização Universal', type: 'fixed', scope: 'national' },
      { date: new Date('2026-02-17'), name: 'Carnaval', type: 'variable', scope: 'national' },
      { date: new Date('2026-04-03'), name: 'Paixão de Cristo', type: 'variable', scope: 'national' },
      { date: new Date('2026-04-21'), name: 'Tiradentes', type: 'fixed', scope: 'national' },
      { date: new Date('2026-05-01'), name: 'Dia do Trabalho', type: 'fixed', scope: 'national' },
      { date: new Date('2026-09-07'), name: 'Independência do Brasil', type: 'fixed', scope: 'national' },
      { date: new Date('2026-10-12'), name: 'Nossa Sr.a Aparecida', type: 'fixed', scope: 'national' },
      { date: new Date('2026-11-02'), name: 'Finados', type: 'fixed', scope: 'national' },
      { date: new Date('2026-11-15'), name: 'Proclamação da República', type: 'fixed', scope: 'national' },
      { date: new Date('2026-12-25'), name: 'Natal', type: 'fixed', scope: 'national' },
    ],
  });

  await prisma.task.create({
    data: {
      tenantId: tenant.id,
      clientId: client2.id,
      templateId: templateDas.id,
      readableCode: 'TSK-001',
      title: 'Apuração DAS - 01/2026',
      status: 'pending',
      priority: 'normal',
      createdById: admin.id,
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
