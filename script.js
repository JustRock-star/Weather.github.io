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

// Переводы для кодов погоды (берём самые популярные коды)
const weatherCodeTranslations = {
  1000: { en: "Clear", ru: "Ясно", hy: "Մաքուր" },
  1003: { en: "Partly cloudy", ru: "Переменная облачность", hy: "Մասամբ ամպամած" },
  1006: { en: "Cloudy", ru: "Облачно", hy: "Ամպամած" },
  1009: { en: "Overcast", ru: "Пасмурно", hy: "Մառախլապատ" },
  1030: { en: "Mist", ru: "Туман", hy: "Մառախուղ" },
  1063: { en: "Patchy rain possible", ru: "Возможен кратковременный дождь", hy: "Հնարավոր է թեթև անձրև" },
  1066: { en: "Patchy snow possible", ru: "Возможен кратковременный снег", hy: "Հնարավոր է թեթև ձյուն" },
  1087: { en: "Thunderstorm", ru: "Гроза", hy: "Ամպրոպ" },
  1114: { en: "Blizzard", ru: "Метель", hy: "Ձյան փոթորիկ" },
  1135: { en: "Fog", ru: "Туман", hy: "Մառախուղ" },
  1180: { en: "Light rain", ru: "Небольшой дождь", hy: "Թեթև անձրև" },
  1183: { en: "Light rain", ru: "Небольшой дождь", hy: "Թեթև անձրև" },
  1186: { en: "Moderate rain", ru: "Умеренный дождь", hy: "Միջին անձրև" },
  1195: { en: "Heavy rain", ru: "Сильный дождь", hy: "Արագ անձրև" },
  // можно добавить остальные по необходимости
};

function translateConditionByCode(code) {
  if (!weatherCodeTranslations[code]) return "Unknown";
  return weatherCodeTranslations[code][currentLanguage] || weatherCodeTranslations[code]["en"];
}

function fetchWeather() {
  // API поддерживает lang=en и lang=ru, для hy будем использовать en и ручной перевод
  const apiLang = (currentLanguage === 'hy') ? 'en' : currentLanguage;

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=Yerevan&days=1&aqi=no&alerts=no&lang=${apiLang}`)
    .then(response => response.json())
    .then(data => fun1H(data.forecast.forecastday[0].hour));
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
      <img class="forecast-icon" src="${hour.condition.icon}" alt="${conditionText}" />
    `;

    container.appendChild(el);
  });
}

// Инициализация при загрузке
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

// --- Language Modal ---
const languageBtn = document.getElementById('languageBtn');
const languageModal = document.getElementById('languageModal');
const closeModal = document.getElementById('closeModal');
const languageForm = document.getElementById('languageForm');

languageBtn.addEventListener('click', e => {
  e.preventDefault();
  languageModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  languageModal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === languageModal) languageModal.style.display = 'none';
});

// --- Donate Modal ---
const donateBtn = document.getElementById('donateBtn');
const donateModal = document.getElementById('donateModal');
const closeDonate = document.getElementById('closeDonate');
const confirmDonate = document.getElementById('confirmDonate');
const donateAmount = document.getElementById('donateAmount');

donateBtn.addEventListener('click', e => {
  e.preventDefault();
  donateModal.style.display = 'block';
});

closeDonate.addEventListener('click', () => {
  donateModal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === donateModal) donateModal.style.display = 'none';
});

const myWallet = "0x00C48687d0C85e4cc1D545137Ce18E33fB5eF1c8";

confirmDonate.addEventListener('click', () => {
  const amount = donateAmount.value;
  // Ссылка для Bitget Wallet (откроется на телефоне)
  const url = `ethereum:${myWallet}`;
  
  // Если Bitget не подхватит, хотя бы скопируем адрес
  navigator.clipboard.writeText(myWallet)
    .then(() => alert(`💸 Адрес скопирован:\n${myWallet}\nВведите сумму ${amount} USDT вручную в Bitget Wallet.`));

  // Попробуем открыть кошелек
  window.location.href = url;
});



