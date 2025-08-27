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