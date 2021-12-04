// LAUNCH APPLICATION
var searchCityWeather = function (searchedCity) {
  getGeo(searchedCity);
  getFiveDay(searchedCity);
}

var resetPage = function () {

  var currentCityWeather = document.getElementById("weather-card")
  if (document.getElementById("day-container")) {
    for (var i = 0; i < 5; i++) {
      var fiveDayForecast = document.getElementById("day-container")
      fiveDayForecast.remove();
    }
  }
  if (currentCityWeather) {
    currentCityWeather.remove()
  }
}

//----------------------------NEW API STRUCTURE---------------------//
//-----GEO COORD-------//
var getGeo = function (searchedCity) {
  var currentWeather = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity + "&limit=1&appid=d81dc018285004c32e878ad354aa6463";
  fetch(currentWeather).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        geoDataParse(data, searchedCity);
        console.log(data);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  });
};

var geoDataParse = function (geoData, searchedCity) {
  var lon = geoData[0].lon
  var lat = geoData[0].lat
  console.log(lon)
  console.log(lat)
  getCurrent(lon, lat, searchedCity);
}

// get current weather from API ----------------------------------------------------------------------
var getCurrent = function (lon, lat, searchedCity) {
  var currentWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=d81dc018285004c32e878ad354aa6463";
  fetch(currentWeather).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        currentWeatherParse(data, searchedCity);
        console.log(data);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  });
};

// ---------- PARSE CURRENT WEATHER DATA ------------------
var currentWeatherParse = function (currentData, searchedCity) {
  // gather relavent current weather data
  var currWeathCity = searchedCity
  var currWeathDay = new Date(currentData.current.dt * 1000).toLocaleDateString("en-US");
  var currWeathIcon = currentData.current.weather[0].icon;
  console.log(currWeathIcon)
  var currWeathTemp = currentData.current.temp;
  var currWeathWind = currentData.current.wind_speed;
  var currWeathHumidity = currentData.current.humidity;
  var currWeathUv = currentData.current.uvi;
  displayCurrent(currWeathCity, currWeathDay, currWeathIcon, currWeathTemp, currWeathWind, currWeathHumidity, currWeathUv)
};

// ===================================== DISPLAY CURRENT WEATHER ====================================
var displayCurrent = function (city, day, icon, temp, wind, humidity, uv) {
  // create elements
  var currentWeatherCont = $("#current-weather")
  var currentWeatherCard = $("<div>")
    .addClass("")
    .attr("id", "weather-card")
  var currentIcon = $("<img>")
    .attr("src", "http://openweathermap.org/img/wn/" + icon + ".png")
  var currentCity = $("<h2>")
    .addClass("title city-date mb-1")
    .text(city + " (" + day + ") ");
  var currentTemp = $("<p>")
    .addClass("data title is-5 p-2 mb-0").text("Temp: " + temp + " \u00B0F");
  var currentWind = $("<p>")
    .addClass("data title is-5 p-2 mb-0")
    .text("Wind: " + wind + " MPH");
  var currentHumidity = $("<p>")
    .addClass("data title is-5 p-2 mb-0")
    .text("Humidity: " + humidity + " %");
  var currentUvContainer = $("<div>")
    .addClass("data title is-5 py-3 pl-3 mb-0 columns is-mobile")
  var currentUvTitle = $("<p>")
    .addClass("data title is-5 p-2 mb-0").text("UV Index: ");
  var currentUV = $("<p>")
    .addClass("data title is-5 p-2 px-4 mb-0 box").text(uv)
    .attr("id", "uv-index");
  // append elements together
  currentCity.append(currentIcon)
  currentUvContainer.append(currentUvTitle, currentUV)
  currentWeatherCard.append(currentCity, currentTemp, currentWind, currentHumidity, currentUvContainer)
  currentWeatherCont.append(currentWeatherCard)

  if (uv < 3) {
    currentUV.addClass("uv-low")
  }
  if (uv >= 3) {
    currentUV.addClass("uv-med")
  }
  if (uv >= 6) {
    currentUV.addClass("uv-high")
  }
  if (uv >= 8) {
    currentUV.addClass("uv-vhigh")
  }
  if (uv > 11) {
    currentUV.addClass("uv-ehigh")
  }
}

// get five day forecast from API -----------------------------------------------------------------
var getFiveDay = function (searchedCity) {
  var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&units=imperial&appid=d81dc018285004c32e878ad354aa6463";
  fetch(fiveDayForecast).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        fiveDayDataParse(data);
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
  for (var i = 0; i < forecastData.list.length; i = i + 8) {
    var fiveDayDate = new Date(forecastData.list[i].dt * 1000).toLocaleDateString("en-US");
    var fiveDayTemp = forecastData.list[i].main.temp;
    var fiveDayWind = forecastData.list[i].wind.speed;
    var fiveDayHumidity = forecastData.list[i].main.humidity;
    var fiveDayicon = forecastData.list[i].weather[0].icon;

    // display five day forecast on page
    displayFiveDay(fiveDayDate, fiveDayicon, fiveDayTemp, fiveDayWind, fiveDayHumidity);
  };
};

// ===================================== DISPLAY FIVE DAY FORECAST ====================================
var displayFiveDay = function (date, icon, temp, wind, humidity) {
  // create elements
  var fiveDayContainer = $("#five-day");
  var dayContainer = $("<div>")
    .addClass("column card")
    .attr("id", "day-container");
  var dayDate = $("<p>")
    .addClass("title is-4 has-text-white mb-1")
    .text(date);
  var dayIcon = $("<img>")
    .attr("src", "http://openweathermap.org/img/wn/" + icon + ".png")
  var dayTemp = $("<p>")
    .addClass("data p-2").text("Temp: " + temp + " \u00B0F");
  var dayWind = $("<p>")
    .addClass("data p-2").text("Wind: " + wind + " MPH");
  var dayHumidity = $("<p>")
    .addClass("data p-2")
    .text("Humidity: " + humidity + " %");
  // append to page
  dayContainer.append(dayDate, dayIcon, dayTemp, dayWind, dayHumidity);
  fiveDayContainer.append(dayContainer);
};

var cityHist = function (searchedCity) {
  var searchForm = $("#search-form")
  var buttonContainer = $("<div>")
    .addClass("control my-4")
  var cityHistButton = $("<button>")
    .addClass("button prev-city is-info is-outlined")
    .attr("type", "submit")
    .text(searchedCity)
  buttonContainer.append(cityHistButton)
  searchForm.append(buttonContainer);

  var prevCityBtn = document.querySelectorAll('.prev-city');
  for (let i = 0; i < prevCityBtn.length; i++) {
    prevCityBtn[i].onclick = function (e) {
      e.preventDefault()
      var prevSearchCity = $(this).text()
      resetPage();
      searchCityWeather(prevSearchCity);
    }
  }
}

$("#search-button").click(function (event) {

  event.preventDefault()
  console.log("Search button clicked!")
  var searchedCity = $("#city-search").val()
  console.log(searchedCity)

  if (searchedCity === "") {
    console.log("blank input")
  }
  else {
    resetPage();
    searchCityWeather(searchedCity);
    cityHist(searchedCity);
  }
})