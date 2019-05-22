CREATE TABLE IF NOT EXISTS  `forms`.`forms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(45) NOT NULL,
  `active` INT NOT NULL DEFAULT 0,
  `active_from` DATETIME NULL,
  `active_to` DATETIME NULL,
  `thank_you` TEXT NOT NULL DEFAULT '<p>Thank you for Sending the Form</p>',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) VISIBLE
)
CREATE TABLE IF NOT EXISTS  `forms`.`form_fields` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `type` ENUM('text', 'date', 'dateRange', 'select', 'selectcountry', 'multiSelect', 'hidden', 'submit', 'captcha', 'hr', 'html') NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `order` INT NOT NULL DEFAULT 20,
  `required` VARCHAR(255)  NOT NULL DEFAULT '',
  `visibleIf` VARCHAR(255) NOT NULL DEFAULT '',
  `validation` VARCHAR(255) NOT NULL DEFAULT '',
  `invalidMessage` VARCHAR(255) NOT NULL DEFAULT '',
  `additional` JSON,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `forms`.`results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `form_id` INT NOT NULL,
  `json` JSON NOT NULL,
  `entry_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `forms`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);