-- DropForeignKey
ALTER TABLE `iotimageprocessing` DROP FOREIGN KEY `IOTImageProcessing_rfid_fkey`;

-- DropIndex
DROP INDEX `kambing_rfid_key` ON `kambing`;

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_id_fkey` FOREIGN KEY (`id`) REFERENCES `kambing`(`id_kambing`) ON DELETE RESTRICT ON UPDATE CASCADE;
