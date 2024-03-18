/*
  Warnings:

  - The `resolved` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `refresh_token` TEXT NULL,
    MODIFY `access_token` TEXT NULL,
    MODIFY `id_token` TEXT NULL;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `resolved`,
    ADD COLUMN `resolved` DATETIME(3) NULL AFTER `userId`;
