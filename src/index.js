import "./style.css";
import { getCurrentForecast, get5DayForecast } from "./data.js";

const inputBox = document.getElementById("location");
const form = document.querySelector("form");

form.addEventListener("submit", doSomething);

function doSomething(event) {
  event.preventDefault();
  if (inputBox.value) {
    let userInput = inputBox.value;
    console.log(userInput, "event type", event);
    get5DayForecast(userInput);
    getCurrentForecast(userInput);
  }
}
