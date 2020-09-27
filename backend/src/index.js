const express = require('express')
const mysql = require('promise-mysql')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
require('dotenv').config();

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

  passport.deserializeUser((id, done) => {
    done(null, /*TODO: get user by id*/{ id: 0 })
  })

  passport.use('register', new LocalStrategy(
    (username, password, done) => {
      console.log(`Created user @${username} with password ${password}`)
      done(null, { id: 0 })
    }
  ))

  passport.use('login', new LocalStrategy(
    (username, password, done) => {
      console.log(`Logged in as user @${username} with password ${password}`)
      done(null, { id: 0 })
    }
  ))

  const PORT = 3000
  const app = express()

  app.use(session({
    resave: false, saveUninitialized: true, secret: 'hhehh'
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.post('/register', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register'
  }))

  app.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
})()
