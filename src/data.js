import { format, parseISO } from "date-fns";
import { fetchWeatherData } from "./apiCalls.js";

export async function getForecast(userInputLocation) {
  let data = await fetchWeatherData(userInputLocation);
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
  forecast.current.date = formatDate(getForecastDate(data.current));
  forecast.current.measurements.imperial.feelsLike = Math.trunc(
    data.current.main.feels_like
  );
  forecast.current.measurements.metric.feelsLike = Math.trunc(
    convertFtoC(data.current.main.feels_like)
  );

  //HOURLY
  let currentDate = data.hourly.list[0].dt_txt.slice(0, 10);
  let countDays = 1;
  let countHrs = 0;
  forecast.hourly = {};
  let dayTitle = "day";
  forecast.hourly[dayTitle + countDays] = {
    date: formatDate(getForecastDate(data.hourly.list[0])),
  };

  data.hourly.list.forEach((hour) => {
    let nextDate = hour.dt_txt.slice(0, 10);
    if (currentDate !== nextDate) {
      countDays++;
      countHrs = 0;
      forecast.hourly[dayTitle + countDays] = {
        date: formatDate(getForecastDate(hour)),
      };
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
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
    };
    let metric = {};
    for (const temp in imperial) {
      imperial[temp] = Math.trunc(imperial[temp]);
      metric[temp] = Math.trunc(convertFtoC(imperial[temp]));
    }
    this.measurements = {
      imperial,
      metric,
    };
    imperial.wind = Math.trunc(data.wind.speed);
    metric.wind = Math.trunc(convertMPHtoMPS(data.wind.speed));

    this.time = formatTime(getForecastDate(data));

    this.icon = data.weather[0].icon;
    this.skies = data.weather[0].main;
    this.humidity = data.main.humidity;
    if (data.pop) {
      this.precipitation = Math.trunc(data.pop * 100);
    }
  }
}

function getForecastDate(data) {
  //hourly:
  if (data.hasOwnProperty("dt_txt")) {
    return data.dt_txt;
  }
  //current:
  let date = new Date((data.dt + data.timezone) * 1000);

  const makeTwoDigit = (num) => {
    return ("0" + num).slice(-2);
  };

  let dateStr = `${date.getUTCFullYear()}-${makeTwoDigit(
    date.getUTCMonth() + 1
  )}-${makeTwoDigit(date.getUTCDate())} ${makeTwoDigit(
    date.getUTCHours()
  )}:${makeTwoDigit(date.getUTCMinutes())}:${makeTwoDigit(
    date.getUTCSeconds()
  )}`;

  return dateStr;
}

function formatDate(date) {
  return format(parseISO(date), "EEEE, MMM. do, yyyy");
}

function formatTime(date) {
  return format(parseISO(date), "h:mmaaa");
}

function convertFtoC(fTemp) {
  return Math.trunc(((fTemp - 32) * 5) / 9);
}

function convertMPHtoMPS(mphSpeed) {
  return (mphSpeed * 1609.34) / 3600;
}
