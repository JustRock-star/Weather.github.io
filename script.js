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

function fetchWeather() {
    fetch('https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=Yerevan&days=1&aqi=no&alerts=no')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fun1H(data.forecast.forecastday[0].hour);
        });
}

function fun1H(hours) {
    const t = translations[currentLanguage];
    container.innerHTML = `<h2 class="title">${t.weatherTitle}</h2>`;
    hours.forEach(hour => {
        let el = document.createElement('div');
        el.classList.add('hour-forecast');

        el.innerHTML = `
            <div class="forecast-time"><strong>${hour.time.split(' ')[1]}</strong></div>
            <div class="forecast-temp">${hour.temp_c}°C</div>
            <div class="forecast-condition">${hour.condition.text}</div>
            <div class="forecast-details">
                <p>${t.wind}: ${hour.wind_kph} km/h</p>
                <p>${t.humidity}: ${hour.humidity}%</p>
                <p>${t.rain}: ${hour.chance_of_rain}%</p>
            </div>
            <img class="forecast-icon" src="${hour.condition.icon}" alt="${hour.condition.text}" />
        `;

        container.appendChild(el);
    });
}

// Сразу получаем погоду при загрузке
fetchWeather();


// -------------------------
// Модальное окно языка
// -------------------------
const languageBtn = document.getElementById('languageBtn');
const modal = document.getElementById('languageModal');
const closeModal = document.getElementById('closeModal');
const languageForm = document.getElementById('languageForm');

// Показать модальное окно
languageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

// Закрыть модальное окно
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Закрыть при клике вне окна
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

// Применить выбранный язык
languageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedLang = languageForm.language.value;
    currentLanguage = selectedLang;

    const labels = translations[selectedLang];
    applyLanguage(labels);
    fetchWeather(); // обновить прогноз на выбранном языке

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

