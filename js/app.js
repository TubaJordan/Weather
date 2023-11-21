async function geocodeAddress(address) {

    // const geocodeBackend = `http://localhost:3000/api/geocode?address=${encodeURIComponent(address)}`;

    const geocodeBackend = `https://weatherapi-ff1bda207bd9.herokuapp.com/api/geocode?address=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(geocodeBackend);
        const data = await response.json();

        if (data.status === "OK") {
            const lat = data.lat;
            const lon = data.lon;
            fetchWeather(lat, lon);
        } else {
            console.error("Geocode was not successful for the following reason: " + data.status);
            if (data.status === "INVALID_REQUEST" || data.status === "ZERO_RESULTS") {
                alert("Please enter a valid location!");
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function fetchWeather(lat, lon) {

    // const weatherBackend = `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`;

    const weatherBackend = `https://weatherapi-ff1bda207bd9.herokuapp.com/api/weather?lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(weatherBackend);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayTemp(data);

    } catch (error) {
        console.error("Error fetching the weather data:", error);
    }
}

function displayTemp(data) {
    let temp = data.current.temp;

    let forecastHTML = "";
    for (let i = 1; i < data.daily.length; i++) {
        const dailyTimeStamp = data.daily[i].dt;
        const dailyDate = new Date(dailyTimeStamp * 1000);
        const dailyOptions = { weekday: "short", month: "short", day: 'numeric' };
        const dailyFormattedDate = dailyDate.toLocaleDateString("en-US", dailyOptions);
        let low = Math.round(((data.daily[i].temp.min - 273.15) * 9 / 5 + 32));
        let high = Math.round(((data.daily[i].temp.max - 273.15) * 9 / 5 + 32));
        forecastHTML += `<div class="forecast-holder"><p>${dailyFormattedDate}</p><p class="forecast-low-temp">Low: ${low}&deg; F</p><p class="forecast-high-temp">High: ${high}&deg; F</p><img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png" alt="${data.current.weather[0].main}" /><p class="forecast-weather-condition">${data.daily[i].weather[0].main}</p></div>`
    }

    const forecast = document.getElementById("forecast");
    const windSpeedConversion = Math.round(data.current.wind_speed * 2.237);
    const visibilityConversion = Math.round(data.current.visibility / 1609);
    const dewPointConversion = Math.round(((data.current.dew_point - 273.15) * 9 / 5 + 32));
    const feelsLikeConversion = Math.round(((data.current.feels_like - 273.15) * 9 / 5 + 32));

    const weatherConditions = document.getElementById("weatherConditions");

    let converting = Math.round(((temp - 273.15) * 9 / 5 + 32));

    const weatherDisplay = document.getElementById("weather");

    let iconTest = document.getElementById("icon");
    let mainText = document.getElementById("currentLocation");

    const timeStamp = data.current.dt;
    const date = new Date(timeStamp * 1000);
    const options = { weekday: "long", year: "numeric", month: "long", day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const headerTimeStamp = data.current.dt;
    const headerDate = new Date(headerTimeStamp * 1000);
    const headerOptions = { weekday: "long", month: "long", day: 'numeric' };
    const headerFormattedDate = headerDate.toLocaleDateString("en-US", headerOptions);

    let lowCurrent = Math.round(((data.daily[0].temp.min - 273.15) * 9 / 5 + 32));
    let highCurrent = Math.round(((data.daily[0].temp.max - 273.15) * 9 / 5 + 32));
    let currentConditionsFormat = (data.current.weather[0].description).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    forecast.style.opacity = 0;
    weatherConditions.style.opacity = 0;
    weatherDisplay.style.opacity = 0;
    iconTest.style.opacity = 0;
    mainText.style.opacity = 0;

    setTimeout(() => {
        forecast.innerHTML = forecastHTML;
        weatherConditions.innerHTML = `
        <p class="current-conditions-main">Current Weather Conditions:</p>
        <p>Feels Like: <span class="bold-text">${feelsLikeConversion}&deg;</span></p>
        <p>Humidity: <span class="bold-text">${data.current.humidity}%</span></p>
        <p>Dew Point: <span class="bold-text">${dewPointConversion}&deg;</span></p>
        <p>Current UV index: <span class="bold-text">${data.current.uvi}</span></p>
        <p>Visibility: <span class="bold-text">${visibilityConversion} miles</span></p>
        <p>Wind Speed: <span class="bold-text">${windSpeedConversion} mph</span></p>`;

        iconTest.innerHTML = `<p>${headerFormattedDate}</p>
            <p class="temp-main">${converting}&deg; F</p>
            <img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="${data.current.weather[0].main}" class="main-icon-image"/>
            <p class="weather-conditions">${currentConditionsFormat}</p>
            <p>High: ${highCurrent}&deg;  Low: ${lowCurrent}&deg;</p>
            <p class="last-updated">Last updated at: ${formattedDate}</p>`

        forecast.style.opacity = 1;
        weatherConditions.style.opacity = 1;
        weatherDisplay.style.opacity = 1;
        iconTest.style.opacity = 1;
        mainText.style.opacity = 1;

        document.getElementById("containerOne").style.opacity = 1;
        document.getElementById("containerTwo").style.opacity = 1;
        document.getElementById("forecastContainer").style.opacity = 1;
        document.getElementById("mainHeading").style.opacity = 1;

    }, 750);
};

let currentLoc = document.getElementById("currentLocation");

document.getElementById("weatherButton").addEventListener("click", function () {

    const address = document.getElementById("addressInput").value;
    currentLoc.style.opacity = 0;
    document.getElementById("containerOne").style.opacity = 0;
    document.getElementById("containerTwo").style.opacity = 0;
    document.getElementById("forecastContainer").style.opacity = 0;
    document.getElementById("mainHeading").style.opacity = 0;

    setTimeout(() => {
        currentLoc.innerText = "";
        currentLoc.innerHTML = `<p>The current weather for <span class="city-state-bold">${address}</span></p>`
        geocodeAddress(address);
    }, 750);
});

document.getElementById("addressInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        const address = document.getElementById("addressInput").value;

        currentLoc.style.opacity = 0;
        document.getElementById("containerOne").style.opacity = 0;
        document.getElementById("containerTwo").style.opacity = 0;
        document.getElementById("forecastContainer").style.opacity = 0;
        document.getElementById("mainHeading").style.opacity = 0;

        setTimeout(() => {
            currentLoc.innerText = "";
            currentLoc.innerHTML = `<p>The current weather for <span class="city-state-bold">${address}</span></p>`
            geocodeAddress(address);
        }, 750);
    };
});

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("addressInput");
    inputField.addEventListener("focus", function () {
        this.select();
    });
});

function initAutocomplete() {
    const input = document.getElementById('addressInput');
    const options = {
        types: ['(cities)'],
    };
    let autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function () {
        let place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
    });
}

window.addEventListener("load", initAutocomplete);

document.getElementById('addressInput').addEventListener('input', function () {
    let inputLength = this.value.length;
    if (inputLength >= 3) {
        initAutocomplete();
    }
});



// Ensure that the window has loaded before registering the service worker
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
});


// Add this code after your service worker registration code
let deferredPrompt;
const installPopup = document.getElementById('installPopup');
const btnInstall = document.getElementById('btnInstall');
const btnCancel = document.getElementById('btnCancel');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to show the popup
    installPopup.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

btnInstall.addEventListener('click', (e) => {
    // hide our popup
    installPopup.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
    });
    document.getElementById('overlay').style.display = 'none';
});

btnCancel.addEventListener('click', (e) => {
    // hide our popup
    installPopup.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

window.addEventListener('appinstalled', (evt) => {
    // Log install to analytics
    console.log('INSTALL: Success');
});