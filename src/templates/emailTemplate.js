module.exports = (code) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Подтверждение регистрации</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Подтверждение регистрации</h2>
        <p>Здравствуйте!</p>
        <p>Для завершения регистрации введите следующий код подтверждения:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0066cc;">${code}</p>
        <p>Если вы не запрашивали этот код, просто проигнорируйте данное письмо.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0;">
        <p style="font-size: 12px; color: #999;">Это автоматическое сообщение, отвечать на него не нужно.</p>
    </div>
</body>
</html>`;