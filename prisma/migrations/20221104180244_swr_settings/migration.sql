/*
  Warnings:

  - You are about to drop the column `swr` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "swr";
ALTER TABLE "Link" ADD COLUMN     "enableSwr" BOOL NOT NULL DEFAULT false;
ALTER TABLE "Link" ADD COLUMN     "swrAge" INT4;
