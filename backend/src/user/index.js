const crypto = require('crypto')
const util = require('../util');

function setupRoutes(app, passport) {
  app.post('/user/register', async (req, res, next) => {
    const salt = crypto.randomBytes(64).toString('hex')
    const password = util.hash(req.body.password, salt)
    const result = await connection.query(
      'INSERT INTO `users` (`first_name`, `last_name`, `email`, `phone`, `password`, `salt`, `location`, `is_deliverer`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.first_name, req.body.last_name, req.body.email, req.body.phone, password, salt, req.body.location, req.body.is_deliverer])
    const id = result.insertId

    console.log(`Registered user ${id}`)
    passport.authenticate('login', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next)
    res.setHeader('Content-Type', 'application/json')
    req.send(id)
  })

  app.post('/user/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  app.post('/user/logout', (req, res) => {
    req.logout()
    console.log('Logged user out')
    res.redirect('/')
  })

  app.get('/user/:id', async (req, res) => {
    const result = await connection.query(
      'SELECT * FROM `users` WHERE `id` = ?',
      [req.params.id]
    )
    if (result.length === 0) {
      res.statusCode(400).send('No such user')
      return
    }
    const user = result[0]
    delete user.password
    delete user.salt
    user.is_deliverer = user.is_deliverer.data[0] == 1
    res.setHeader('Content-Type', 'application/json')
    res.send(result[0])
  })
}

module.exports = setupRoutes
