const config = require('./config.json')

const mysql = require('mysql')
const connection = mysql.createConnection(config.database)
try {
  connection.connect()
} catch (e) {
  console.error(e)
  process.exit(5)
}

const express = require('express')
const app = express()
const server = require('http').createServer(app) // TODO: to https!

const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport(config.mailer)
let mailOptions = {
  from: config.mailfrom // sender address
}

const moment = require('moment')
const request = require('request-promise')

app.set('view engine', 'pug')

app.use(express.static('static'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

server.listen(config.port)
console.log('forms running on ' + config.port)

app.get('/form/:slug', function (req, res) {
  connection.query('SELECT name, active, active_from, active_to FROM forms WHERE slug="' + req.params.slug + '"', function (error, results) {
    if (error) {
      res.status(501).json(error)
    } else {
      if (results.length !== 1) {
        res.status(404).render('404')
      } else {
        if (results[0].active === 0) {
          res.render('disabled', { state: 'inactive' })
        } else {
          if (moment(results[0].active_from).isAfter(moment())) {
            res.render('disabled', { state: 'early' })
          } else if (moment(results[0].active_to).isBefore(moment())) {
            res.render('disabled', { state: 'late' })
          } else {
            res.render(req.params.slug + '/form', { title: results[0].name, sitekey: config.sitekey, slug: req.params.slug })
          }
        }
      }
    }
  })
})

app.post('/form/:slug', async function (req, res) {
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.status(400).json({ 'responseCode': 1, 'responseDesc': 'Please select captcha' })
  } else {
    var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.secretKey + '&response=' + req.body['g-recaptcha-response'] + '&remoteip=' + req.connection.remoteAddress
    let body = await request(verificationUrl) // TODO: try catch
    body = JSON.parse(body)
    if (body.success !== undefined && !body.success) {
      return res.status(400).json({ 'responseCode': 1, 'responseDesc': 'Failed captcha verification' })
    } else {
      let results = await connection.query('SELECT id, name FROM forms WHERE slug="' + req.params.slug + '"') // TODO: try catch
      if (results.length !== 1) {
        res.status(500).json(results)
      } else {
        let id = results[0].id
        let name = results[0].name
        let json = JSON.parse(req.body.date)
        await connection.query('INSERT INTO results (form_id, json) VALUES (' + id + ', "' + JSON.stringify(json) + '")') // TODO: try catch
        mailOptions.text = 'eq.body.body' // TODO: plain text body
        if (json.email) {
          mailOptions.subject = 'Your Data for ' + name
          mailOptions.to = json.email
          await transporter.sendMail(mailOptions)
        }
        mailOptions.subject = 'New Entry for ' + name
        mailOptions.to = config.mailformto
        await transporter.sendMail(mailOptions)
        res.render(req.params.slug + '/form', { title: name, data: json })
      }
    }
  }
})

/* Routes

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
