// 🧪 Тестирование функциональности бота без Telegram API

const { parseDate } = require('./dateParser');
const { getOrthodoxEvent } = require('./calendar');
const { formatResponse } = require('./formatter');

function testBot() {
  console.log('🕊️ Тестирование православного бота...\n');
  
  const testMessages = [
    "Встретимся в воскресенье",
    "До 25 декабря осталось мало времени", 
    "К 7 января подготовимся",
    "На 15 августа запланировано событие",
    "3 сентября будет важный день",
    "Завтра увидимся",
    "После 6 декабря начнется пост",
    "На следующее воскресенье пойдем"
  ];

  testMessages.forEach((message, index) => {
    console.log(`\n${index + 1}. Тестируем: "${message}"`);
    
    try {
      const dates = parseDate(message);
      
      if (dates.length === 0) {
        console.log('   ❌ Даты не найдены');
        return;
      }

      console.log(`   ✅ Найдено дат: ${dates.length}`);
      
      let responseText = message;
      
      // Сортируем по позиции в тексте (справа налево)
      const sortedDates = dates
        .map(d => ({ ...d, position: message.indexOf(d.originalText) }))
        .sort((a, b) => b.position - a.position);
      
      sortedDates.forEach(dateInfo => {
        const orthodoxEvent = getOrthodoxEvent(dateInfo.date);
        const formattedEvent = formatResponse(orthodoxEvent, dateInfo.case);
        
        console.log(`   📅 Дата: ${dateInfo.date.toLocaleDateString('ru-RU')}`);
        console.log(`   📝 Оригинал: "${dateInfo.originalText}"`);
        console.log(`   📿 Падеж: ${dateInfo.case}`);
        console.log(`   ⛪ Событие: ${orthodoxEvent.type} - ${orthodoxEvent.name}`);
        console.log(`   🎯 Замена: "${formattedEvent}"`);
        
        responseText = responseText.replace(dateInfo.originalText, formattedEvent);
      });
      
      console.log(`   💬 Итоговый ответ: "${responseText}"`);
      
    } catch (error) {
      console.log(`   ❌ Ошибка: ${error.message}`);
    }
  });

  console.log('\n🙏 Тестирование завершено! Слава Богу за все!');
}

// Запуск тестов
if (require.main === module) {
  testBot();
}

module.exports = { testBot };