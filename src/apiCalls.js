export async function fetchCurrentWeather(location) {
  try {
    // let coordinates = await fetchCoordinates(location);

    // let response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=684ce14f2f89c01663054199c997c97e&units=imperial`,
    //   { mode: "cors" }
    // );

    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=684ce14f2f89c01663054199c997c97e&units=imperial&lang=en`,
      { mode: "cors" }
    );

    let json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }
}

export async function fetch5DayWeather(location) {
  try {
    // let coordinates = await fetchCoordinates(location);

    // let response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=684ce14f2f89c01663054199c997c97e&units=imperial&lang=en`,
    //   { mode: "cors" }
    // );

    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=684ce14f2f89c01663054199c997c97e&units=imperial&lang=en`,
      { mode: "cors" }
    );
    let json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }
}

async function fetchCoordinates(location) {
  console.log(location);
  try {
    let response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&lang=en&appid=684ce14f2f89c01663054199c997c97e`,
      { mode: "cors" }
    );

    let json = await response.json();
    let locationData = json[0];
    let coordinates = [locationData.lat, locationData.lon];

    return coordinates;
  } catch (error) {
    console.log(error);
    console.log("Location not found");
    return "Location not found";
  }
}
