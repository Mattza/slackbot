import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const choose = (namn: string, val: string, kanalid: string) => {
  return prisma.person.upsert({
    where: {
      testasd: { namn, kanalid },
    },
    update: {
      val,
    },
    create: {
      val,
      namn,
      kanalid,
    },
  });
};

export const start = async (
  restaurangnamn: string,
  webbadress: string,
  kanalid: string,
  kanalnamn: string,
) => {
  await prisma.bestaellning.deleteMany();
  await prisma.bestaellning.create({
    data: {
      restaurangnamn,
      webbadress,
      kanalid,
      kanalnamn,
    },
  });
  return prisma.person.deleteMany();
};

export const show = async () => {
  const restaurang = await prisma.bestaellning.findFirst();
  const personer = await prisma.person.findMany();
  return {
    restaurang,
    personer,
  };
};
