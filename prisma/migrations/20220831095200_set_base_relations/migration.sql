/*
  Warnings:

  - The values [GuineaPig] on the enum `AnimalType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_PetToUser` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `firstname` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AnimalType_new" AS ENUM ('Dog', 'Cat', 'Rat', 'Bird', 'Rabbit', 'Ferret', 'Other');
ALTER TABLE "Pet" ALTER COLUMN "type" TYPE "AnimalType_new" USING ("type"::text::"AnimalType_new");
ALTER TYPE "AnimalType" RENAME TO "AnimalType_old";
ALTER TYPE "AnimalType_new" RENAME TO "AnimalType";
DROP TYPE "AnimalType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_PetToUser" DROP CONSTRAINT "_PetToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PetToUser" DROP CONSTRAINT "_PetToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT,
ALTER COLUMN "firstname" SET NOT NULL;

-- DropTable
DROP TABLE "_PetToUser";

-- CreateTable
CREATE TABLE "Bookmarks" (
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,

    CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("userId","petId")
);

-- CreateTable
CREATE TABLE "StatusChange" (
    "id" TEXT NOT NULL,
    "newStatus" "Status" NOT NULL,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusChange_pkey" PRIMARY KEY ("id")
);
