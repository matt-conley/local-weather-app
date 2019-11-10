function getLocation(){
    $.ajax({
    url: "https://ipinfo.io/json",
    method: "GET",
    dataType: "json",
    success: function(result){
      var userLoc = result.loc;
      var locName = result.city + ', ' + result.region;
      getWeather(userLoc, locName);
    },
    error: function(e){
      console.error('Sorry, please see error:' + e);
    }
  });
};

function getWeather(userLoc, locName){
  $.ajax({
    url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/bd6108c1e1b61c0c482f7d615f33b667/' + userLoc + '?units=us',
    headers: {
      Accept: 'application/json'
    },
    crossDomain: true,
    method: "GET",
    dataType: "json",
    success: function(result){
      console.log(result);
      applyWeather(result, userLoc, locName);
    }
  })
};

function applyWeather(data, userLoc, locName) {
  //Create, obtain, and play skycon from library
  var skycons = new Skycons({"color": "#333"});
  skycons.add(document.getElementById("icon"), setIcon(data.currently.icon));
  skycons.play();
  //Assign summary
  var summary = data.currently.summary;
  $('#summary').html(summary);
  //Assign temperature
  var currentTemp = Math.round(data.currently.temperature);
  $('#temperature').html(currentTemp + '°');
  //Assign Precipitation type and chance
  var precipType = data.currently.precipType;
  var precipChance = Math.round(data.currently.precipProbability * 100);
  if(!precipType) { precipType = 'rain'}; //precipType defaults to rain if none assigned
  $('#precipitation').html(precipChance + '% chance of ' + precipType);
  //Assign Humidity
  var humidity = Math.round(data.currently.humidity * 100);
  $('#humidity').html(humidity + '%');
  //Assign Dew Point
  var dewPoint = Math.round(data.currently.dewPoint);
  $('#dewpoint').html(dewPoint + '°');
  //Assign Cloud Coverage
  var cloudCoverage = Math.round(data.currently.cloudCover * 100);
  $('#cloudcoverage').html(cloudCoverage + '%');
  //Assign Wind Speed and Direction
  var windSpeed = Math.round(data.currently.windSpeed);
  var windDir = data.currently.windBearing;
  $('#windspeed').html(windSpeed + 'mph ');
  $('#winddir').html(setWind(windDir));
  //Assign pressure
  var pressure = Math.round(data.currently.pressure);
  $('#pressure').html(pressure + ' mb');
  //Assign location name
  $('#locname').html(locName);
  //Convert Units
   unitConversion(currentTemp,dewPoint,windSpeed,pressure);
};

function unitConversion(temp,dew,speed,pressure) {
  //Assign default temp format
  var unitFormat = 'us';
  //US - SI
  $('#celsius').on('click', function(){
    if (unitFormat === 'us') {
      let newTemp = Math.round((temp - 32) * (5 / 9));
      let newDew = Math.round((temp - 32) * (5 / 9));
      let newSpeed = Math.round(speed * 1.60934);
      $('#temperature').html(newTemp + '°');
      $('#dewpoint').html(newDew + '°');
      $('#windspeed').html(newSpeed + 'km/h ');
      $('#pressure').html(pressure + ' hPa');
      $('#fahrenheit').removeClass('btn-primary');
      $('#celsius').addClass('btn-primary');
      unitFormat = 'si';
    }
  });
  //SI - US - No math necessary, reverting to original data
  $('#fahrenheit').on('click', function(){
    if (unitFormat === 'si') {
      $('#temperature').html(temp + '°');
      $('#dewpoint').html(dew + '°');
      $('#windspeed').html(speed + 'mph ');
      $('#pressure').html(pressure + ' mb');
      $('#celsius').removeClass('btn-primary');
      $('#fahrenheit').addClass('btn-primary');
      unitFormat = 'us';
    }
  });
};

function setIcon(icon) {
  var skycon = null;
  switch (icon) {
    case "clear-day":
      return Skycons.CLEAR_DAY;
      break;
    case "clear-night":
      return Skycons.CLEAR_NIGHT;
      break;
    case "rain":
      return Skycons.RAIN;
      break;
    case "snow":
      return Skycons.SNOW;
      break;
    case "sleet":
      return Skycons.SLEET;
      break;
    case "wind":
      return Skycons.WIND;
      break;
    case "fog":
      return Skycons.FOG;
      break;
    case "cloudy":
      return Skycons.CLOUDY;
      break;
    case "partly-cloudy-day":
      return Skycons.PARTLY_CLOUDY_DAY;
      break;
    case "partly-cloudy-night":
      return Skycons.PARTLY_CLOUDY_NIGHT;
      break;
    }
 }

function setWind(dir) {
  if (dir >=337.6 || dir <= 22.5) {
    return '&#8593;';
  } else if (dir >= 22.6 && dir <= 67.5) {
    return '&#8599;';
  } else if (dir >= 67.6 && dir <= 112.5) {
    return '&#8594;';
  } else if (dir >= 112.6 && dir <= 157.5) {
    return '&#8600;';
  } else if (dir >= 157.6 && dir <= 202.5) {
    return '&#8595;';
  } else if (dir >= 202.6 && dir <= 247.5) {
    return '&#8601;';
  } else if (dir >= 247.6 && dir <= 292.5) {
    return '&#8592;';
  } else if (dir >= 292.6 && dir <= 337.5) {
    return '&#8598;';
  } else {
    return '';
  }
}

$(document).ready(function(){
  getLocation();
});
