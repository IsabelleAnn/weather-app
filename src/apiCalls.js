import { displayError } from "./index.js";

export async function fetchWeatherData(location) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=684ce14f2f89c01663054199c997c97e&units=imperial&lang=en`,
    { mode: "cors" }
  );
  let json = {};
  json.current = await response.json();

  try {
    if (json.current.cod == "200") {
      json.hourly = await fetchHourlyWeatherData(location);
      return json;
    } else {
      throw new Error(json.current.message);
    }
  } catch (error) {
    console.log(error.message);
    handleError(error.message);
    return;
  }
}

export async function fetchHourlyWeatherData(location) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=684ce14f2f89c01663054199c997c97e&units=imperial&lang=en`,
    { mode: "cors" }
  );
  let json = await response.json();
  try {
    if (json.cod == "200") {
      return json;
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    console.log(error.message);
    handleError(error.message);
    return;
  }
}

function handleError(error) {
  let errorStr = error.charAt(0).toUpperCase() + error.slice(1) + ".";
  displayError(errorStr);
}
