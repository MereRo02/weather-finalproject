function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" alt="weather icon" />`;
}

function searchCity(city) {
  let apiKey = "af100of073be0141d3a3t336d3db1ff1";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
   let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHTML = "<div class='forecast'>";
  let days = response.data.daily;

  days.slice(1, 6).forEach(function (day) {
    let date = new Date(day.time * 1000);
    let options = { weekday: "short" };
    let dayName = date.toLocaleDateString("en-US", options);

    forecastHTML += `
      <div class="forecast-day">
        <div class="forecast-day-name">${dayName}</div>
        <img src="${day.condition.icon_url}" class="forecast-icon" alt="${day.condition.description}" />
        <div class="forecast-temperatures">
          <span class="forecast-temp-max">${Math.round(day.temperature.maximum)}°</span> /
          <span class="forecast-temp-min">${Math.round(day.temperature.minimum)}°</span>
        </div>
      </div>
    `;
  });

  forecastHTML += "</div>";
  document.querySelector("#forecast").innerHTML = forecastHTML;
}


function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("");