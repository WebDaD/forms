CREATE TABLE `forms`.`forms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(45) NOT NULL,
  `active` INT NOT NULL DEFAULT 0,
  `active_from` DATETIME NULL,
  `active_to` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE);