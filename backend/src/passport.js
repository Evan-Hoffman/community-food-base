const LocalStrategy = require('passport-local').Strategy
const util = require('./util')

module.exports = passport => {
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
      if (user.password !== util.hash(password, user.salt)) {
        done(null, false, { message: 'Incorrect email or password' })
        return
      }

      console.log(`Logged user in`)
      done(null, { id: 0 })
    }
  ))
}