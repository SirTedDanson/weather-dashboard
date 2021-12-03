
// get current weather from API ----------------------------------------------------------------------
var getCurrent = function () {
  var currentWeather = "http://api.openweathermap.org/data/2.5/weather?q=Columbus&appid=d81dc018285004c32e878ad354aa6463";
  fetch(currentWeather).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        currentWeatherParse (data);
        console.log(data);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  });
};

// ---------- PARSE CURRENT WEATHER DATA ------------------
var currentWeatherParse = function (currentData) {
  // gather relavent current weather data
  var currentCity = currentData.name;
  var currentDay = new Date(currentData.dt*1000).toLocaleDateString("en-US");
  var currentIcon = currentData.weather[0].icon;
  var currentTemp = currentData.main.temp;
  var currentWind = currentData.wind.speed;
  var currentHumidity = currentData.main.humidity;
  var currentUV = currentData.main.temp;
  displayCurrent (currentCity, currentDay, currentIcon, currentTemp, currentWind, currentHumidity, currentUV)
};

// ===================================== DISPLAY CURRENT WEATHER ====================================
var displayCurrent = function (currentCity, currentDay, currentIcon, currentTemp, currentWind, currentHumidity, currentUV) {
  // container element
  var currentWeatherCont = $("#current-weather")
  var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + ".png")
  var city = $("<h2>").addClass("title").text(currentCity + " (" + currentDay + ") ");
  var temp = $("<p>").text(currentTemp);
  var wind = $("<p>").text(currentWind);
  var humidity = $("<p>").text(currentHumidity);
  var uv = $("<p>").text(currentUV);

  city.append(icon)
  currentWeatherCont.append(city, temp, wind, humidity, uv)
}

// get five day forecast from API -----------------------------------------------------------------
var getFiveDay = function () {
  var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?q=Columbus&appid=d81dc018285004c32e878ad354aa6463";
  fetch(fiveDayForecast).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        fiveDayDataParse (data);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  });
};
// ---------- PARSE FIVE DAY FORECAST DATA ------------------
var fiveDayDataParse = function (forecastData) {  
  // gather relavent five day forecast data
  for (var i = 0; i < forecastData.list.length; i=i+8) {
    var fiveDayDate = forecastData.list[i].dt_txt;
    var fiveDayTemp = forecastData.list[i].main.temp;
    var fiveDayWind = forecastData.list[i].wind.speed;
    var fiveDayHumidity = forecastData.list[i].main.humidity;
    var fiveDayicon = forecastData.list[i].weather.icon;
    console.log(fiveDayDate, fiveDayicon, fiveDayTemp, fiveDayWind, fiveDayHumidity);
    
    // display five day forecast on page
    displayFiveDay (fiveDayDate, fiveDayicon, fiveDayTemp, fiveDayWind, fiveDayHumidity);
  };
};

// ===================================== DISPLAY FIVE DAY FORECAST ====================================
var displayFiveDay = function (date, icon, temp, wind, humidity) {
  var fiveDayContainer = $("#five-day");
  // build daily weather data DOM elements
  var dayContainer = $("<div>").addClass("box column");
  var dayDate = $("<p>").text(date);
  var dayIcon = $("<i>").text(icon);
  var dayTemp = $("<p>").text(temp);
  var dayWind = $("<p>").text(wind);
  var dayHumidity = $("<p>").text(humidity);
  // append to page
  dayContainer.append(dayDate, dayIcon, dayTemp, dayWind, dayHumidity);
  fiveDayContainer.append(dayContainer);
};

// LAUNCH APPLICATION
getCurrent ();
getFiveDay ();