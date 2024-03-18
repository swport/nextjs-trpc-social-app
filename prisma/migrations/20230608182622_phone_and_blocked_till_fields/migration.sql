-- AlterTable
ALTER TABLE `User` ADD COLUMN `blockedTill` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(12) NULL,
    ADD COLUMN `phoneVerified` DATETIME(3) NULL;
