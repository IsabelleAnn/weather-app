import { format } from "date-fns";
import { fetchCurrentWeather, fetch5DayWeather } from "./apiCalls.js";

export async function get5DayForecast(location) {
  try {
    let data = await fetch5DayWeather(location);
    console.log("5 day data", data);
    let forecast = processWeatherData(data);
    return forecast;
  } catch (error) {
    console.log(error);
    return "Location not found - get5Day";
  }
}

export async function getCurrentForecast(location) {
  try {
    let data = await fetchCurrentWeather(location);
    console.log("current data", data);
    let forecast = processWeatherData(data);
    return forecast;
  } catch (error) {
    console.log(error);
    return "Location not found - get current";
  }
}

function processWeatherData(data) {
  if (data.hasOwnProperty("list")) {
    let currentDate = data.list[0].dt_txt.slice(0, 10);
    let countDays = 1;
    let countHrs = 0;
    let hourlyWeatherData = {
      location: data.city.name + ", " + data.city.country,
    };
    let dayTitle = "day";
    hourlyWeatherData[dayTitle + countDays] = {};

    data.list.forEach((hour) => {
      let nextDate = hour.dt_txt.slice(0, 10);
      if (currentDate !== nextDate) {
        countDays++;
        countHrs = 0;
        hourlyWeatherData[dayTitle + countDays] = {};
      }
      hourlyWeatherData[dayTitle + countDays][countHrs] = new WeatherData(hour);
      countHrs++;
      currentDate = nextDate;
    });
    console.log("my hourly forecast:", hourlyWeatherData);
    return hourlyWeatherData;
  }

  let currentWeather = new WeatherData(data);
  currentWeather.location = data.name + ", " + data.sys.country;

  console.log("my current forecast:", currentWeather);

  return currentWeather;
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
    this.time = formatTime(getTimeStamp(data));
    this.date = formatDate(getTimeStamp(data));
    this.icon = data.weather[0].icon;
    this.skies = data.weather[0].main;
    this.humidity = data.main.humidity + "%";
    this.precipitation = (data.pop ? Math.trunc(data.pop * 100) : 0) + "%";
  }
}

function getTimeStamp(data) {
  if (data.hasOwnProperty("dt")) {
    return data.dt;
  }
  return data.list.dt_txt;
}

function formatDate(date) {
  return format(date * 1000, "PPPP");
}

function formatTime(time) {
  return format(time * 1000, "p");
}

function convertFtoC(fTemp) {
  return Math.trunc(((fTemp - 32) * 5) / 9);
}
