/*
  Warnings:

  - You are about to drop the column `employeeId` on the `PredictionHistory` table. All the data in the column will be lost.
  - Added the required column `input` to the `PredictionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PredictionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PredictionHistory" DROP CONSTRAINT "PredictionHistory_employeeId_fkey";

-- AlterTable
ALTER TABLE "PredictionHistory" DROP COLUMN "employeeId",
ADD COLUMN     "input" JSONB NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PredictionHistory" ADD CONSTRAINT "PredictionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
