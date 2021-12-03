
// get five day forecast from API
var getFiveDay = function () {
  var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?q=Columbus&appid=d81dc018285004c32e878ad354aa6463";
  fetch(fiveDayForecast).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        parseWeatherData (data);
      });
    } else {
      alert("Error: No response from weather API!");
    }
  });
};

var parseWeatherData = function (forecastData) {  
  // create five day forecast data
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

var displayFiveDay = function (date, icon, temp, wind, humidity) {
  // container elements
  var fiveDayContainer = $("#five-day");
  var dayContainer = $("<div>").addClass("box column");
  // daily weather daya
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
getFiveDay ();