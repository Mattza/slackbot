import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const choose = (name: string, choose: string) => {
  return prisma.person.upsert({
    where: {
      name,
    },
    update: {
      choose,
    },
    create: {
      choose,
      name,
    },
  });
};

export const start = () => {
  return prisma.person.deleteMany();
};

export const show = () => {
  return prisma.person.findMany();
};
