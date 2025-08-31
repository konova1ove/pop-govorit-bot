#!/bin/bash
# 🕊️ Скрипт для запуска Православного бота

echo "🤖 Запуск православного бота 'Поп Говорит'..."

# Проверяем наличие токена
if [ -z "$BOT_TOKEN" ]; then
    echo "❌ Ошибка: Переменная BOT_TOKEN не установлена!"
    echo "📝 Создайте файл .env и добавьте: BOT_TOKEN=your_telegram_bot_token"
    echo "📖 Или экспортируйте переменную: export BOT_TOKEN=your_token"
    exit 1
fi

echo "✅ Токен найден, запускаем бота..."
node bot.js