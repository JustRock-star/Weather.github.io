// Переводы для кодов погоды (берём только самые популярные)
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
  // ... можно добавить остальные коды по необходимости
};

function translateConditionByCode(code) {
  if (!weatherCodeTranslations[code]) return "Unknown";
  return weatherCodeTranslations[code][currentLanguage] || weatherCodeTranslations[code]["en"];
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

