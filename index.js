const config = require('./config.json')

const mysql = require('mysql')
const connection = mysql.createConnection(config.database)
try {
  //connection.connect()
} catch (e) {
  console.error(e)
  process.exit(5)
}

const express = require('express')
const app = express()
const server = require('http').createServer(app) // TODO: to https!

app.set('view engine', 'pug')

app.use(express.static('static'))

server.listen(config.port)
console.log('forms running on ' + config.port)

app.get('/form/:slug', function (req, res) {
  res.render(req.params.slug + '/form')
})

/* Routes

- POST /form/:slug check captcha and write json to table, send mails, return thankyoupage

PASSPORT!
- GET /admin/
- GET /admin/:slug (View)
- GET /admin/:slug/:id (DetailView) -> queryparm ?print
- PUT /admin/:slug update form state
- PUT /admin/:slug/:id update data (json)

OPEN:
- GET /winners get winner table
- GET /winners/:year get winners for year
*/

/*
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = "--paste your secret key here--";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });

*/