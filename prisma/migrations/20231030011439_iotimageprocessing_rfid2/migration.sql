/*
  Warnings:

  - You are about to drop the column `kambing->id_kambing` on the `iotimageprocessing` table. All the data in the column will be lost.
  - You are about to drop the column `kambing->rfid` on the `iotimageprocessing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rfid]` on the table `IOTImageProcessing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rfid]` on the table `kambing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_kambing` to the `IOTImageProcessing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rfid` to the `IOTImageProcessing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `iotimageprocessing` DROP FOREIGN KEY `IOTImageProcessing_kambing->id_kambing_fkey`;

-- AlterTable
ALTER TABLE `iotimageprocessing` DROP COLUMN `kambing->id_kambing`,
    DROP COLUMN `kambing->rfid`,
    ADD COLUMN `id_kambing` VARCHAR(191) NOT NULL,
    ADD COLUMN `rfid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `IOTImageProcessing_rfid_key` ON `IOTImageProcessing`(`rfid`);

-- CreateIndex
CREATE UNIQUE INDEX `kambing_rfid_key` ON `kambing`(`rfid`);

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_id_kambing_fkey` FOREIGN KEY (`id_kambing`) REFERENCES `kambing`(`id_kambing`) ON DELETE RESTRICT ON UPDATE CASCADE;
