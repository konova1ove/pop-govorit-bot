function parseDate(text) {
  const results = [];
  const now = new Date();
  
  // Простые паттерны без внешних библиотек
  const patterns = [
    // Полные даты: "25 декабря", "3 января 2026"
    {
      regex: /(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(\d{4}))?/gi,
      handler: (match) => {
        const day = parseInt(match[1]);
        const month = getMonthNumber(match[2]);
        const year = match[3] ? parseInt(match[3]) : now.getFullYear();
        return new Date(year, month, day);
      }
    },
    // Числовые даты: "25.12", "03.09.2026"
    {
      regex: /(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?/g,
      handler: (match) => {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = match[3] ? parseInt(match[3]) : now.getFullYear();
        return new Date(year, month, day);
      }
    },
    // Завтра
    {
      regex: /(завтра)/gi,
      handler: () => {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      }
    },
    // Послезавтра
    {
      regex: /(послезавтра)/gi,
      handler: () => {
        const dayAfterTomorrow = new Date(now);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        return dayAfterTomorrow;
      }
    },
    // Дни недели: "в воскресенье", "в субботу", "в это воскресенье"
    {
      regex: /(в\s+(?:это\s+|ближайшее\s+|следующее\s+)?(воскресенье|понедельник|вторник|среду|четверг|пятницу|субботу))/gi,
      handler: (match) => {
        const fullMatch = match[1]; // Полное совпадение
        const dayName = match[2].toLowerCase(); // День недели
        return getNextWeekday(dayName);
      }
    },

  ];

  for (const pattern of patterns) {
    // Сброс lastIndex для глобальных регексов
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const date = pattern.handler(match);
      if (date && !isNaN(date.getTime())) {
        results.push({
          date: date,
          originalText: match[0],
          case: detectCase(text, match.index)
        });
      }
      // Предотвращаем бесконечный цикл для non-global regex
      if (!pattern.regex.global) break;
    }
  }

  // Удаляем дубликаты по originalText
  const uniqueResults = [];
  const seen = new Set();
  
  for (const result of results) {
    if (!seen.has(result.originalText)) {
      seen.add(result.originalText);
      uniqueResults.push(result);
    }
  }
  
  return uniqueResults;
}

function getMonthNumber(monthName) {
  const months = {
    'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
    'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
    'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
  };
  return months[monthName.toLowerCase()] || 0;
}

function getNextWeekday(dayName) {
  const days = {
    'понедельник': 1, 'вторник': 2, 'среда': 3, 'среду': 3, 'четверг': 4,
    'пятница': 5, 'пятницу': 5, 'суббота': 6, 'субботу': 6, 'воскресенье': 0
  };
  
  const today = new Date();
  const targetDay = days[dayName] || 0;
  const currentDay = today.getDay();
  
  let daysAhead = targetDay - currentDay;
  if (daysAhead <= 0) daysAhead += 7;
  
  const result = new Date(today);
  result.setDate(today.getDate() + daysAhead);
  return result;
}

function detectCase(text, position) {
  // Получаем слово перед датой
  const beforeText = text.substring(Math.max(0, position - 50), position).trim();
  const words = beforeText.split(/\s+/);
  const lastWord = words[words.length - 1]?.toLowerCase() || '';
  
  // Проверяем последнее слово перед датой
  if (['\u0434\u043e', '\u0441', '\u043e\u0442', '\u0438\u0437', '\u0431\u0435\u0437', '\u0443', '\u0434\u043b\u044f', '\u043e\u043a\u043e\u043b\u043e', '\u043f\u0440\u043e\u0442\u0438\u0432', '\u043f\u043e\u0441\u043b\u0435', '\u043d\u0430\u043a\u0430\u043d\u0443\u043d\u0435'].includes(lastWord)) {
    return 'genitive';
  }
  if (['\u043a', '\u043a\u043e', '\u043f\u043e'].includes(lastWord)) {
    return 'dative'; 
  }
  if (['\u0432', '\u0432\u043e', '\u043d\u0430', '\u0437\u0430', '\u043f\u043e\u0434', '\u043d\u0430\u0434', '\u0447\u0435\u0440\u0435\u0437'].includes(lastWord)) {
    return 'accusative';
  }
  
  return 'nominative';
}

module.exports = { parseDate };