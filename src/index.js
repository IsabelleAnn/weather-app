import "./style.css";
import { getForecast } from "./data.js";

const inputBox = document.getElementById("location");
const form = document.querySelector("form");
const errorMsgs = document.querySelectorAll(".error");
const spanErr = document.getElementById("span-error");

let forecast = {};

form.addEventListener("submit", submitLocation);

async function submitLocation(event) {
  event.preventDefault();
  Array.from(errorMsgs).forEach((error) => {
    error.style.display = "none";
  });

  if (inputBox.value.trim()) {
    let userInput = inputBox.value;
    forecast = await getForecast(userInput);
    console.log(forecast);
  }
}

export function displayError(error) {
  spanErr.textContent = error;
  Array.from(errorMsgs).forEach((error) => {
    error.style.display = "block";
  });
}
