const api = {
  key: "12062b6a411de0540088d03a4f133c6b",
  base: "https://api.openweathermap.org/data/2.5/"
}




// ------------------------ START CITY
const notificationEl = document.querySelector('.notification');

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(e) {
  if (e.keyCode == 13) {
    getWetherByCity(searchbox.value);
  }
}

async function getWetherByCity (city) {
	try {
		const query = `${api.base}weather?q=${city}&units=metric&APPID=${api.key}`;
	  const res = await fetch(query);
		console.log("res", res);
	  const weather = await res.json();
		console.log("weather", weather);

	  displayResults(weather);
	} catch (err) {
		showError(err);
	}
}
// ------------------------- END CITY




// ------------------------- START GEO
if('geolocation' in navigator){
	navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
	notificationEl.style.display = "block";
	notificationEl.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position){
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	
	getWeatherByGeo(latitude, longitude);
}

function showError(error){
	notificationEl.style.display = "block";
	notificationEl.innerHTML = `<p> ${error.message} </p>`;
	setTimeout(()=>{
		notificationEl.style.display = "none";
	}, 5000);
}

async function getWeatherByGeo(latitude, longitude){
	const query = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`;
	const res = await fetch(query);
	const weather = await res.json();
	displayResults(weather);
}
// ------------------------- END GEO




// ------------------------- SHOW WEATHER
function displayResults (weather) {
  const city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  const now = new Date();
  const date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  const temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  const weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  const hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}