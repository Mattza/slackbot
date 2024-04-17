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
  await prisma.person.deleteMany({
    where: {
      kanalid
    }
  });
  await prisma.bestaellning.deleteMany({

    where: {
      kanalid: {
        equals: kanalid,
      }
    }
  });
  await prisma.bestaellning.create({
    data: {
      restaurangnamn,
      webbadress,
      kanalid,
      kanalnamn,
    },
  });
};

export const show = async () => {
  const restaurang = await prisma.bestaellning.findFirst();
  const personer = await prisma.person.findMany();
  return {
    restaurang,
    personer,
  };
};
