import "./style.css";
import { processCurrentWeatherData, get5DayForecast } from "./data.js";

processCurrentWeatherData("austin, tx, us");
get5DayForecast("austin, tx, us");
