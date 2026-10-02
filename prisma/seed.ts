import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const tenant = await prisma.tenant.upsert({
    where: { name: 'Empresa Demo' },
    update: {},
    create: { name: 'Empresa Demo' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Administrador',
      password: passwordHash,
      telephone: '88888888',
      role: Role.ADMIN,
      tenantId: tenant.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@demo.com' },
    update: {},
    create: {
      email: 'user@demo.com',
      name: 'Usuario Demo',
      password: passwordHash,
      telephone: '77777777',
      role: Role.USER,
      tenantId: tenant.id,
    },
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });