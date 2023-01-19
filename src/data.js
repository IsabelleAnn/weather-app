import { format } from "date-fns";
import { fetchCurrentWeather, fetch5DayWeather } from "./apiCalls.js";

export async function processCurrentWeatherData(location) {
  let data = await fetchCurrentWeather(location);

  let currentWeather = {
    time: format(new Date(data.dt * 1000), "p"),
    date: format(new Date(data.dt * 1000), "PPPP"),
    icon: data.weather[0].icon,
    skies: data.weather[0].main,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity + "%",
    precipitation: (data.main.pop ? Math.trunc(data.main.pop * 100) : 0) + "%",
  };
  console.log(currentWeather);
  return currentWeather;
}

export async function process5DayWeatherData(location) {
  let data = await fetch5DayWeather(location);
  console.log("5 day", data);
  console.log("5 day", data.list);
  let dateStr = data.list[2].dt_txt.slice(0, 10);
  data.list.forEach((elem) => {
    if (dateStr === elem.dt_txt.slice(0, 10))
      console.log(elem.dt_txt.slice(0, 10));
  });

  let noonData = [];
  for (let i = 0; i < data.list.length; i += 8) {
    noonData.push(data.list[i]);
  }
  console.log("noon", noonData);
  let morningData = [];
  for (let i = 0; i < data.list.length; i += 8) {
    morningData.push(data.list[i]);
  }

  console.log("morning", morningData);
  let forecast = {};
  console.log(forecast);
}
