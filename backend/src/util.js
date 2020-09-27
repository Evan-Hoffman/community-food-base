const crypto = require('crypto')

const hash = (password, salt) => crypto
  .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
  .toString('base64');

module.exports = {
  hash
}
