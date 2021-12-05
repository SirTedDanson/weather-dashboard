var weatherContainer = $("#weather-info");
var searchHist = [];

// ------------------------ FORMAT SEARCH CITY TEXT ---------------------------- //
var cityFormat = function (searchedCity) {
  searchedCity = searchedCity.toLowerCase();
  var strSplit = searchedCity.split(" ");
  for (var i = 0; i < strSplit.length; i++) {
    strSplit[i] = strSplit[i].charAt(0).toUpperCase() + strSplit[i].slice(1);
  };
  var cityFormat = strSplit.join(" ");
  getGeo(cityFormat);
};

//================================= PAGE CREATION ===============================//
//------------------------------- GEO COORD API CALL -------------------------------//
var getGeo = function (searchedCity) {
  var currentWeather = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchedCity + "&limit=1&appid=d81dc018285004c32e878ad354aa6463";

  fetch(currentWeather).then(function (response) {

    if (response.ok) {
      response.json().then(function (data) {
        if (data.length > 0) {
          document.querySelector("input[name='city-search']").value = "";
          resetPage();
          geoDataParse(data, searchedCity);
        } else {
          if (!document.getElementById("spell-err")) {
            var tryAgain = document.createElement("span");
            $(tryAgain).addClass("subtitle is-6").attr("id", "spell-err");
            tryAgain.innerHTML = "Enter a valid city! Check spelling!";
            formText = document.getElementById("form-title");
            // formText.innerHTML = "Search for a city: ";
            formText.appendChild(tryAgain);
            setTimeout(function () {
              tryAgain.remove();
            }, 1600);
          }
        }
      });
    }
  }).catch(function (error) {
    alert("Unable to connect to weather API");
  });
};

var geoDataParse = function (geoData, searchedCity) {
  var lon = geoData[0].lon;
  var lat = geoData[0].lat;
  getCurrent(lon, lat, searchedCity);
}

// get current weather from API ----------------------------------------------------------------------
var getCurrent = function (lon, lat, searchedCity) {
  var currentWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&units=imperial&appid=d81dc018285004c32e878ad354aa6463";
  fetch(currentWeather).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        currentWeatherParse(data, searchedCity);
        cityHist(searchedCity);
        getFiveDay(searchedCity);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  }).catch(function (error) {
    alert("Unable to connect to weather API");
  });
};

// ---------- PARSE CURRENT WEATHER DATA ------------------
var currentWeatherParse = function (currentData, searchedCity) {
  // gather relavent current weather data
  var currWeathCity = searchedCity;
  var currWeathDay = new Date(currentData.current.dt * 1000).toLocaleDateString("en-US");
  var currWeathIcon = currentData.current.weather[0].icon;
  var currWeathTemp = currentData.current.temp;
  var currWeathWind = currentData.current.wind_speed;
  var currWeathHumidity = currentData.current.humidity;
  var currWeathUv = currentData.current.uvi;
  displayCurrent(currWeathCity, currWeathDay, currWeathIcon, currWeathTemp, currWeathWind, currWeathHumidity, currWeathUv);
};

// ===================================== DISPLAY CURRENT WEATHER ====================================
var displayCurrent = function (city, day, icon, temp, wind, humidity, uv) {
  // create elements
  var currentWeatherCont = $("<div>")
    .addClass("box")
    .attr("id", "current-weather");
  var currentWeatherCard = $("<div>")
    .addClass("")
    .attr("id", "weather-card");
  var currentIcon = $("<img>")
    .attr("src", "https://openweathermap.org/img/wn/" + icon + ".png");
  var currentCity = $("<h2>")
    .addClass("title city-date mb-1 has-text-info-light")
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
    .addClass("data title is-5 py-3 pl-3 mb-0 columns is-mobile");
  var currentUvTitle = $("<p>")
    .addClass("data title is-5 p-2 mb-0").text("UV Index: ");
  var currentUV = $("<p>")
    .addClass("data title is-5 p-2 px-4 mb-0 box").text(uv)
    .attr("id", "uv-index");
  // append elements together
  currentCity.append(currentIcon);
  currentUvContainer.append(currentUvTitle, currentUV);
  currentWeatherCard.append(currentCity, currentTemp, currentWind, currentHumidity, currentUvContainer);
  currentWeatherCont.append(currentWeatherCard);
  weatherContainer.append(currentWeatherCont);

  // UV index color coding
  if (uv < 3) { currentUV.addClass("uv-low") };
  if (uv >= 3) { currentUV.addClass("uv-med") };
  if (uv >= 6) { currentUV.addClass("uv-high") };
  if (uv >= 8) { currentUV.addClass("uv-vhigh") };
  if (uv > 11) { currentUV.addClass("uv-ehigh") };
};

// get five day forecast from API -----------------------------------------------------------------
var getFiveDay = function (searchedCity) {

  var fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&units=imperial&appid=d81dc018285004c32e878ad354aa6463";
  fetch(fiveDayForecast).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        fiveDayDataParse(data);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  }).catch(function (error) {
    alert("Unable to connect to weather API");
  });
};
// ---------- PARSE FIVE DAY FORECAST DATA ------------------
var fiveDayDataParse = function (forecastData) {
  // create container
  var fiveDayContainer = $("<div>")
    .addClass("box")
    .attr("id", "forecast-cont");
  weatherContainer.append(fiveDayContainer);
  var forecastTitleCont = $("<div>")
    .addClass("column is-full pb-4 pl-0");
  var forecastTitle = $("<h3>")
    .addClass("title forecast")
    .text("5-Day Forecast:");
  var mainForCont = $("<div>")
    .addClass("columns")
    .attr("id", "five-day");

  forecastTitleCont.append(forecastTitle);
  fiveDayContainer.append(forecastTitleCont);
  fiveDayContainer.append(mainForCont);

  // gather relavent five day forecast data
  for (var i = 0; i < forecastData.list.length; i = i + 8) {
    var fiveDayData = (forecastData.list[i].dt_txt);
    var fSplitMonth = fiveDayData.substring(5, 7)
    var fSplitDay = fiveDayData.substring(8, 10)
    var fSplitYear = fiveDayData.substring(2, 4)
    var fiveDayDate = fSplitDay.concat("/", fSplitMonth, "/", fSplitYear)
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
  var forecastContainer = $("#five-day");
  var dayContainer = $("<div>")
    .addClass("column card")
    .attr("id", "day-container");
  var dayDate = $("<p>")
    .addClass("subtitle is-5 has-text-white mb-1")
    .text(date);
  var dayIcon = $("<img>")
    .attr("src", "https://openweathermap.org/img/wn/" + icon + ".png");
  var dayTemp = $("<p>")
    .addClass("data p-2").text("Temp: " + temp + " \u00B0F");
  var dayWind = $("<p>")
    .addClass("data p-2").text("Wind: " + wind + " MPH");
  var dayHumidity = $("<p>")
    .addClass("data p-2")
    .text("Humidity: " + humidity + " %");
  // append to page
  dayContainer.append(dayDate, dayIcon, dayTemp, dayWind, dayHumidity);
  forecastContainer.append(dayContainer);
};

// -------------------------- Generate Search History Buttons -----------------------
var cityHist = function (searchedCity) {
  // if city is already part of history list do not add it again
  var curHistBtns = document.querySelectorAll('.prev-city');
  for (let i = 0; i < curHistBtns.length; i++) {
    var listedCity = curHistBtns[i].textContent;
    if (listedCity == searchedCity) {
      return;
    }
  };
  // create previous city button
  var searchForm = $("#search-form");
  var buttonContainer = $("<div>")
    .addClass("control my-4");
  var cityHistButton = $("<button>")
    .addClass("button prev-city is-info is-outlined")
    .attr("type", "submit")
    .text(searchedCity);
  buttonContainer.append(cityHistButton);
  searchForm.append(buttonContainer);
  saveToStorage();

  // PREVIOUS CITY SEARCH ---------------------------------------------
  // locate the text of the previous city button and feed it to the API procedure 
  var prevCityBtn = document.querySelectorAll('.prev-city');
  for (let i = 0; i < prevCityBtn.length; i++) {
    prevCityBtn[i].onclick = function (event) {
      event.preventDefault();
      var prevSearchCity = $(this).text();
      resetPage();
      getGeo(prevSearchCity);
    }
  };
};

// ---------------- REMOVE DOM ELEMENTS FOR RECREATION --------------------- //
var resetPage = function () {
  var currentCityWeather = document.getElementById("current-weather");
  var forecastCont = document.querySelectorAll('#forecast-cont');
  for (let i = 0; i < forecastCont.length; i++) {
    forecastCont[i].remove();
  }
  if (currentCityWeather) {
    currentCityWeather.remove();
  }
}

// initate weather elements by clicking search button ---------------------- //
$("#search-button").click(function (event) {
  event.preventDefault();
  var searchedCity = $("#city-search").val();
  // do nothing if search area is empty
  if (searchedCity === "") {
  } else {
    cityFormat(searchedCity);
  };
});

$("#clr-hist-btn").click(function (event) {
  event.preventDefault();
  localStorage.clear()
  window.location.reload();
});

// -------------- SAVE SEARCHED DATA TO STORAGE ----------------------- //
var saveToStorage = function () {
  var curHistBtns = document.querySelectorAll('.prev-city');
  for (let i = 0; i < curHistBtns.length; i++) {
    var listedCity = curHistBtns[i].textContent;
    searchHist[i] = listedCity;
    localStorage.setItem("Search Hist", JSON.stringify(searchHist));
  };
};

// -------------- LOAD DATA TO STORAGE -------------------------- //
var loadSearchHist = function () {
  var storedSearchHist = JSON.parse(localStorage.getItem("Search Hist"));
  if (storedSearchHist == null) {
    var searchHist = [];
    document.getElementById("current-weather").classList.remove("hide");
  } else {
    searchHist = storedSearchHist;
    for (let i = 0; i < searchHist.length; i++) {
      cityHist(searchHist[i]);
    }
    getGeo(searchHist[0]);
  };
};

// LAUNCH APPLICATION
loadSearchHist();