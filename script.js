let container = document.querySelector('.container')

fetch('https://api.weatherapi.com/v1/forecast.json?key=bc2b6d561b0c4c919e1113322252904&q=Yerevan&days=1&aqi=no&alerts=no')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        fun1H(data.forecast.forecastday[0].hour)
    })

function fun1H(hours) {
    container.innerHTML = `<h2 class="title">Hourly Weather Forecast</h2>`
    hours.forEach(hour => {
        let el = document.createElement('div')
        el.classList.add('hour-forecast')

        el.innerHTML = `
            <div class="forecast-time"><strong>${hour.time.split(' ')[1]}</strong></div>
            <div class="forecast-temp">${hour.temp_c}°C</div>
            <div class="forecast-condition">${hour.condition.text}</div>
            <div class="forecast-details">
                <p>Wind Speed: ${hour.wind_kph} km/h</p>
                <p>Humidity: ${hour.humidity}%</p>
                <p>Chance of Rain: ${hour.chance_of_rain}%</p>
            </div>
            <img class="forecast-icon" src="${hour.condition.icon}" alt="${hour.condition.text}" />
        `

        container.appendChild(el)
    })

}
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

    switch (selectedLang) {
        case 'en':
            applyLanguage({
                countries: "Countries",
                language: "Language",
                account: "Account",
                contact: "Contact",
                footer: "ALL IS GOOD ©"
            });
            break;
        case 'ru':
            applyLanguage({
                countries: "Страны",
                language: "Язык",
                account: "Аккаунт",
                contact: "Контакт",
                footer: "ВСЁ ХОРОШО ©"
            });
            break;
        case 'hy':
            applyLanguage({
                countries: "Երկրներ",
                language: "Լեզու",
                account: "Հաշիվ",
                contact: "Կապ",
                footer: "ԱՄԵՆ ԻՆՉ ԼԱՎ Է ©"
            });
            break;
    }

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
