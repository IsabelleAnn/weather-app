import "./style.css";
import { getForecast } from "./data.js";

const inputBox = document.getElementById("location");
const form = document.querySelector("form");
const errorMsg = document.getElementById("error");
const unitBtn = document.getElementById("measurement-btns");
let forecast = {};

async function displayDefault() {
  forecast = await getForecast("austin");
  displayForecast(forecast);
}
displayDefault();

form.addEventListener("submit", submitLocation);
inputBox.value = "";

async function submitLocation(event) {
  event.preventDefault();
  errorMsg.style.display = "none";

  if (inputBox.value.trim()) {
    let userInput = inputBox.value;
    forecast = await getForecast(userInput);
    console.log(forecast);
    displayForecast(forecast);
    inputBox.value = "";
  }
}

export function displayError(error) {
  errorMsg.textContent = error;
  errorMsg.style.display = "block";
}

function displayForecast(forecast) {
  displayCurrentForecast(forecast);
  displayDailyForecast(forecast);

  console.log("display", forecast);
  // const currentTemp = document.getElementById("current-temp");
  // currentTemp.textContent = forecast.current.measurements.imperial.temp;
}

function displayCurrentForecast(forecast) {
  const currentTempF = document.getElementById("current-temp-F");
  const currentTempC = document.getElementById("current-temp-C");
  const currentFeelsLike = document.getElementById("current-feels-like");
  const currentHumidity = document.getElementById("current-humidity");
  const currentWind = document.getElementById("current-wind");
  const currentCity = document.getElementById("current-city");
  const currentTime = document.getElementById("current-time");
  const currentDate = document.getElementById("current-date");
  const currentSkies = document.getElementById("current-skies");
  const iconCurrent = document.getElementById("icon-current");

  currentTempF.textContent = forecast.current.measurements.imperial.temp;
  currentTempC.textContent = forecast.current.measurements.metric.temp;

  currentFeelsLike.textContent =
    forecast.current.measurements.imperial.feelsLike;

  currentHumidity.textContent = forecast.current.humidity;
  currentWind.textContent = forecast.current.measurements.imperial.wind;
  currentCity.textContent = forecast.location;
  currentTime.textContent = forecast.current.time;
  currentDate.textContent = forecast.current.date;
  currentSkies.textContent = forecast.current.skies;
  iconCurrent.src = getIconUrl(forecast.current.icon);
}

function displayDailyForecast(forecast) {}

function displayHourlyForecast(forecast) {}

function changeBackground() {}

function getIconUrl(iconID) {
  return `http://openweathermap.org/img/wn/${iconID}@2x.png`;
}
