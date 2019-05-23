/* Personal registration */
INSERT INTO `forms`.`forms` (`name`, `slug`, `active`, `active_from`, `active_to`, `thank_you`, `mail_subject`, `mail`) 
VALUES ('Personal Registration', 'personal_registration', '1', '2019-05-17T08:00:00', '2020-05-17T08:00:00', '<p>You are now registered!</p><p>This Data has been submitted to your E-Mail-Adress and was saved in our Database.</p><a href="https://join.slack.com/t/prixjeunesse/shared_invite/enQtNTk2MTEyMzA3MzQ0LTYxYTI2ZTczNzJkNWFkMDEwZGU0MDA2ZjM0Y2Y4NjQ2YzNiM2YzMGQ4MmU5MTVmMTY1YWFhMThmMmIwMzY1NGI" target="_blank">Feel free to Register to our Slack for more Communucation!</a>');

/* Fields */
INSERT INTO `forms`.`form_fields` (`form_id` ,`type` ,`label`,`name` ,`order` ,`required` ,`visibleIf`,`validation` ,`invalidMessage` ,`additional`)
VALUES
  (1, 'text', 'Name', 'name', 1, '1', '', '', '', '{}'),
  (1, 'text', 'Given Name', 'givenName', 2, '1', '', '', '', '{}'),
  (1, 'text', 'Job Title', 'job', 3, '1', '', '', '', '{}'),
  (1, 'text', 'E-Mail', 'email', 4, '1', '', 'email', 'Please Enter a valid E-Mail-Adress', '{}'),
  (1, 'hr', 'Break', 'break', 5, '', '', '', '', '{}'),
  (1, 'text', 'Organisation', 'organisation', 6, '1', '', '', '', '{}'),
  (1, 'text', 'Street of Organisation', 'street', 7, '', '', '', '', '{}'),
  (1, 'text', 'ZIP Code of Organisation', 'zip', 8, '', '', '', '', '{}'),
  (1, 'text', 'City of Organisation', 'city', 9, '1', '', '', '', '{}'),
  (1, 'selectcountry', 'Country of Organisation', 'country', 10, '1', '', '', '', '{}'),
  (1, 'text', 'Department in Organisation', 'department', 11, '', '', '', '', '{}'),
  (1, 'text', 'Phone Number', 'phone', 12, '', '', '', '', '{}'),
  (1, 'hr', 'Break', 'break', 13, '', '', '', '', '{}'),
  (1, 'dateRange', 'Your Stay Dates', 'stay', 14, '', '', '', '', '{format:"dd/mm/yyyy", minDate:"2019-04-10", maxDate:"2019-04-10"}'),
  (1, 'hr', 'Break', 'break', 15, '', '', '', '', '{}'),
  (1, 'select', 'I will participate as', 'participation', 16, '1', '', '', '', '{options: [{label:"Observer", value:"observer", selected:false},{label:"Voter", value:"voter", selected:true}]}'),
  (1, 'multiSelect', 'I will vote here', 'voting', 17, '', 'participation=voter', '', '', '{options:[{label:"11 – 15: Fiction", value:"11_15_Fiction"},{value:"11_15_Non-Fiction", label:"11 – 15: Non-Fiction"},{value:"7_10_Fiction", label:"7 – 10: Fiction "},{value:"7_10_Non-Fiction", label:"7 – 10: Non-Fiction "},{value:"Up_to_6_Fiction", label:"Up to 6: Fiction "},{value:"Up_to_6_Non-Fiction", label:"Up to 6: Non-Fiction "}]}'),
  (1, 'text', 'Are you involved with a TV programme entered for competition? If yes, what programme', 'involved', 18, '', '', '', '', '{}'),
  (1, 'html', '<div class="alert alert-primary">REGISTRATION DEADLINE: 30 April 2020</div>', 'html', 19, '', '', '', '', '{}'),
  (1, 'hidden', 'Status', 'status', 20, '', '', '', '', '{value:1}'),
  (1, 'captcha', 'Captcha', 'captcha', 21, '', '', '', '', '{}'),
  (1, 'submit', 'Send Form', 'submit', 22, '', '', '', '', '{}'),
;