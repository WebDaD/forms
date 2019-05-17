const config = require('./config.json')

const mysql = require('mysql2')
const pool = mysql.createPool(config.database)
const connection = pool.promise()

const express = require('express')
const app = express()
const server = require('http').createServer(app)

if (config.https) {

}

const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport(config.mailer)
let mailOptions = {
  from: config.mailfrom
}

const moment = require('moment')
const request = require('request-promise')

const Login = require('./lib/login.js')
let login = Login(connection)

app.set('view engine', 'pug')

app.use(express.static('static'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

var cookieParser = require('cookie-parser')
app.use(cookieParser())

server.listen(config.port)
console.log('forms running on ' + config.port)

app.use(function (req, res, next) {
  console.log(Date.now() + ': ' + req.method + ' ' + req.url)
  next()
})

if (config.https.active) {
  var fs = require('fs')
  var key = fs.readFileSync(config.https.key)
  var cert = fs.readFileSync(config.https.cert)
  var options = {
    key: key,
    cert: cert
  }
  var https = require('https')
  https.createServer(options, app).listen(config.https.port)
  console.log('forms running SECURE on ' + config.https.port)
  app.use(function (req, res, next) {
    if (req.secure) {
      next()
    } else {
      res.redirect('https://' + req.headers.host.replace(config.port, config.https.port) + req.url)
    }
  })
}

async function isLoggedIn (req, res, next) {
  req.token = req.query.token || req.header.token || req.cookies.ftoken
  console.log(login.isLoggedIn(req.token))
  if (login.isLoggedIn(req.token)) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}

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
    try {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.secretKey + '&response=' + req.body['g-recaptcha-response'] + '&remoteip=' + req.connection.remoteAddress
      let body = await request(verificationUrl)
      body = JSON.parse(body)
      if (body.success !== undefined && !body.success) {
        return res.status(400).json({ 'responseCode': 1, 'responseDesc': 'Failed captcha verification' })
      } else {
        let results = await connection.query('SELECT id, name FROM forms WHERE slug="' + req.params.slug + '"')
        if (results.length !== 1) {
          res.status(500).json(results)
        } else {
          let id = results[0].id
          let name = results[0].name
          let json = JSON.parse(req.body.date)
          await connection.query('INSERT INTO results (form_id, json) VALUES (' + id + ', "' + JSON.stringify(json) + '")')
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
    } catch (error) {
      res.status(500).json(error)
    }
  }
})

app.post('/admin/login', async function (req, res) {
  try {
    let token = await login.login(req.body.username, req.body.password)
    res.status(200).json(token)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

app.get('/admin/logout', isLoggedIn, async function (req, res) {
  login.logout(req.token)
  res.redirect('/admin/login')
})

app.get('/admin/login', function (req, res) {
  res.render('admin/login')
})
app.get('/admin/', isLoggedIn, function (req, res) {
  res.render('admin/index')
})
app.get('/admin/:formSlug', isLoggedIn, async function (req, res) {
  try {
    let results = await connection.query('SELECT name, active, active_from, active_to FROM forms WHERE slug="' + req.params.slug + '"')
    res.render('admin/views/' + req.params.formSlug + '/index', { data: results })
  } catch (error) {
    res.status(500).json(error)
  }
})

app.put('/admin/:formSlug', isLoggedIn, function (req, res) {
  res.status(200) // TODO: update form settings, response status
})
app.get('/admin/:formSlug/:resultID', isLoggedIn, async function (req, res) {
  try {
    let results = await connection.query('SELECT f.name, r.id, r.form_id, r.json, r.entry_datetime FROM forms f, results r WHERE f.id = r.form_id AND r.id=' + req.params.resultID + ' AND f.slug="' + req.params.slug + '"')
    res.render('admin/views/' + req.params.formSlug + '/details', { data: results })
  } catch (error) {
    res.status(500).json(error)
  }
})
app.put('/admin/:formSlug/:resultID', isLoggedIn, function (req, res) {
  res.status(200) // TODO: update result, response status
})
app.get('/admin/:formSlug/:resultID/print', isLoggedIn, async function (req, res) {
  try {
    let results = await connection.query('SELECT f.name AS form_name, r.id, r.form_id, r.json, r.entry_datetime FROM forms f, results r WHERE f.id = r.form_id AND r.id=' + req.params.resultID + ' AND f.slug="' + req.params.slug + '"')
    res.render('admin/views/' + req.params.formSlug + '/print', { data: results })
  } catch (error) {
    res.status(500).json(error)
  }
})
