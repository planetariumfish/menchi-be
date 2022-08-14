-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AnimalType" AS ENUM ('Dog', 'Cat', 'Rat', 'Bird', 'Rabbit', 'Ferret', 'GuineaPig');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ADOPTED', 'FOSTERED', 'AVAILABLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "phone" VARCHAR(15),
    "bio" TEXT,
    "returned" TIMESTAMP(3),
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AnimalType" NOT NULL,
    "breed" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'AVAILABLE',
    "picture" TEXT,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "bio" TEXT,
    "hypoallergenic" BOOLEAN NOT NULL DEFAULT false,
    "dietary" TEXT[],
    "userId" TEXT,
    "added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned" TIMESTAMP(3),
    "tags" TEXT[],

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PetToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PetToUser_AB_unique" ON "_PetToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PetToUser_B_index" ON "_PetToUser"("B");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PetToUser" ADD CONSTRAINT "_PetToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PetToUser" ADD CONSTRAINT "_PetToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
