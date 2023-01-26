import { format, parseISO } from "date-fns";
import { DateTime } from "luxon";
import { fetchWeatherData } from "./apiCalls.js";

export async function getForecast(userInputLocation) {
  let data = await fetchWeatherData(userInputLocation);
  console.log(data);
  if (data) {
    let forecast = processWeatherData(data);
    return forecast;
  }
  return;
}

function processWeatherData(data) {
  let forecast = {};

  //CURRENT
  forecast.current = new WeatherData(data.current);
  forecast.location = data.current.name + ", " + data.current.sys.country;

  forecast.currentTimeInLocation = {};

  //HOURLY
  let currentDate = data.hourly.list[0].dt_txt.slice(0, 10);
  let countDays = 1;
  let countHrs = 0;
  forecast.hourly = {};
  let dayTitle = "day";
  forecast.hourly[dayTitle + countDays] = {};
  data.hourly.list.forEach((hour) => {
    let nextDate = hour.dt_txt.slice(0, 10);
    if (currentDate !== nextDate) {
      countDays++;
      countHrs = 0;
      forecast.hourly[dayTitle + countDays] = {};
    }
    forecast.hourly[dayTitle + countDays][countHrs] = new WeatherData(hour);
    countHrs++;
    currentDate = nextDate;
  });

  return forecast;
}

class WeatherData {
  constructor(data) {
    let imperial = {
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
    };
    let metric = {};
    for (const temp in imperial) {
      imperial[temp] = Math.trunc(imperial[temp]);
      metric[temp] = Math.trunc(convertFtoC(imperial[temp]));
    }

    this.temps = {
      imperial,
      metric,
    };

    this.time = formatDate(getDate(data));
    this.date = formatTime(getDate(data));
    this.icon = data.weather[0].icon;
    this.skies = data.weather[0].main;
    this.humidity = data.main.humidity + "%";
    this.precipitation = (data.pop ? Math.trunc(data.pop * 100) : 0) + "%";
  }
}

function getDate(data) {
  if (data.hasOwnProperty("dt_txt")) {
    let date = parseISO(data.dt_txt);

    return date;
  }

  let date = new Date((data.dt + data.timezone) * 1000);

  let dateStr = parseISO(
    `${date.getUTCFullYear()}:${date.getUTCMonth()}:${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
  );
  return dateStr;
}

function formatDate(date) {
  return format(date, "PPPP");
}

function formatTime(time) {
  return format(time * 1000, "p");
}

function convertFtoC(fTemp) {
  return Math.trunc(((fTemp - 32) * 5) / 9);
}
