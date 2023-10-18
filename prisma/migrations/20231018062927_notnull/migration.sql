/*
  Warnings:

  - Made the column `nama_kambing` on table `kambing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nama_kandang` on table `kandang` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `kambing` MODIFY `nama_kambing` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `kandang` MODIFY `nama_kandang` VARCHAR(191) NOT NULL;
