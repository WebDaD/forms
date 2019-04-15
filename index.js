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

const moment = require('moment')
const request = require('request')

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

app.post('/form/:slug', function (req, res) {
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.status(400).json({ 'responseCode': 1, 'responseDesc': 'Please select captcha' })
  } else {
    var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.secretKey + '&response=' + req.body['g-recaptcha-response'] + '&remoteip=' + req.connection.remoteAddress
    request(verificationUrl, function (error, response, body) {
      if (error) {
        res.status(400).json(error)
      } else {
        body = JSON.parse(body)
        if (body.success !== undefined && !body.success) {
          return res.status(400).json({ 'responseCode': 1, 'responseDesc': 'Failed captcha verification' })
        } else {
          connection.query('SELECT id, name FROM forms WHERE slug="' + req.params.slug + '"', function (error, results) {
            if (error) {
              res.status(500).json(error)
            } else {
              if (results.length !== 1) {
                res.status(500).json(results)
              } else {
                let id = results[0].id
                let name = results[0].name
                connection.query('INSERT INTO results (form, json) VALUES (' + id + ', "' + req.body.data + '")', function (error) {
                  if (error) {
                    // TODO: send mail to sender

                    // TODO: send mail to prix

                    res.render(req.params.slug + '/form', { title: name, data: req.body.date })
                  } else {
                    res.status(500).json(error)
                  }
                })
              }
            }
          })
        }
      }
    })
  }

  // TODO: or on error: return error 500 and json
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
