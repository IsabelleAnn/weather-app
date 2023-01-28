import "./style.css";
import { getForecast } from "./data.js";

const inputBox = document.getElementById("location");
const form = document.querySelector("form");
const errorMsg = document.getElementById("error");
const spanErr = document.getElementById("span-error");

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
  console.log("display", forecast);
  const currentTemp = document.getElementById("current-temp");
  // currentTemp.textContent = forecast.current.temps.imperial.temp;
}
