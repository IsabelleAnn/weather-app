import "./style.css";
import { getForecast } from "./data.js";

const inputBox = document.getElementById("location");
const form = document.querySelector("form");
const errorMsg = document.getElementById("error");
const unitBtn = document.getElementById("unit-btn");
const fBtn = document.getElementById("f-unit-btn");
const cBtn = document.getElementById("c-unit-btn");
let forecast = {};

let imperials;
let metrics;
let currentUnit = "imperial";

async function displayDefault() {
  forecast = await getForecast("austin");
  displayForecast(forecast);
  imperials = document.querySelectorAll(".imperial");
  imperials.forEach((unit) => {
    unit.style.display = "block";
  });
  metrics = document.querySelectorAll(".metric");
  metrics.forEach((unit) => {
    unit.style.display = "none";
  });
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

unitBtn.addEventListener("click", changeUnitOnCLick);

function changeUnitOnCLick() {
  if (currentUnit === "imperial") {
    imperials = document.querySelectorAll(".imperial");
    imperials.forEach((unit) => {
      unit.style.display = "none";
    });
    metrics = document.querySelectorAll(".metric");
    metrics.forEach((unit) => {
      unit.style.display = "block";
    });
    currentUnit = "metric";
  } else {
    imperials = document.querySelectorAll(".imperial");
    imperials.forEach((unit) => {
      unit.style.display = "block";
    });
    metrics = document.querySelectorAll(".metric");
    metrics.forEach((unit) => {
      unit.style.display = "none";
    });
    currentUnit = "imperial";
  }
  if (fBtn.classList.contains("selected")) {
    fBtn.classList.remove("selected");
    cBtn.classList.add("selected");
  } else if (cBtn.classList.contains("selected")) {
    fBtn.classList.add("selected");
    cBtn.classList.remove("selected");
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
  const currentTempI = document.getElementById("current-temp-i");
  const currentTempM = document.getElementById("current-temp-m");
  const currentWindI = document.getElementById("current-wind-i");
  const currentWindM = document.getElementById("current-wind-m");
  const feelsLikeI = document.getElementById("feels-like-i");
  const feelsLikeM = document.getElementById("feels-like-m");

  currentTempI.textContent = forecast.current.measurements.imperial.temp;
  currentTempM.textContent = forecast.current.measurements.metric.temp;
  feelsLikeI.textContent = forecast.current.measurements.imperial.feelsLike;
  feelsLikeM.textContent = forecast.current.measurements.metric.feelsLike;
  currentWindI.textContent = forecast.current.measurements.imperial.wind;
  currentWindM.textContent = forecast.current.measurements.metric.wind;

  const currentHumidity = document.getElementById("current-humidity");
  const currentCity = document.getElementById("current-city");
  const currentTime = document.getElementById("current-time");
  const currentDate = document.getElementById("current-date");
  const currentSkies = document.getElementById("current-skies");
  const iconCurrent = document.getElementById("icon-current");

  currentHumidity.textContent = forecast.current.humidity;
  currentCity.textContent = forecast.location;
  currentTime.textContent = forecast.current.time;
  currentDate.textContent = forecast.current.date;
  currentSkies.textContent = forecast.current.skies;
  iconCurrent.src = getIconUrl(forecast.current.icon, forecast.current.time);
}

function displayDailyForecast(forecast) {
  const week = [...document.getElementById("daily-weather-container").children];
  console.log(week);
  week.forEach((day, i) => {
    day.children[0].textContent = forecast.hourly[`day${i + 1}`].date.slice(
      0,
      3
    );
    day.children[1].src = getIconUrl(forecast.hourly[`day${i + 1}`][0].icon);
    day.children[2].textContent =
      forecast.hourly[`day${i + 1}`][0].measurements.imperial.tempMax;
    day.children[4].textContent =
      forecast.hourly[`day${i + 1}`][0].measurements.metric.tempMax;
    day.children[6].textContent =
      forecast.hourly[`day${i + 1}`][0].measurements.imperial.tempMin;
    day.children[8].textContent =
      forecast.hourly[`day${i + 1}`][0].measurements.metric.tempMin;
  });
}

function displayHourlyForecast(forecast) {}

function changeBackground() {}

function getIconUrl(iconID) {
  console.log(iconID);
  return `http://openweathermap.org/img/wn/${iconID}@2x.png`;
}
