-- DropForeignKey
ALTER TABLE `iotimageprocessing` DROP FOREIGN KEY `IOTImageProcessing_id_kambing_fkey`;

-- AlterTable
ALTER TABLE `iotimageprocessing` MODIFY `id_kambing` VARCHAR(191) NULL,
    MODIFY `rfid` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_rfid_fkey` FOREIGN KEY (`rfid`) REFERENCES `kambing`(`rfid`) ON DELETE SET NULL ON UPDATE CASCADE;
