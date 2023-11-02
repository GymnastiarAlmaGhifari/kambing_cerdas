/*
  Warnings:

  - You are about to drop the column `id_kambing` on the `iotimageprocessing` table. All the data in the column will be lost.
  - You are about to drop the column `rfid` on the `iotimageprocessing` table. All the data in the column will be lost.
  - Added the required column `kambing->id_kambing` to the `IOTImageProcessing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kambing->rfid` to the `IOTImageProcessing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `iotimageprocessing` DROP FOREIGN KEY `IOTImageProcessing_id_kambing_fkey`;

-- AlterTable
ALTER TABLE `iotimageprocessing` DROP COLUMN `id_kambing`,
    DROP COLUMN `rfid`,
    ADD COLUMN `kambing->id_kambing` VARCHAR(191) NOT NULL,
    ADD COLUMN `kambing->rfid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_kambing->id_kambing_fkey` FOREIGN KEY (`kambing->id_kambing`) REFERENCES `kambing`(`id_kambing`) ON DELETE RESTRICT ON UPDATE CASCADE;
