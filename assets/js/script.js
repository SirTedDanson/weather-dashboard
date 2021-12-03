

// get current weather from API ----------------------------------------------------------------------
var getCurrent = function (searchedCity) {
  var currentWeather = "http://api.openweathermap.org/data/2.5/weather?q="+searchedCity+"&units=imperial&appid=d81dc018285004c32e878ad354aa6463";
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
  var currWeathCity = currentData.name;
  var currWeathDay = new Date(currentData.dt*1000).toLocaleDateString("en-US");
  var currWeathIcon = currentData.weather[0].icon;
  var currWeathTemp = currentData.main.temp;
  var currWeathWind = currentData.wind.speed;
  var currWeathHumidity = currentData.main.humidity;
  var currWeathUv = currentData.main.temp;
  displayCurrent (currWeathCity, currWeathDay, currWeathIcon, currWeathTemp, currWeathWind, currWeathHumidity, currWeathUv)
};

// ===================================== DISPLAY CURRENT WEATHER ====================================
var displayCurrent = function (city, day, icon, temp, wind, humidity, uv) {
  // container element
  var currentWeatherCont = $("#current-weather")
  var currentWeatherCard = $("<div>").addClass("card").attr("id", "weather-card")
  var currentIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + ".png")
  var currentCity = $("<h2>").addClass("title city-date mb-1").text(city + " (" + day + ") ");
  var currentTemp = $("<p>").addClass("data title is-5 p-2 mb-0").text("Temp: " + temp + " \u00B0F");
  var currentWind = $("<p>").addClass("data title is-5 p-2 mb-0").text("Wind: " + wind + " MPH");
  var currentHumidity = $("<p>").addClass("data title is-5 p-2 mb-0").text("Humidity: " + humidity + " %");
  var currentUV = $("<p>").addClass("data title is-5 p-2 mb-0").text(uv);

  currentCity.append(currentIcon)
  currentWeatherCard.append(currentCity, currentTemp, currentWind, currentHumidity, currentUV)
  currentWeatherCont.append(currentWeatherCard)
}

// get five day forecast from API -----------------------------------------------------------------
var getFiveDay = function (searchedCity) {
  var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?q="+searchedCity+"&units=imperial&appid=d81dc018285004c32e878ad354aa6463";
  fetch(fiveDayForecast).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        fiveDayDataParse (data);
        console.log(data);
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
    var fiveDayDate = new Date(forecastData.list[i].dt*1000).toLocaleDateString("en-US");
    var fiveDayTemp = forecastData.list[i].main.temp;
    var fiveDayWind = forecastData.list[i].wind.speed;
    var fiveDayHumidity = forecastData.list[i].main.humidity;
    var fiveDayicon = forecastData.list[i].weather[0].icon;
    
    // display five day forecast on page
    displayFiveDay (fiveDayDate, fiveDayicon, fiveDayTemp, fiveDayWind, fiveDayHumidity);
  };
};

// ===================================== DISPLAY FIVE DAY FORECAST ====================================
var displayFiveDay = function (date, icon, temp, wind, humidity) {

  
  var fiveDayContainer = $("#five-day");
  // build daily weather data DOM elements
  var dayContainer = $("<div>").addClass("column card").attr("id", "day-container");
  var dayDate = $("<p>").addClass("title is-4 has-text-white mb-1").text(date);
  var dayIcon  = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + ".png")
  var dayTemp = $("<p>").addClass("data p-2").text("Temp: " + temp + " \u00B0F");
  var dayWind = $("<p>").addClass("data p-2").text("Wind: " + wind + " MPH");
  var dayHumidity = $("<p>").addClass("data p-2").text("Humidity: " + humidity + " %");
  // append to page
  dayContainer.append(dayDate, dayIcon, dayTemp, dayWind, dayHumidity);
  fiveDayContainer.append(dayContainer);
};

$("#search-button").click(function(event){
  event.preventDefault()
  console.log("Search button clicked!")
  var searchedCity = $("#city-search").val()
  console.log(searchedCity)

  if (searchedCity === "") {
  console.log("blank input")
  }
  else {
    resetPage ();
    searchCityWeather (searchedCity);
  }
})

var resetPage = function () {
  
  var currentCityWeather = document.getElementById("weather-card")
  if (document.getElementById("day-container")) {
  for (var i = 0; i < 5; i ++) {
    var fiveDayForecast = document.getElementById("day-container")
    fiveDayForecast.remove();
  }
  }
  if (currentCityWeather) {
    currentCityWeather.remove()
  }
}


// LAUNCH APPLICATION
var searchCityWeather = function (searchedCity) {
  getCurrent (searchedCity);
  getFiveDay (searchedCity);
}

