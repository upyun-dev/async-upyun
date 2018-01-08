const crypto = require('crypto');

module.exports = {
  md5: str => crypto.createHash('md5').update(str, 'utf8').digest('hex'),
  base64Sha1: ({ str, secret }) => crypto.createHmac('sha1', secret).update(str, 'utf8').digest().toString('base64')
};
