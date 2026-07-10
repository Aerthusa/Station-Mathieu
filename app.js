// ======================================================
// STATION MATHIEU
// APP.JS - PARTIE 1/4
// ======================================================

// ---------- GLOBAL ----------

const searchInput = document.getElementById("citySearch");
const searchResults = document.getElementById("searchResults");

let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

let currentCity = null;

let currentLat = null;
let currentLon = null;

// ---------- WEATHER CODES ----------

const weatherIcons = {
0:"☀️",
1:"🌤️",
2:"⛅",
3:"☁️",
45:"🌫️",
48:"🌫️",
51:"🌦️",
53:"🌦️",
55:"🌦️",
61:"🌧️",
63:"🌧️",
65:"🌧️",
71:"❄️",
73:"❄️",
75:"❄️",
80:"🌦️",
81:"🌧️",
82:"🌧️",
95:"⛈️",
96:"⛈️",
99:"⛈️"
};

const weatherText = {
0:"Ensoleillé",
1:"Peu nuageux",
2:"Partiellement nuageux",
3:"Couvert",
45:"Brouillard",
48:"Brouillard",
51:"Bruine",
53:"Bruine",
55:"Bruine",
61:"Pluie",
63:"Pluie",
65:"Forte pluie",
71:"Neige",
80:"Averses",
95:"Orage"
};

// ======================================================
// DEMARRAGE
// ======================================================

window.onload = () => {

displayFavorites();

initGPS();

setupSearch();

};

// ======================================================
// GPS
// ======================================================

function initGPS(){

if(!navigator.geolocation){

alert("GPS non disponible");

return;

}

navigator.geolocation.getCurrentPosition(

(position)=>{

currentLat = position.coords.latitude;

currentLon = position.coords.longitude;

loadWeather(currentLat,currentLon);

reverseGeocode(currentLat,currentLon);

},

(error)=>{

console.error(error);

alert("Impossible d'obtenir votre position.");

},

{

enableHighAccuracy:true,

timeout:8000

}

);

}

// ======================================================
// RECHERCHE
// ======================================================

function setupSearch(){

searchInput.addEventListener("input",()=>{

const query = searchInput.value.trim();

if(query.length<2){

searchResults.innerHTML="";

return;

}

searchCity(query);

});

}

// ======================================================
// API RECHERCHE
// ======================================================

async function searchCity(query){

const url=

`https://geocoding-api.open-m
// ======================================================
// APP.JS - PARTIE 2/4
// METEO OPEN-METEO
// ======================================================

async function loadWeather(lat, lon) {

const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=7&timezone=auto`;

try{

const response = await fetch(url);

const data = await response.json();

updateCurrentWeather(data.current);

updateHourly(data.hourly);

updateDaily(data.daily);

document.getElementById("lastUpdate").textContent =
"Mis à jour à " +
new Date().toLocaleTimeString("fr-FR",{
hour:"2-digit",
minute:"2-digit"
});

}catch
// ======================================================
// APP.JS - PARTIE 3/4
// PREVISIONS
// ======================================================

function updateHourly(hourly){

const container=document.getElementById("hourlyForecast");

container.innerHTML="";

const now=new Date();
const currentHour=now.getHours();

for(let i=currentHour;i<currentHour+6;i++){

const hour=hourly.time[i].substring(11,16);

const temp=Math.round(hourly.temperature_2m[i]);

const rain=hourly.precipitation_probability[i];

const icon=weatherIcons[hourly.weather_code[i]] || "☀️";

const card=document.createElement("div");

card.className="hourCard";

card.innerHTML=`

<h3>${hour}</h3>

<div>${icon}</div>

<strong>${temp}°</strong>

<small>${rain}% 🌧️</small>

`;

container.appendChild(card);

}

}

// ======================================================
// PREVISIONS 7 JOURS
// ======================================================

function updateDaily(daily){

const container=document.getElementById("dailyForecast");

container.innerHTML="";

for(let i=0;i<daily.time.length;i++){

const date=new Date(daily.time[i]);

const day=date.toLocaleDateString("fr-FR",{

weekday:"short"

});

const icon=weather
// ======================================================
// APP.JS - PARTIE 4/4
// FAVORIS + CARTES
// ======================================================

// ---------- FAVORIS ----------

document.getElementById("favoriteButton").onclick = () => {

    if(!currentCity) return;

    const exists = favorites.find(f => f.name === currentCity);

    if(exists) return;

    favorites.push({

        name: currentCity,

        lat: currentLat,

        lon: currentLon

    });

    saveFavorites();

    displayFavorites();

};

function saveFavorites(){

localStorage.setItem(

"favorites",

JSON.stringify(favorites)

);

}

function displayFavorites(){

const container=document.getElementById("favorites");

container.innerHTML="";

if(favorites.length===0){

container.innerHTML="<p>Aucun favori.</p>";

return;

}

favorites.forEach((city,index)=>{

const div=document.createElement("div");

div.className="favorite";

div.innerHTML=`

<div style="display:flex;justify-content:space-between;align-items:center">

<span>⭐ ${city.name}</span>

<button onclick="removeFavorite(${index})">

🗑️

</button>

</div>

`;

div.onclick=(e)=>{

if(e.target.tagName==="BUTTON") return;

currentCity=city.name;

currentLat=city.lat;

currentLon=city.lon;

document.getElementById("cityName").textContent=city.name;

loadWeather(city.lat,city.lon);

};

container.appendChild(div);
