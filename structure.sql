CREATE TABLE IF NOT EXISTS  `forms`.`forms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(45) NOT NULL,
  `active` INT NOT NULL DEFAULT 0,
  `active_from` DATETIME NULL,
  `active_to` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE);

CREATE TABLE IF NOT EXISTS `forms`.`results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `json` JSON NOT NULL,
  `entry_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`);

CREATE TABLE IF NOT EXISTS `forms`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` INT NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`);