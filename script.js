let container = document.querySelector('.container');
let currentLanguage = 'en';

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

const weatherConditionTranslations = {
  ru: {
    "Clear": "Ясно",
    "Sunny": "Солнечно",
    "Partly cloudy": "Переменная облачность",
    "Overcast": "Пасмурно",
    "Cloudy": "Облачно",
    "Light rain": "Легкий дождь",
    "Moderate rain": "Умеренный дождь",
    "Heavy rain": "Сильный дождь",
    "Mist": "Туман",
    "Patchy rain possible": "Возможен кратковременный дождь",
    "Patchy snow possible": "Возможен кратковременный снег",
    "Blizzard": "Метель",
    // Можно добавить больше по необходимости
  },
  hy: {
    "Clear": "Մաքուր",
    "Sunny": "Արևոտ",
    "Partly cloudy": "Մասամբ ամպամած",
    "Overcast": "Մառախլապատ",
    "Cloudy": "Ամպամած",
    "Light rain": "Թեթև անձրև",
    "Moderate rain": "Միջին անձրև",
    "Heavy rain": "Արագ անձրև",
    "Mist": "Մառախուղ",
    "Patchy rain possible": "Հնարավոր է թեթև անձրև",
    "Patchy snow possible": "Հնարավոր է թեթև ձյուն",
    "Blizzard": "Ձյան փոթորիկ",
    // Добавляй по мере необходимости
  }
};

function fetchWeather() {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=Yerevan&days=1&aqi=no&alerts=no&lang=${currentLanguage}`)
    .then(response => response.json())
    .then(data => fun1H(data.forecast.forecastday[0].hour))
    .catch(err => {
      container.innerHTML = `<p>Ошибка загрузки данных</p>`;
      console.error(err);
    });
}

function translateCondition(text) {
  if (currentLanguage === 'en') return text;
  const dict = weatherConditionTranslations[currentLanguage];
  return dict && dict[text] ? dict[text] : text;
}

function fun1H(hours) {
  const t = translations[currentLanguage];
  container.innerHTML = `<h2 class="title">${t.weatherTitle}</h2>`;
  hours.forEach(hour => {
    const conditionText = translateCondition(hour.condition.text);
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

fetchWeather();

const languageBtn = document.getElementById('languageBtn');
const modal = document.getElementById('languageModal');
const closeModal = document.getElementById('closeModal');
const languageForm = document.getElementById('languageForm');

languageBtn.addEventListener('click', e => {
  e.preventDefault();
  modal.style.display = 'block';
});
closeModal.addEventListener('click', () => modal.style.display = 'none');
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



