# 🚀 Инструкция по развертыванию православного бота

## 📋 Шаги для запуска бота:

### 1. Создание Telegram бота

1. **Найдите @BotFather** в Telegram
2. **Отправьте команду** `/newbot`
3. **Введите название** бота: `Поп Говорит`
4. **Введите username** бота: `pop_govorit_bot` (или другой доступный)
5. **Скопируйте токен** который выдаст BotFather

### 2. Настройка проекта

1. **Создайте файл .env** в корне проекта:
   ```bash
   cp .env.example .env
   ```

2. **Добавьте ваш токен** в файл `.env`:
   ```
   BOT_TOKEN=1234567890:ABCDefGhIJKlMnOpQrStUvWxYz
   NODE_ENV=production
   ```

### 3. Запуск бота локально

```bash
# Установка зависимостей (уже сделано)
npm install

# Запуск бота
npm start

# Или через скрипт
./start.sh
```

### 4. Развертывание на сервере

#### Через PM2 (рекомендуется):
```bash
# Установка PM2
npm install -g pm2

# Запуск бота через PM2
pm2 start bot.js --name "pop-govorit-bot"

# Сохранение конфигурации
pm2 save
pm2 startup
```

#### Через systemd:
```bash
# Создание сервиса
sudo nano /etc/systemd/system/pop-govorit-bot.service

# Добавьте конфигурацию:
[Unit]
Description=Orthodox Calendar Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/pop-govorit-main
Environment=BOT_TOKEN=your_token_here
ExecStart=/usr/bin/node bot.js
Restart=always

[Install]
WantedBy=multi-user.target

# Запуск сервиса
sudo systemctl enable pop-govorit-bot
sudo systemctl start pop-govorit-bot
```

### 5. Тестирование

1. **Найдите вашего бота** в Telegram по username
2. **Отправьте** `/start`
3. **Протестируйте** сообщения:
   - "Встретимся в воскресенье"
   - "До 25 декабря осталось мало"
   - "К 7 января подготовимся"

### 6. Добавление в групповые чаты

1. **В @BotFather** отправьте `/setprivacy`
2. **Выберите** вашего бота
3. **Выберите** `Disable` (чтобы бот видел все сообщения)
4. **Добавьте бота** в групповые чаты

## 🔧 Полезные команды для мониторинга:

```bash
# Логи PM2
pm2 logs pop-govorit-bot

# Статус PM2
pm2 status

# Перезапуск PM2
pm2 restart pop-govorit-bot

# Логи systemd
sudo journalctl -u pop-govorit-bot -f
```

## 🎯 Готово!

Ваш православный бот готов к работе! Он будет заменять даты в сообщениях на церковные праздники с аутентичным старорусским акцентом.

**Слава Богу за все! 🙏**