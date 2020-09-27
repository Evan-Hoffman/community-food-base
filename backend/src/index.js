const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('promise-mysql')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()
const setupPassport = require('./passport')
const util = require('./util');

(async () => {
  connection = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  })
  console.log(`Connected to database '${process.env.database}'`)

  setupPassport(passport)

  const PORT = 3000
  const app = express()

  app.use(bodyParser.json())
  app.use(session({
    resave: false, saveUninitialized: true, secret: 'hhehh'
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.post('/register', async (req, res, next) => {
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
  })

  app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  app.post('/logout', (req, res) => {
    req.logout()
    console.log('Logged user out')
    res.redirect('/')
  })

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
})()
