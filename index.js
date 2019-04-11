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
