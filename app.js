class ForeCast {
  name;
  condition;
  tempC;
  tempF;
  uv;

  constructor(_name, _condition, _tempC,_tempF, _uv) {
    this.name = _name;
    this.condition = _condition;
    this.tempC = _tempC;
    this.tempF = _tempF;
    this.uv = _uv;
  }
}

const conditionsList = ['sunny', 'clear', 'cloudy', 'overcast', 'mist', 'rain', 'snow',
                        'sleet', 'freezing', 'thunder', 'blizzard', 'fog', 'drizzle', 'ice'];
const WEATHER_KEY = "5b89fe19c762410cb0d193414231908";
const GIF_KEY = "9U5KpdFWC8vK9OToRJVXOV5t733744er";

const searchForm = document.getElementById("searchForm");
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const nameInfo = document.getElementById("nameInfo");
const condtInfo = document.getElementById("condtInfo");
const tempInfo = document.getElementById("tempInfo");
const uvInfo = document.getElementById("uvInfo");
const weatherGIF = document.getElementById("weatherGIF");
const tempValue = document.getElementById("tempValue");
const cBtn = document.getElementById("cBtn");
const fBtn = document.getElementById("fBtn"); 

var myForeCastObj = new ForeCast("", "", "", "", "");

locationInput.value = "London"; //default

async function getWeatherAPIData(location) {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${location}`, {mode: 'cors'});
    var data = await response.json();
    console.log('get', data);
    return data;
  } catch(err) {
    return err;
  }
}

async function parseForeCast(location) {
  try {
    var data = await getWeatherAPIData(location);
    let curr = data.current;
    let loc = data.location;
    var todayForeCast = new ForeCast(loc.name, curr.condition.text, curr.temp_c, curr.temp_f, curr.uv);
    return todayForeCast;
  } catch(err) {
    console.log(err);
  }
}

const parseForeCast2 = (location) => {
  return new Promise((resolve, reject) => {
    getWeatherAPIData(location)
    .then((data) => {
      let curr = data.current;
      let loc = data.location;
      var todayForeCast = new ForeCast(loc.name, curr.condition.text, curr.temp_c, curr.temp_f, curr.uv);
      resolve(todayForeCast);
    })
    .catch((err) => {
      reject(err);
    })
  })
}

function populateWeatherCard(foreCastObj) {
  cityName.innerHTML = foreCastObj.name;
  nameInfo.innerHTML = foreCastObj.name;
  condtInfo.innerHTML = foreCastObj.condition;
  tempValue.innerHTML = foreCastObj.tempC;
  uvInfo.innerHTML = foreCastObj.uv;
}

async function getGifUrl(word) {
  try {
    var response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${GIF_KEY}&s=${word}`, {mode: 'cors'});
    var gifData = await response.json();
    var url = gifData.data.images.original.url;
    console.log('get', url);
    return url;
  } catch(err) {
    return err;
  }
}

function findConditionWord(condition) {
  var keyword = "weather";

  keyword = conditionsList.find((item) => condition.toLowerCase().includes(item));

  return keyword;
}

function populateGIF(condition) {
  var word = findConditionWord(condition);
  getGifUrl(word + " weather")
  .then((url) => {
    weatherGIF.src = url;
  })
  .catch((err) => {
    console.log(err);
  })
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  parseForeCast(locationInput.value)
  .then((todayForeCast) => {
    myForeCastObj = JSON.parse(JSON.stringify(todayForeCast));
    populateWeatherCard(todayForeCast);
    populateGIF(todayForeCast.condition);
  });
});

parseForeCast2(locationInput.value)
.then((todayForeCast) => {
  myForeCastObj = JSON.parse(JSON.stringify(todayForeCast));
  populateWeatherCard(todayForeCast);
  populateGIF(todayForeCast.condition);
})

document.addEventListener("DOMContentLoaded", function(){
  cBtn.addEventListener("click", (e) => {
    cBtn.style.color = "#2e384d";
    fBtn.style.color = "#92a1b4";
    tempValue.innerHTML = myForeCastObj.tempC;
  })
  fBtn.addEventListener("click", (e) => {
    fBtn.style.color = "#2e384d";
    cBtn.style.color = "#92a1b4";
    tempValue.innerHTML = myForeCastObj.tempF;
  })
});

