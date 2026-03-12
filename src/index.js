require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const config = require('./config');
const { sendSingle, sendBulk } = require('./services/emailService');
const { singleSchema, arraySchema } = require('./validators/registrationValidator');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Проверка наличия sendmail (предупреждение, не блокируем запуск)
if (!fs.existsSync(config.email.sendmailPath)) {
  console.warn(`ВНИМАНИЕ: Sendmail не найден по пути ${config.email.sendmailPath}`);
}

// Эндпоинт отправки
app.post('/api/private/v1/email-registration', async (req, res) => {
  try {
    const data = req.body;

    // Определяем тип входа: объект или массив
    let validationResult;
    if (Array.isArray(data)) {
      validationResult = arraySchema.validate(data, { abortEarly: false });
    } else {
      validationResult = singleSchema.validate(data, { abortEarly: false });
    }

    if (validationResult.error) {
      return res.status(400).json({
        status: 'error',
        message: 'Ошибка валидации',
        details: validationResult.error.details.map(d => d.message),
      });
    }

    const validData = validationResult.value;

    // Отправка
    let results;
    if (Array.isArray(validData)) {
      results = await sendBulk(validData);
    } else {
      const { email, code } = validData;
      const result = await sendSingle(email, code);
      results = [{ email, ...result }];
    }

    // Подсчёт успешных и неуспешных
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({
      status: 'ok',
      total: results.length,
      successful,
      failed,
      results,
    });
  } catch (err) {
    console.error('Необработанная ошибка:', err);
    res.status(500).json({
      status: 'error',
      message: 'Внутренняя ошибка сервера',
    });
  }
});

// Запуск сервера
app.listen(config.port, () => {
  console.log(`Сервер запущен на порту ${config.port} в режиме ${config.nodeEnv}`);
});