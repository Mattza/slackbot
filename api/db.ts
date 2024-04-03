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

export const start = async (resturangNamn: string, webbadress: string) => {
  await prisma.restaurang.deleteMany();
  await prisma.restaurang.create({
    data: { name: resturangNamn, url: webbadress },
  });
  return prisma.person.deleteMany();
};

export const show = async () => {
  const restaurang = await prisma.restaurang.findFirst();
  const personer = await prisma.person.findMany();
  return {
    restaurang,
    personer,
  };
};
