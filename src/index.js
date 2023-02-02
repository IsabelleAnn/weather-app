import "./style.css";
import { getForecast } from "./data.js";

const imageSrcs = {
  clear: [
    "clear1.png",
    "clear2.png",
    "clear3.png",
    "clear4.png",
    "clear5.png",
    "clear6.png",
  ],
  clouds: ["clouds1.png", "clouds2.png", "clouds3.png", "clouds4.png"],
  mist: ["mist1.png", "mist2.png"],
  rain: ["rain1.png", "rain2.png", "rain3.png", "rain4.png", "rain5.png"],
  snow: ["snow1.png", "snow2.png", "snow3.png", "snow4.png", "snow5.png"],
};

const inputBox = document.getElementById("location");
const form = document.querySelector("form");
const errorMsg = document.getElementById("error");
const unitBtn = document.getElementById("unit-btn");
const fBtn = document.getElementById("f-unit-btn");
const cBtn = document.getElementById("c-unit-btn");
const backgroundImgDiv = document.getElementById("container");
let forecast = {};

let imperials;
let metrics;
let currentUnit = "imperial";

async function displayDefault() {
  forecast = await getForecast("austin");
  displayForecast(forecast);

  backgroundImgDiv.style.backgroundImage = getBackgroundImgSrc(
    forecast.current.skies,
    forecast.current.icon
  );
  imperials = document.querySelectorAll(".imperial");
  imperials.forEach((unit) => {
    unit.style.display = "inline-block";
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
      unit.style.display = "inline-block";
    });
    currentUnit = "metric";
  } else {
    imperials = document.querySelectorAll(".imperial");
    imperials.forEach((unit) => {
      unit.style.display = "inline-block";
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
  backgroundImgDiv.style.backgroundImage = getBackgroundImgSrc(
    forecast.current.skies,
    forecast.current.icon
  );
}

function displayCurrentForecast(forecast) {
  const currentTempI = document.getElementById("current-temp-i");
  const currentTempM = document.getElementById("current-temp-m");
  const currentWindI = document.getElementById("current-wind-i");
  const currentWindM = document.getElementById("current-wind-m");
  const feelsLikeI = document.getElementById("feels-like-i");
  const feelsLikeM = document.getElementById("feels-like-m");
  const highI = document.getElementById("high-i");
  const highM = document.getElementById("high-m");
  const lowI = document.getElementById("low-i");
  const lowM = document.getElementById("low-m");

  currentTempI.textContent = forecast.current.measurements.imperial.temp;
  currentTempM.textContent = forecast.current.measurements.metric.temp;
  feelsLikeI.textContent = forecast.current.measurements.imperial.feelsLike;
  feelsLikeM.textContent = forecast.current.measurements.metric.feelsLike;
  highI.textContent = forecast.current.measurements.imperial.tempMax;
  highM.textContent = forecast.current.measurements.metric.tempMax;
  lowI.textContent = forecast.current.measurements.imperial.tempMin;
  lowM.textContent = forecast.current.measurements.metric.tempMin;
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
  let dayCount = 1;
  if (
    forecast.hourly[`day${1}`].date == forecast.current.date ||
    forecast.hourly[`day${2}`].date == forecast.current.date
  ) {
    dayCount = 2;
  }

  week.forEach((day) => {
    day.children[0].textContent = forecast.hourly[`day${dayCount}`].date.slice(
      0,
      3
    );
    day.children[1].src = getIconUrl(forecast.hourly[`day${dayCount}`][0].icon);

    let maxTemps = getMax(forecast.hourly[`day${dayCount}`]);
    let minTemps = getMin(forecast.hourly[`day${dayCount}`]);
    day.children[2].textContent = maxTemps[0];
    day.children[4].textContent = maxTemps[1];
    day.children[6].textContent = minTemps[0];
    day.children[8].textContent = minTemps[1];
    dayCount++;
  });
}

function getMax(data) {
  let maxI = 0;
  let maxM = 0;
  for (const hour in data) {
    if (hour != "date") {
      if (maxI < data[hour].measurements.imperial.tempMax) {
        maxI = data[hour].measurements.imperial.tempMax;
        maxM = data[hour].measurements.metric.tempMax;
      }
    }
  }
  return [maxI, maxM];
}
function getMin(data) {
  let minI = data[0].measurements.imperial.tempMin;
  let minM = data[0].measurements.metric.tempMin;

  for (const hour in data) {
    if (hour != "date") {
      if (minI > data[hour].measurements.imperial.tempMin) {
        minI = data[hour].measurements.imperial.tempMin;
        minM = data[hour].measurements.metric.tempMin;
      }
    }
  }
  return [minI, minM];
}

function getBackgroundImgSrc(skies, icon) {
  let url;
  if (icon === "50d" || icon === "50n") {
    url = `url(../dist/images/${getImageRandomImgName("mist")})`;

    return url;
  }
  if (skies === "Snow") {
    url = `url(../dist/images/${getImageRandomImgName("snow")})`;

    return url;
  }
  if (skies === "Thunderstorm" || skies === "Drizzle" || skies === "Rain") {
    url = `url(../dist/images/${getImageRandomImgName("rain")})`;

    return url;
  }
  if (skies === "Clear") {
    url = `url(../dist/images/${getImageRandomImgName("clear")})`;

    return url;
  }
  if (skies === "Clouds") {
    url = `url(../dist/images/${getImageRandomImgName("clouds")})`;

    return url;
  }
}

function getImageRandomImgName(str) {
  let max = imageSrcs[str].length;
  let random = Math.floor(Math.random() * max);
  return imageSrcs[str][random];
}

function getIconUrl(iconID) {
  return `http://openweathermap.org/img/wn/${iconID}@2x.png`;
}
