const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('promise-mysql')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()
const setupPassport = require('./user/passport')
const setupUserRoutes = require('./user')
const setupPurchaseRoutes = require('./purchase')
const setupDeliveriesRoutes = require('./deliveries')
const setupCategoriesRoutes = require('./categories');
const setupItemsRoutes = require('./items');

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

  setupUserRoutes(app, passport)
  setupPurchaseRoutes(app)
  setupDeliveriesRoutes(app)
  setupCategoriesRoutes(app)
  setupItemsRoutes(app)

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
})()
