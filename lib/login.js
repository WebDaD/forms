function Login (connection) {
  let self = {}
  self.sha512 = require('js-sha512').sha512
  self.tokenList = {}
  self.connection = connection
  self.login = login // Check Username and Password
  self.isLoggedIn = isLoggedIn // check if token is logged in
  self.logout = logout // remove session

  return self
}
module.exports = Login

async function login (username, password) {
  let url = 'SELECT id FROM users WHERE login="' + username + '" AND `password`=SHA2("' + password + '", 256)'
  let results = await this.connection.query(url)
  if (results[0] && results[0].length === 1) {
    let token = this.sha512(Date.now + username)
    this.tokenList[token] = Date.now()
    return token
  } else {
    throw new Error('Incorrect username or password.')
  }
}

function isLoggedIn (token) {
  return this.tokenList[token] && this.tokenList[token] + 2880000 >= Date.now() // 8 hours * 60 mins * 60 seconds * 1000 ms
}

function logout (token) {
  delete this.tokenList[token]
  return true
}
