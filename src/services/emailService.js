const nodemailer = require('nodemailer');
const config = require('../config');
const getEmailTemplate = require('../templates/emailTemplate');

let transporter;
try {
  transporter = nodemailer.createTransport({
    sendmail: true,
    path: config.email.sendmailPath,
    args: ['-t'],
  });
  console.log('Sendmail транспорт инициализирован');
} catch (err) {
  console.error('Ошибка инициализации Sendmail:', err);
  process.exit(1);
}

/**
 * Отправка одного письма
 * @param {string} email
 * @param {string} code
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendSingle(email, code) {
  try {
    // Здесь позже можно добавить проверку rate limit через Redis
    const html = getEmailTemplate(code);
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Код подтверждения регистрации',
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Ошибка отправки на ${email}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Массовая отправка
 * @param {Array<{email: string, code: string}>} items
 * @returns {Promise<Array<{email: string, success: boolean, messageId?: string, error?: string}>>}
 */
async function sendBulk(items) {
  const concurrency = 5;
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.allSettled(
      chunk.map(({ email, code }) => sendSingle(email, code).then(res => ({ email, ...res })))
    );
    results.push(...chunkResults.map(r => r.status === 'fulfilled' ? r.value : { email: 'unknown', success: false, error: r.reason?.message || 'Unknown error' }));
  }
  return results;
}

module.exports = { sendSingle, sendBulk };