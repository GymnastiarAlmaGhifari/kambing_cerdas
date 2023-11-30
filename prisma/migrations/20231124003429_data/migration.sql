/*
  Warnings:

  - You are about to drop the column `humidity` on the `dht22` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `dht22` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `kambing` table. All the data in the column will be lost.
  - You are about to drop the `mq135` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pakan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rfid]` on the table `kambing` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nama_kambing` on table `kambing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nama_kandang` on table `kandang` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `mq135` DROP FOREIGN KEY `mq135_id_kandang_fkey`;

-- DropForeignKey
ALTER TABLE `pakan` DROP FOREIGN KEY `pakan_id_kandang_fkey`;

-- DropForeignKey
ALTER TABLE `pakan` DROP FOREIGN KEY `pakan_id_user_fkey`;

-- AlterTable
ALTER TABLE `dht22` DROP COLUMN `humidity`,
    DROP COLUMN `temperature`;

-- AlterTable
ALTER TABLE `kambing` DROP COLUMN `status`,
    ADD COLUMN `gambar_kambing` VARCHAR(191) NULL,
    MODIFY `nama_kambing` VARCHAR(191) NOT NULL,
    MODIFY `tanggal_lahir` DATE NULL;

-- AlterTable
ALTER TABLE `kandang` MODIFY `nama_kandang` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `mq135`;

-- DropTable
DROP TABLE `pakan`;

-- CreateTable
CREATE TABLE `IOTImageProcessing` (
    `id` VARCHAR(191) NOT NULL,
    `rfid` VARCHAR(191) NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `bobot` DOUBLE NULL,
    `usia` INTEGER NULL,
    `deskripsi` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_kambing` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartImageProcessing` (
    `id` VARCHAR(191) NOT NULL,
    `rfid` VARCHAR(191) NULL,
    `imagePath` VARCHAR(191) NOT NULL,
    `bobot` DOUBLE NULL,
    `usia` INTEGER NULL,
    `deskripsi` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_kambing` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_dht` (
    `id_data_dht` VARCHAR(191) NOT NULL,
    `id_dht22` VARCHAR(191) NULL,
    `temperature` DOUBLE NULL,
    `humidity` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_data_dht`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id_notifications` VARCHAR(191) NOT NULL,
    `message_notifications` VARCHAR(191) NOT NULL,
    `tag_id` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_notifications`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `kambing_rfid_key` ON `kambing`(`rfid`);

-- AddForeignKey
ALTER TABLE `IOTImageProcessing` ADD CONSTRAINT `IOTImageProcessing_id_kambing_fkey` FOREIGN KEY (`id_kambing`) REFERENCES `kambing`(`id_kambing`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartImageProcessing` ADD CONSTRAINT `CartImageProcessing_id_kambing_fkey` FOREIGN KEY (`id_kambing`) REFERENCES `kambing`(`id_kambing`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_dht` ADD CONSTRAINT `data_dht_id_dht22_fkey` FOREIGN KEY (`id_dht22`) REFERENCES `dht22`(`id_dht22`) ON DELETE SET NULL ON UPDATE CASCADE;
