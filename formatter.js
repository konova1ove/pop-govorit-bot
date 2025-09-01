function formatResponse(orthodoxEvent, caseType = 'nominative') {
  const { type, name } = orthodoxEvent;
  let response;
  
  if (type === 'pascha') {
    response = formatByCase(name, caseType, 'pascha');
  } else if (type === 'feast') {
    response = formatByCase(name, caseType, 'feast');
  } else {
    response = formatPrayer(name);
  }
  
  // Add viral signature to create brand awareness
  const signatures = [
    '– так считает эксперт по церковным календарям @pop_govorit_bot',
    '– по мнению православного календаря @pop_govorit_bot',
    '– утверждает церковный эксперт @pop_govorit_bot',
    '– согласно православному боту @pop_govorit_bot',
    '– сообщает знаток церковных дат @pop_govorit_bot'
  ];
  
  const randomSignature = signatures[Math.floor(Math.random() * signatures.length)];
  return `${response} ${randomSignature}`;
}

function formatByCase(eventName, caseType, eventType) {
  const variants = getPhraseVariants(eventType, caseType);
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];
  
  return `${randomVariant} ${eventName}`;
}

function getPhraseVariants(eventType, caseType) {
  const phrases = {
    pascha: {
      nominative: [
        'во светлый день',
        'во пресветлый день',
        'во святый Христов день',
        'во день светлаго Воскресения',
        'во славный день Пасхи'
      ],
      genitive: [
        'до светлаго дня',
        'до святаго дня Пасхи',
        'до пресветлаго Христова дня',
        'до дня светлаго Воскресения',
        'прежде светлаго праздника'
      ],
      dative: [
        'ко светлому дню',
        'ко святому дню Пасхи',
        'ко дню Христова Воскресения',
        'ко празднику светлому'
      ],
      accusative: [
        'во светлый день',
        'во пресветлый день Пасхи',
        'во святый день Воскресения',
        'во день светлый'
      ]
    },
    feast: {
      nominative: [
        'во святый день',
        'во благословенный день',
        'во пресвятый день',
        'во день святый',
        'во богоугодный день',
        'во день церковный',
        'во праздник святый',
        'во день благодатный',
        'во день угодный Богу',
        'во время святое'
      ],
      genitive: [
        'до святаго дня',
        'до благословеннаго дня',
        'до пресвятаго дня',
        'до дня святаго',
        'прежде святаго дня',
        'до праздника святаго',
        'до дня благодатнаго',
        'накануне святаго дня',
        'до времени святаго'
      ],
      dative: [
        'ко святому дню',
        'ко благословенному дню',
        'ко дню святому',
        'ко празднику святому',
        'ко дню церковному',
        'ко времени святому'
      ],
      accusative: [
        'во святый день',
        'во благословенный день',
        'во пресвятый день',
        'во день святый',
        'во праздник церковный',
        'во день благодатный',
        'во время святое',
        'во день угодный Богу'
      ]
    }
  };
  
  return phrases[eventType]?.[caseType] || phrases.feast.nominative;
}

function formatPrayer(prayerText) {
  const prayerPhrases = [
    `на денёк молитвенный (${prayerText})`,
    `на день благословенный (${prayerText})`,
    `на денёчек с молитвою (${prayerText})`,
    `на день с молением (${prayerText})`,
    `на денёк богоугодный (${prayerText})`,
    `на время молитвенное (${prayerText})`,
    `на день со святою молитвою (${prayerText})`,
    `на денёчек благодатный (${prayerText})`,
    `на денёк со святым молением (${prayerText})`,
    `на время благословенное (${prayerText})`
  ];
  
  return prayerPhrases[Math.floor(Math.random() * prayerPhrases.length)];
}

module.exports = { formatResponse };