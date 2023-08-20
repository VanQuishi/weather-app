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

const API_KEY = "5b89fe19c762410cb0d193414231908";
const searchForm = document.getElementById("searchForm");
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const nameInfo = document.getElementById("nameInfo");
const condtInfo = document.getElementById("condtInfo");
const tempInfo = document.getElementById("tempInfo");
const uvInfo = document.getElementById("uvInfo");

var todayForeCast = new ForeCast();
locationInput.value = "London"; //default

async function getWeatherAPIData(location) {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`, {mode: 'cors'});
    var data = await response.json();
    console.log(data);
    return data;
  } catch(err) {
    return err;
  }
}

async function parseForeCast(location) {
  getWeatherAPIData(location)
  .then((data) => {
    let curr = data.current;
    let loc = data.location;
    todayForeCast.name = data.location.name;
    todayForeCast = new ForeCast(loc.name, curr.condition.text, curr.temp_c, curr.temp_f, curr.uv);
    console.log({todayForeCast});
  })
  .catch((err) => {
    console.log(err);
  }); 
}

function populateWeatherCard(foreCastObj) {
  cityName.innerHTML = foreCastObj.name;
  nameInfo.innerHTML = foreCastObj.name;
  condtInfo.innerHTML = foreCastObj.condition;
  tempInfo.innerHTML = foreCastObj.tempC;
  uvInfo.innerHTML = foreCastObj.uv;
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  parseForeCast(locationInput.value)
  .then(() => {
    console.log("after parse", todayForeCast);
    populateWeatherCard(todayForeCast);
  });
});

document.addEventListener("DOMContentLoaded", function(){
  // Code here waits to run until the DOM is loaded.
  searchBtn.click();
});

//parseForeCast("danang");
//getWeatherAPIData("danang");