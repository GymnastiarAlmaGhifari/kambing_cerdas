-- CreateTable
CREATE TABLE `IOTImageProcessing` (
    `id` VARCHAR(191) NOT NULL,
    `rfid` VARCHAR(191) NOT NULL,
    `id_kambing` VARCHAR(191) NOT NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_id_kambing_fkey` FOREIGN KEY (`id_kambing`) REFERENCES `kambing`(`id_kambing`) ON DELETE RESTRICT ON UPDATE CASCADE;
