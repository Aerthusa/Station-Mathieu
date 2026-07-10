// ==========================================
// STATION MATHIEU
// Version 2
// Open-Meteo + Meteoblue Maps
// ==========================================

// ---------------------------
// VARIABLES
// ---------------------------

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let currentLatitude = null;
let currentLongitude = null;

let currentCity = "";

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
81:"🌦️",
82:"🌧️",

95:"⛈️",
96:"⛈️",
99:"⛈️"

};

const weatherText={

0:"Ensoleillé",
1:"Peu nuageux",
2:"Partiellement nuageux",
3:"Couvert
// ==========================================
// PARTIE 2 - OPEN METEO
// ==========================================

async function loadWeather(lat, lon) {

const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=7`;

const response = await fetch(url);

const data = await response.json();

displayCurrent(data.current);

displayHourly(data.hourly);

displayDaily(data.daily);

document.getElementById("lastUpdate").innerHTML =
"Mis à jour " +
new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

}

// ==========================================
// METEO ACTUELLE
// ==========================================

function displayCurrent(current){

document.getElementById("temperature").innerHTML =
Math.round(current.temperature_2m)+"°";

document.getElementById("humidity").innerHTML =
current.relative_humidity_2m+" %";

document.getElementById("wind").innerHTML =
Math.round(current.wind_speed_10m)+" km/h";

document.getElementById("windDirection").innerHTML =
windDirection(current.wind_direction_10m);

document.getElementById("pressure").innerHTML =
Math.round(current.surface_pressure)+" hPa";

document.getElementById("weatherIcon").innerHTML =
weatherIcons[current.weather_code] || "☀️";

document.getElementById("description").innerHTML =
weatherText[current.weather_code] || "";

}

// ==========================================
// 6 PROCHAINES HEURES
// ==========================================

function displayHourly(hourly){

const container =
document.getElementById("hourlyForecast");

container.innerHTML="";

const currentHour =
new Date().getHours();

for(let i=currentHour;i<currentHour+6;i++){

const hour =
hourly.time[i].substring(11,16);

const temp =
Math.round(hourly.temperature_2m[i]);

const icon =
weatherIcons[
hourly.weather_code[i]
] || "☀️";

const rain =
hourly.precipitation_probability[i];

container.innerHTML += `

<div class="hourCard">

<h3>${hour}</h3>

<div>${icon}</div>

<strong>${temp}°</strong>

<br>

<small>${rain}% 🌧️</small>

</div>

`;

}

}

// ==========================================
// PREVISIONS 7 JOURS
// ==========================================

function displayDaily(daily){

const container =
document.getElementById("dailyForecast");

container.innerHTML="";

for(let i=0;i<daily.time.length;i++){

const date =
new Date(daily.time[i]);

const day =
date.toLocaleDateString("fr-FR",{
weekday:"short"
});

const icon =
weatherIcons[
daily.weather_code[i]
] || "☀️";

container.innerHTML += `

<div class="favorite">

<strong>${day}</strong>

<br>

${icon}

<br>

${Math.round(daily.temperature
// ==========================================
// PARTIE 3 - FAVORIS & CARTES
// ==========================================

// ---------- FAVORIS ----------

document.getElementById("favoriteButton").onclick = () => {

    if(currentCity==="") return;

    if(!favorites.includes(currentCity)){

        favorites.push(currentCity);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        displayFavorites();

    }

};

function displayFavorites(){

    const container =
        document.getElementById("favorites");

    container.innerHTML="";

    if(favorites.length===0){

        container.innerHTML="<p>Aucun favori.</p>";

        return;

    }

    favorites.forEach(city=>{

        const div=document.createElement("div");

        div.className="favorite";

        div.innerHTML=`

        <div class="favoriteRow">

            <span>${city}</span>

            <button onclick="removeFavorite('${city}')">

            🗑️

            </button>

        </div>

        `;

        div.onclick=()=>{

            document.getElementById("citySearch").value=city;

            searchCity(city);

        };

        container.appendChild(div);

    });

}

function removeFavorite(city){

favorites=favorites.filter(c=>c!==city);

localStorage.setItem(

"favorites",

JSON.stringify(favorites)

);

displayFavorites();

}

// ---------- CARTES ----------

const maps={

radar:"https://www.meteoblue.com/fr/meteo/cartes",

wind:"https://www.meteoblue.com/fr/meteo/cartes",

storm:"https://www.meteoblue.com/fr/meteo/cartes",

lightning:"https://www.meteoblue.com/fr/meteo/cartes"

};

function openMap(type){

document.getElementById("mapModal").style.display="block";

document
