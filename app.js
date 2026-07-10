// ===============================
// Station Mathieu - app.js
// Version 1.0
// ===============================

const weatherDescriptions = {
    0: "☀️ Ensoleillé",
    1: "🌤 Peu nuageux",
    2: "⛅ Partiellement nuageux",
    3: "☁️ Couvert",
    45: "🌫 Brouillard",
    48: "🌫 Brouillard givrant",
    51: "🌦 Bruine",
    61: "🌧 Pluie",
    71: "❄️ Neige",
    80: "🌦 Averses",
    95: "⛈ Orage"
};

window.onload = () => {
    displayFavorites();
    locateUser();
};

// ===============================
// GPS
// ===============================

function locateUser() {

    if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas disponible.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            loadWeather(lat, lon);
            reverseGeocode(lat, lon);

        },
        () => {
            alert("Impossible d'obtenir votre position.");
        }
    );

}

document.getElementById("gpsButton").onclick
