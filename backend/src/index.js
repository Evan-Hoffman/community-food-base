const crypto = require('crypto')
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('promise-mysql')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
require('dotenv').config();

const hash = (password, salt) => crypto
  .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
  .toString('base64');

(async () => {
  connection = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  })
  console.log(`Connected to database '${process.env.database}'`)

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    const rows = await connection.query('SELECT * FROM `users` WHERE `id`=?', [id])
    if (rows.length == 0)
      throw new Error(`User ${id} no longer exists!`)
    done(null, rows[0])
  })

  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (username, password, done) => {
      const rows = await connection.query('SELECT * FROM `users` WHERE `email`=?', [username])
      if (rows.length === 0) {
        done(null, false, { message: 'Incorrect email or password' })
        return
      }

      const user = rows[0]
      if (user.password !== hash(password, user.salt)) {
        done(null, false, { message: 'Incorrect email or password' })
        return
      }

      console.log(`Logged user in`)
      done(null, { id: 0 })
    }
  ))

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
    const password = hash(req.body.password, salt)
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
