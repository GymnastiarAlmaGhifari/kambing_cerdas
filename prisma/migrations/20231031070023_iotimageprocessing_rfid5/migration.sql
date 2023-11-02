-- DropForeignKey
ALTER TABLE `iotimageprocessing` DROP FOREIGN KEY `IOTImageProcessing_id_fkey`;

-- DropIndex
DROP INDEX `IOTImageProcessing_rfid_key` ON `iotimageprocessing`;

-- AlterTable
ALTER TABLE `iotimageprocessing` ADD COLUMN `id_kambing` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_id_kambing_fkey` FOREIGN KEY (`id_kambing`) REFERENCES `kambing`(`id_kambing`) ON DELETE SET NULL ON UPDATE CASCADE;
