let container = document.querySelector('.container');
let currentLanguage = 'en'; // по умолчанию English

const translations = {
  en: {
    countries: "Countries",
    language: "Language",
    account: "Account",
    contact: "Contact",
    footer: "ALL IS GOOD ©",
    weatherTitle: "Hourly Weather Forecast",
    wind: "Wind Speed",
    humidity: "Humidity",
    rain: "Chance of Rain"
  },
  ru: {
    countries: "Страны",
    language: "Язык",
    account: "Аккаунт",
    contact: "Контакт",
    footer: "ВСЁ ХОРОШО ©",
    weatherTitle: "Почасовой прогноз погоды",
    wind: "Скорость ветра",
    humidity: "Влажность",
    rain: "Вероятность дождя"
  },
  hy: {
    countries: "Երկրներ",
    language: "Լեզու",
    account: "Հաշիվ",
    contact: "Կապ",
    footer: "ԱՄԵՆ ԻՆՉ ԼԱՎ Է ©",
    weatherTitle: "Ժամային եղանակի կանխատեսում",
    wind: "Քամու արագություն",
    humidity: "Խոնավություն",
    rain: "Տեղումների հավանականություն"
  }
};

// Переводы погодных условий для армянского, потому что API не поддерживает lang=hy
const weatherConditionTranslations = {
  hy: {
    "Clear": "Մաքուր",
    "Sunny": "Արևոտ",
    "Partly cloudy": "Մասամբ ամպամած",
    "Cloudy": "Ամպամած",
    "Overcast": "Մառախլապատ",
    "Mist": "Մառախուղ",
    "Patchy rain possible": "Հնարավոր է թեթև անձրև",
    "Patchy snow possible": "Հնարավոր է թեթև ձյուն",
    "Thunderstorm": "Ամպրոպ",
    "Blizzard": "Ձյան փոթորիկ",
    "Fog": "Մառախուղ",
    "Light rain": "Թեթև անձրև",
    "Heavy rain": "Արագ անձրև",
    "Showers": "Ջրառատ անձրև",
    // Добавляй по необходимости
  }
};

function fetchWeather() {
  // Для armenian - lang= en, т.к. API не поддерживает hy
  const apiLang = currentLanguage === 'hy' ? 'en' : currentLanguage;

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=Yerevan&days=1&aqi=no&alerts=no&lang=${apiLang}`)
    .then(response => response.json())
    .then(data => fun1H(data.forecast.forecastday[0].hour));
}

function fun1H(hours) {
  const t = translations[currentLanguage];
  container.innerHTML = `<h2 class="title">${t.weatherTitle}</h2>`;

  hours.forEach(hour => {
    let conditionText = hour.condition.text;

    // Для армянского языка делаем ручной перевод условий
    if (currentLanguage === 'hy') {
      conditionText = weatherConditionTranslations.hy[conditionText] || conditionText;
    }

    let el = document.createElement('div');
    el.classList.add('hour-forecast');

    el.innerHTML = `
      <div class="forecast-time"><strong>${hour.time.split(' ')[1]}</strong></div>
      <div class="forecast-temp">${hour.temp_c}°C</div>
      <div class="forecast-condition">${conditionText}</div>
      <div class="forecast-details">
        <p>${t.wind}: ${hour.wind_kph} km/h</p>
        <p>${t.humidity}: ${hour.humidity}%</p>
        <p>${t.rain}: ${hour.chance_of_rain}%</p>
      </div>
      <img class="forecast-icon" src="${hour.condition.icon}" alt="${conditionText}" />
    `;

    container.appendChild(el);
  });
}

// Загружаем погоду при запуске
fetchWeather();

// --- Управление языком и модальным окном ---

const languageBtn = document.getElementById('languageBtn');
const modal = document.getElementById('languageModal');
const closeModal = document.getElementById('closeModal');
const languageForm = document.getElementById('languageForm');

languageBtn.addEventListener('click', e => {
  e.preventDefault();
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target == modal) modal.style.display = 'none';
});

languageForm.addEventListener('submit', e => {
  e.preventDefault();
  currentLanguage = languageForm.language.value;
  applyLanguage(translations[currentLanguage]);
  fetchWeather();
  modal.style.display = 'none';
});

function applyLanguage(labels) {
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks[0].textContent = labels.countries;
  navLinks[1].textContent = labels.language;
  navLinks[2].textContent = labels.account;
  navLinks[3].textContent = labels.contact;
  document.getElementById('fp').textContent = labels.footer;
}
