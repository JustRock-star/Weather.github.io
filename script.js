let container = document.querySelector('.container');
let currentLanguage = 'en';

const translations = {
  en: {
    countries: "Countries",
    language: "Language",
    account: "Account",
    contact: "Contact",
    footer: "ALL IS GOOD STUDIO ©",
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
    footer: "ВСЁ ХОРОШО СТУДИЯ ©",
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
    footer: "ԱՄԵՆ ԻՆՉ ԼԱՎ Է ՍՏՈՒԴԻԱ ©",
    weatherTitle: "Ժամային եղանակի կանխատեսում",
    wind: "Քամու արագություն",
    humidity: "Խոնավություն",
    rain: "Տեղումների հավանականություն"
  }
};

const weatherCodeTranslations = {
  1000: { en: "Clear", ru: "Ясно", hy: "Մաքուր" },
  1003: { en: "Partly cloudy", ru: "Переменная облачность", hy: "Մասամբ ամպամած" },
  1006: { en: "Cloudy", ru: "Облачно", hy: "Ամպամած" },
  1183: { en: "Light rain", ru: "Небольшой дождь", hy: "Թեթև անձրև" },
  1195: { en: "Heavy rain", ru: "Сильный дождь", hy: "Արագ անձրև" },
};

function translateConditionByCode(code) {
  return weatherCodeTranslations[code]?.[currentLanguage] || "Unknown";
}

function fetchWeather() {
  const apiLang = (currentLanguage === 'hy') ? 'en' : currentLanguage;
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=Yerevan&days=1&aqi=no&alerts=no&lang=${apiLang}`)
    .then(r => r.json())
    .then(d => fun1H(d.forecast.forecastday[0].hour));
}

function fun1H(hours) {
  const t = translations[currentLanguage];
  container.innerHTML = `<h2 class="title">${t.weatherTitle}</h2>`;
  hours.forEach(hour => {
    const conditionText = translateConditionByCode(hour.condition.code);
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
      <img class="forecast-icon" src="${hour.condition.icon}" alt="${conditionText}">
    `;
    container.appendChild(el);
  });
}

// INIT
fetchWeather();

// LANGUAGE SWITCH
const languageBtn = document.getElementById('languageBtn');
const modal = document.getElementById('languageModal');
const closeModal = document.getElementById('closeModal');
const languageForm = document.getElementById('languageForm');

languageBtn.addEventListener('click', e => {
  e.preventDefault();
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target == modal) modal.style.display = 'none'; });

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
