-- CreateTable
CREATE TABLE "Person" (
    "namn" TEXT NOT NULL,
    "val" TEXT NOT NULL,
    "kanalid" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("namn","kanalid")
);

-- CreateTable
CREATE TABLE "Bestaellning" (
    "kanalid" TEXT NOT NULL,
    "restaurangnamn" TEXT NOT NULL,
    "webbadress" TEXT NOT NULL,
    "kanalnamn" TEXT NOT NULL,

    CONSTRAINT "Bestaellning_pkey" PRIMARY KEY ("kanalid")
);

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_kanalid_fkey" FOREIGN KEY ("kanalid") REFERENCES "Bestaellning"("kanalid") ON DELETE RESTRICT ON UPDATE CASCADE;
