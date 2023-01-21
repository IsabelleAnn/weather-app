import { format } from "date-fns";
import { fetchCurrentWeather, fetch5DayWeather } from "./apiCalls.js";

export async function processCurrentWeatherData(location) {
  let data = await fetchCurrentWeather(location);
  console.log("current data", data);

  let currentWeather = new WeatherData(data);
  // let currentWeather = {
  //   time: formatTime(getTimeStamp(data)),
  //   date: formatDate(getTimeStamp(data)),
  //   icon: data.weather[0].icon,
  //   skies: data.weather[0].main,
  //   temp: data.main.temp,
  //   feelsLike: data.main.feels_like,
  //   tempMin: data.main.temp_min,
  //   tempMax: data.main.temp_max,
  //   humidity: data.main.humidity + "%",
  //   precipitation: (data.main.pop ? Math.trunc(data.main.pop * 100) : 0) + "%",
  // };

  let processedData = console.log("current", currentWeather);
  return currentWeather;
}

function processData(data) {
  if (data.hasOwnProperty("list")) {
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

class WeatherData {
  constructor(data) {
    if (data.hasOwnProperty("list")) {
      this.time = formatTime(getTimeStamp(data.list));
      this.date = formatDate(getTimeStamp(data.list));
      this.icon = data.list.weather[0].icon;
      this.skies = data.list.weather[0].main;
      this.temp = data.list.main.temp;
      this.feelsLike = data.list.main.feels_like;
      this.tempMin = data.list.main.temp_min;
      this.tempMax = data.list.main.temp_max;
      this.humidity = data.list.main.humidity + "%";
      this.precipitation = data.list.pop * 100 + "%";
    } else {
      this.time = formatTime(getTimeStamp(data));
      this.date = formatDate(getTimeStamp(data));
      this.icon = data.weather[0].icon;
      this.skies = data.weather[0].main;
      this.temp = data.main.temp;
      this.feelsLike = data.main.feels_like;
      this.tempMin = data.main.temp_min;
      this.tempMax = data.main.temp_max;
      this.humidity = data.main.humidity + "%";
      this.precipitation = data.pop * 100 + "%";
    }
  }
}

function process5DayWeatherData(data) {
  let currentDate = data.list[0].dt_txt.slice(0, 10);
  let count = 1;
  let hourlyWeatherData = {};
  hourlyWeatherData["day" + count] = {};
  data.list.forEach((elem) => {
    if (currentDate !== elem.dt_txt.slice(0, 10)) {
      count++;
      hourlyWeatherData["day" + count] = {};
    }

    // hourlyWeatherData["day" + count][format(new Date(elem.dt_txt), "haaa")] = {
    //   time: formatTime(getTimeStamp(elem)),
    //   date: formatDate(getTimeStamp(elem)),
    //   icon: elem.weather[0].icon,
    //   skies: elem.weather[0].main,
    //   temp: elem.main.temp,
    //   feelsLike: elem.main.feels_like,
    //   tempMin: elem.main.temp_min,
    //   tempMax: elem.main.temp_max,
    //   humidity: elem.main.humidity + "%",
    //   precipitation: elem.pop * 100 + "%",
    // };

    currentDate = elem.dt_txt.slice(0, 10);
  });

  console.log("hourly", hourlyWeatherData);
}

// function process5DayWeatherData(data) {
//   let currentDate = data.list[0].dt_txt.slice(0, 10);
//   let count = 1;
//   let hourlyWeatherData = {};
//   hourlyWeatherData["day" + count] = {};
//   data.list.forEach((elem) => {
//     if (currentDate !== elem.dt_txt.slice(0, 10)) {
//       count++;
//       hourlyWeatherData["day" + count] = {};
//     }

//     hourlyWeatherData["day" + count][format(new Date(elem.dt_txt), "haaa")] = {
//       time: formatTime(getTimeStamp(elem)),
//       date: formatDate(getTimeStamp(elem)),
//       icon: elem.weather[0].icon,
//       skies: elem.weather[0].main,
//       temp: elem.main.temp,
//       feelsLike: elem.main.feels_like,
//       tempMin: elem.main.temp_min,
//       tempMax: elem.main.temp_max,
//       humidity: elem.main.humidity + "%",
//       precipitation: elem.pop * 100 + "%",
//     };

//     currentDate = elem.dt_txt.slice(0, 10);
//   });

//   console.log("hourly", hourlyWeatherData);
// }

export async function get5DayForecast(location) {
  let data = await fetch5DayWeather(location);
  console.log("5 day data", data);
  let forecast = process5DayWeatherData(data);
  return forecast;
}
