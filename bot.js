const TelegramBot = require('node-telegram-bot-api');
const { parseDate } = require('./dateParser');
const { getOrthodoxEvent } = require('./calendar');
const { formatResponse } = require('./formatter');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    '🕊️ Добро пожаловать, братие!\n\n' +
    'Присылайте мне сообщения с датами, и я заменю их на церковные праздники со старорусским акцентом.\n\n' +
    '📖 Примеры:\n' +
    '• "Встретимся в воскресенье"\n' +
    '• "До 25 декабря осталось мало"\n' +
    '• "К 3 сентября подготовимся"\n\n' +
    '⛪ Соблюдаю падежи и говорю, как настоящий поп или набожная бабуля!'
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '📿 Как пользоваться ботом:\n\n' +
    '1️⃣ Отправьте сообщение с любой датой\n' +
    '2️⃣ Получите ответ с церковным праздником\n' +
    '3️⃣ Перешлите в нужный чат\n\n' +
    '🔧 Команды:\n' +
    '/start - начать работу\n' +
    '/help - эта помощь\n' +
    '/about - о боте\n\n' +
    '🙏 Бот понимает: числа (25.12, 3 января), дни недели (в воскресенье), слова (завтра, послезавтра)'
  );
});

bot.onText(/\/about/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '⛪ Православный календарь-бот "Поп Говорит"\n\n' +
    '📅 Версия: 1.0.0\n' +
    '📖 Календарь: 2025-2026\n' +
    '🕊️ Стиль: церковно-славянский\n' +
    '📿 Молитвы: встроенные\n\n' +
    '✨ Создан для благочестивого общения в чатах.\n' +
    'Слава Богу за все! 🙏'
  );
});

bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    try {
      console.log(`Обрабатываем сообщение: "${text}"`);
      const dates = parseDate(text);
      
      if (dates.length === 0) {
        return; // Не найдены даты - не отвечаем
      }

      console.log(`Найдено дат: ${dates.length}`);
      let responseText = text;
      
      // Сортируем по позиции в тексте (справа налево)
      const sortedDates = dates
        .map(d => ({ ...d, position: text.indexOf(d.originalText) }))
        .sort((a, b) => b.position - a.position);
      
      for (const dateInfo of sortedDates) {
        const orthodoxEvent = getOrthodoxEvent(dateInfo.date);
        const formattedEvent = formatResponse(orthodoxEvent, dateInfo.case);
        console.log(`Заменяем "${dateInfo.originalText}" на "${formattedEvent}"`);
        responseText = responseText.replace(dateInfo.originalText, formattedEvent);
      }

      bot.sendMessage(chatId, responseText);
      
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
    }
  }
});

console.log('🤖 Православный бот "Поп Говорит" запущен! Ждем токен в переменной BOT_TOKEN...');

process.on('SIGINT', () => {
  console.log('👋 Бот остановлен');
  process.exit();
});