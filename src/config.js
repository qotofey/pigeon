require('dotenv').config();

module.exports = {
  port: process.env.PORT || 2400,
  nodeEnv: process.env.NODE_ENV || 'development',
  email: {
    from: process.env.EMAIL_FROM || 'noreply@qotofey.ru',
    sendmailPath: process.env.SENDMAIL_PATH || '/usr/local/bin/sendmail',
  },
};