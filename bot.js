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
    '⛪ Соблюдаю падежи и говорю, как настоящий поп или набожная бабуля!\n\n' +
    '🎯 **Новое!** Inline-режим: в любом чате пишите @pop_govorit_bot [дата]'
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    '📿 Как пользоваться ботом:\n\n' +
    '1️⃣ **В личных чатах:** отправьте сообщение с любой датой\n' +
    '2️⃣ **В группах:** упомяните @pop_govorit_bot [дата]\n' +
    '3️⃣ **Inline-режим:** напишите @pop_govorit_bot [дата] в любом чате\n\n' +
    '🎅 **Примеры inline:**\n' +
    '• @pop_govorit_bot 25 декабря\n' +
    '• @pop_govorit_bot завтра\n' +
    '• @pop_govorit_bot в воскресенье\n\n' +
    '🔧 **Команды:**\n' +
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

// Inline query handler - для использования @pop_govorit_bot [дата] в любом чате
bot.on('inline_query', (query) => {
  const queryText = query.query.trim();
  const queryId = query.id;
  
  try {
    console.log(`Inline запрос: "${queryText}"`);
    
    if (!queryText) {
      // Если запрос пустой, показываем примеры
      const results = [{
        type: 'article',
        id: '1',
        title: '📅 Введите дату для получения церковного праздника',
        description: 'Примеры: "25 декабря", "завтра", "в воскресенье"',
        input_message_content: {
          message_text: '🙏 Введите дату после @pop_govorit_bot для получения церковного праздника'
        }
      }];
      
      bot.answerInlineQuery(queryId, results, { cache_time: 10 });
      return;
    }
    
    const dates = parseDate(queryText);
    
    if (dates.length === 0) {
      // Если даты не найдены
      const results = [{
        type: 'article',
        id: '1',
        title: '❌ Дата не распознана',
        description: 'Попробуйте: "25 декабря", "завтра", "в воскресенье"',
        input_message_content: {
          message_text: queryText + ' (дата не распознана православным календарем)'
        }
      }];
      
      bot.answerInlineQuery(queryId, results, { cache_time: 10 });
      return;
    }
    
    // Обрабатываем найденные даты
    let responseText = queryText;
    const results = [];
    
    // Сортируем по позиции в тексте (справа налево)
    const sortedDates = dates
      .map(d => ({ ...d, position: queryText.indexOf(d.originalText) }))
      .sort((a, b) => b.position - a.position);
    
    for (const dateInfo of sortedDates) {
      const orthodoxEvent = getOrthodoxEvent(dateInfo.date);
      const formattedEvent = formatResponse(orthodoxEvent, dateInfo.case);
      // Создаем ответ в формате: "Исходная дата. Иными словами – православный ответ"
      const finalResponse = `${dateInfo.originalText}. Иными словами – ${formattedEvent}`;
      responseText = responseText.replace(dateInfo.originalText, finalResponse);
    }
    
    // Создаем результат для inline
    results.push({
      type: 'article',
      id: '1',
      title: '⛪ ' + responseText,
      description: `Православный ответ на "${queryText}"`,
      input_message_content: {
        message_text: responseText
      }
    });
    
    // Добавляем альтернативный вариант с молитвой
    if (sortedDates.length > 0) {
      results.push({
        type: 'article',
        id: '2',
        title: '🙏 ' + responseText + ' (Господи, благослови)',
        description: 'С благословением',
        input_message_content: {
          message_text: responseText + ' (Господи, благослови сей день. Аминь)'
        }
      });
    }
    
    bot.answerInlineQuery(queryId, results, { cache_time: 60 });
    console.log(`Inline ответ: "${responseText}"`);
    
  } catch (error) {
    console.error('Ошибка при обработке inline запроса:', error);
    // Fallback ответ
    const results = [{
      type: 'article',
      id: '1',
      title: '❌ Ошибка обработки',
      description: 'Попробуйте еще раз',
      input_message_content: {
        message_text: queryText + ' (ошибка обработки)'
      }
    }];
    bot.answerInlineQuery(queryId, results, { cache_time: 1 });
  }
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
        // Создаем ответ в формате: "Исходная дата. Иными словами – православный ответ"
        const finalResponse = `${dateInfo.originalText}. Иными словами – ${formattedEvent}`;
        responseText = responseText.replace(dateInfo.originalText, finalResponse);
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