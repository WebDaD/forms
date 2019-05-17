/* Personal registration */
INSERT INTO `forms`.`forms` (`name`, `slug`, `active`, `active_from`, `active_to`) 
VALUES ('Personal Registration', 'personal_registration', '1', '2019-05-17T08:00:00', '2020-05-17T08:00:00');

/* Fields */
INSERT INTO `forms`.`form_fields` (`form_id` ,`type` ,`label`,`name` ,`order` ,`required` ,`visibleIf`,`validation` ,`invalidMessage` ,`additional`)
VALUES
  (1, 'text', 'Name', 'name', 1, 1, '0', '0', '0', '{}'),
  ()
;