const apiKey = '7310b98676974e0989d132026241010';

const weatherEmojis = {
    "Clear": "☀️",
    "Partly cloudy": "🌤️",
    "Overcast": "☁️",
    "Rain": "🌧️",
    "Moderate rain": "🌧️",
    "Heavy rain": "🌧️",
    "Light rain": "🌦️",
    "Thunderstorm": "⛈️",
    "Snow": "❄️",
    "Fog": "💨",
    "Drizzle": "🌦️",
    "Mist": "💨",
    "Patchy rain nearby": "🌦️",
    "Sunny": "☀️",
};

async function getWeather() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=auto:ip&days=7`);
        const data = await response.json();

        if (data.error) {
            console.error(data.error.message);
            displayErrorMessage(data.error.message); // Display error message
            return;
        }

        document.getElementById('current-temp').textContent = `${data.current.temp_c}°C`;
        document.getElementById('weather-description').textContent = data.current.condition.text;
        document.getElementById('current-icon').textContent = weatherEmojis[data.current.condition.text] || "❓";
        document.getElementById('current-location').textContent = `${data.location.name}, ${data.location.region}`;

        changeBackgroundColor(data.current.condition.text);
        displayTodayWeather(data);
        displaySunriseSunset(data);
        displayWeeklyWeather(data);
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        displayErrorMessage("Could not retrieve weather data. Please try again later."); // Display error message
    }
}

function changeBackgroundColor(condition) {
    const shades = {
        "Clear": ['#ffeb3b', '#ffd54f'],
        "Partly cloudy": ['#ffd54f', '#fff9c4'],
        "Overcast": ['#90a4ae', '#607d8b'],
        "Rain": ['#2196f3', '#0d47a1'],
        "Thunderstorm": ['#f44336', '#b71c1c'],
        "Snow": ['#ffffff', '#e0e0e0'],
        "Fog": ['#9e9e9e', '#424242'],
        "Drizzle": ['#bbdefb', '#90caf9'],
        "Mist": ['#b0bec5', '#78909c'],
        "Default": ['#a1c4fd', '#c6ff00'],
    };

    const fadeColors = shades[condition] || shades["Default"];
    document.body.style.background = `linear-gradient(to right, ${fadeColors.join(', ')})`;
}

function displayTodayWeather(data) {
    const todayWeatherDiv = document.getElementById('today-weather');
    todayWeatherDiv.innerHTML = `
        <div class="today-weather-box">
            <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
            <p><strong>Condition:</strong> ${data.current.condition.text} ${weatherEmojis[data.current.condition.text]}</p>
            <p><strong>Rain Expected:</strong> ${data.current.precip_mm > 0 ? `Yes, ${data.current.precip_mm} mm` : 'No'}</p>
            <p><strong>Wind Speed:</strong> ${data.current.wind_kph} km/h</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        </div>
    `;
}

function displaySunriseSunset(data) {
    const sunrise = data.forecast.forecastday[0].astro.sunrise;
    const sunset = data.forecast.forecastday[0].astro.sunset;

    document.getElementById('sunrise-label').textContent = sunrise;
    document.getElementById('sunset-label').textContent = sunset;

    animateSun(sunset);
}

function animateSun(sunset) {
    const sunElement = document.getElementById('sun');

    // Reset position and opacity of the sun
    sunElement.style.left = '0%'; 

    // Move the sun to the end of the bar
    setTimeout(() => {
        sunElement.style.left = '100%'; // Sun moves to the end of the slider bar
    }, 1000); // Start the animation after 1 second
}

function displayWeeklyWeather(data) {
    const weeklyWeatherDiv = document.getElementById('weekly-weather');
    const weeklyData = data.forecast.forecastday;

    weeklyWeatherDiv.innerHTML = '';
    weeklyData.forEach(day => {
        const weatherIcon = weatherEmojis[day.day.condition.text] || "❓"; // Fallback emoji
        weeklyWeatherDiv.innerHTML += `
            <div class="day-forecast">
                <strong>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</strong>: 
                ${day.day.avgtemp_c}°C (${weatherIcon} - ${day.day.condition.text})
            </div>
        `;
    });
}

function displayErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.textContent = message;

    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = ''; // Clear previous content
    currentWeatherDiv.appendChild(errorDiv); // Append error message
}

getWeather();
