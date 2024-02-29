async function geocodeAddress(address) {
    // Constructs the URL for the geocoding API call, encoding the address.
    const geocodeBackend = `https://weatherapi-ff1bda207bd9.herokuapp.com/api/geocode?address=${encodeURIComponent(address)}`;

    try {
        // Asynchronously fetches the geocode data from the backend.
        const response = await fetch(geocodeBackend);
        const data = await response.json();

        // Checks if the geocoding was successful.
        if (data.status === "OK") {
            // Extracts latitude and longitude from the response.
            const lat = data.lat;
            const lon = data.lon;
            // Calls `fetchWeather` with the latitude and longitude.
            fetchWeather(lat, lon);
        } else {
            // Logs error to console if geocode was unsuccessful.
            console.error("Geocode was not successful for the following reason: " + data.status);
            // Alerts the user for invalid input.
            if (data.status === "INVALID_REQUEST" || data.status === "ZERO_RESULTS") {
                alert("Please enter a valid location!");
            }
        }
    } catch (error) {
        // Catches and logs any error during the fetch operation.
        console.error("Error:", error);
    }
}

async function fetchWeather(lat, lon) {
    // Constructs the URL for the weather API call with latitude and longitude.
    const weatherBackend = `https://weatherapi-ff1bda207bd9.herokuapp.com/api/weather?lat=${lat}&lon=${lon}`;

    try {
        // Asynchronously fetches the weather data from the backend.
        const response = await fetch(weatherBackend);
        // Throws an error if response is not ok.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Calls `displayTemp` with the weather data.
        displayTemp(data);

    } catch (error) {
        // Catches and logs any error during the weather data fetch operation.
        console.error("Error fetching the weather data:", error);
    }
}

function displayTemp(data) {
    // Extracts the current temperature from the weather data.
    let temp = data.current.temp;

    // Initializes a variable to build HTML content for the forecast.
    let forecastHTML = "";
    // Loops through the daily forecast data, starting from index 1 (skipping the current day).
    for (let i = 1; i < data.daily.length; i++) {
        // Converts Unix timestamp to Date object for each day in the forecast.
        const dailyTimeStamp = data.daily[i].dt;
        const dailyDate = new Date(dailyTimeStamp * 1000);
        // Formats the date for display.
        const dailyOptions = { weekday: "short", month: "short", day: 'numeric' };
        const dailyFormattedDate = dailyDate.toLocaleDateString("en-US", dailyOptions);
        // Converts temperatures from Kelvin to Fahrenheit and rounds the result.
        let low = Math.round(((data.daily[i].temp.min - 273.15) * 9 / 5 + 32));
        let high = Math.round(((data.daily[i].temp.max - 273.15) * 9 / 5 + 32));
        // Builds HTML content for each day's forecast and appends it to `forecastHTML`.
        forecastHTML += `<div class="forecast-holder"><p>${dailyFormattedDate}</p><p class="forecast-low-temp">Low: ${low}&deg; F</p><p class="forecast-high-temp">High: ${high}&deg; F</p><img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png" alt="${data.current.weather[0].main}" /><p class="forecast-weather-condition">${data.daily[i].weather[0].main}</p></div>`
    }

    // References to DOM elements for displaying the weather data.
    const forecast = document.getElementById("forecast");
    const weatherConditions = document.getElementById("weatherConditions");
    const weatherDisplay = document.getElementById("weather");
    let iconTest = document.getElementById("icon");
    let mainText = document.getElementById("currentLocation");

    // Additional data conversions for display (wind speed, visibility, dew point, and "feels like" temperature).
    const windSpeedConversion = Math.round(data.current.wind_speed * 2.237);
    const visibilityConversion = Math.round(data.current.visibility / 1609);
    const dewPointConversion = Math.round(((data.current.dew_point - 273.15) * 9 / 5 + 32));
    const feelsLikeConversion = Math.round(((data.current.feels_like - 273.15) * 9 / 5 + 32));
    let converting = Math.round(((temp - 273.15) * 9 / 5 + 32));


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

    // Fade out effect for weather elements before updating.
    forecast.style.opacity = 0;
    weatherConditions.style.opacity = 0;
    weatherDisplay.style.opacity = 0;
    iconTest.style.opacity = 0;
    mainText.style.opacity = 0;

    // Updates the DOM with the new weather data after a brief delay.
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

        // Fade in effect to display updated weather data.
        forecast.style.opacity = 1;
        weatherConditions.style.opacity = 1;
        weatherDisplay.style.opacity = 1;
        iconTest.style.opacity = 1;
        mainText.style.opacity = 1;

        // Also updates opacity for additional UI elements.
        document.getElementById("containerOne").style.opacity = 1;
        document.getElementById("containerTwo").style.opacity = 1;
        document.getElementById("forecastContainer").style.opacity = 1;
        document.getElementById("mainHeading").style.opacity = 1;

    }, 750); // Delay before update.
};

// Retrieves the element that displays the current location's weather information.
let currentLoc = document.getElementById("currentLocation");

// Adds a click event listener to the "weatherButton". When clicked, it will fetch and display the weather for the specified address.
document.getElementById("weatherButton").addEventListener("click", function () {
    // Retrieves the user-entered address from the "addressInput" input field.
    const address = document.getElementById("addressInput").value;
    // Sets the opacity of the current location and several containers to 0, initiating a fade-out effect.
    currentLoc.style.opacity = 0;
    document.getElementById("containerOne").style.opacity = 0;
    document.getElementById("containerTwo").style.opacity = 0;
    document.getElementById("forecastContainer").style.opacity = 0;
    document.getElementById("mainHeading").style.opacity = 0;

    // After a short delay (750 milliseconds), updates the current location's inner text and HTML to display the weather for the new address.
    setTimeout(() => {
        currentLoc.innerText = ""; // Clears any existing text in the "currentLocation" element.
        // Updates the "currentLocation" element's HTML to include the specified address, emphasizing it with a "city-state-bold" class.
        currentLoc.innerHTML = `<p>The current weather for <span class="city-state-bold">${address}</span></p>`
        geocodeAddress(address); // Calls a function to geocode the provided address and presumably fetch weather data for it.
    }, 750);
});

// Adds a "keypress" event listener to the "addressInput" field. If the Enter key is pressed, it behaves similarly to clicking the weather button.
document.getElementById("addressInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") { // Checks if the pressed key is the Enter key.
        event.preventDefault(); // Prevents the default action of the Enter key (e.g., submitting a form).

        // Similar to the click event listener, fetches the address and fades out the relevant elements.
        const address = document.getElementById("addressInput").value;
        currentLoc.style.opacity = 0;
        document.getElementById("containerOne").style.opacity = 0;
        document.getElementById("containerTwo").style.opacity = 0;
        document.getElementById("forecastContainer").style.opacity = 0;
        document.getElementById("mainHeading").style.opacity = 0;

        // After a delay, updates the "currentLocation" with the new address and fetches the weather.
        setTimeout(() => {
            currentLoc.innerText = "";
            currentLoc.innerHTML = `<p>The current weather for <span class="city-state-bold">${address}</span></p>`
            geocodeAddress(address);
        }, 750);
    };
});

// Adds an event listener for when the document is fully loaded and interactive ("DOMContentLoaded").
document.addEventListener("DOMContentLoaded", function () {
    // Retrieves the "addressInput" field.
    const inputField = document.getElementById("addressInput");
    // Adds a "focus" event listener to the input field. When it receives focus, all of its text is selected.
    inputField.addEventListener("focus", function () {
        this.select(); // Automatically selects (highlights) all text in the input field, making it easier to replace.
    });
});

// Initializes autocomplete functionality for the address input field, restricting to city names.
function initAutocomplete() {
    const input = document.getElementById('addressInput');
    const options = {
        types: ['(cities)'], // Restrict the search to city names only.
    };
    // Creates a new autocomplete object attached to the address input field.
    let autocomplete = new google.maps.places.Autocomplete(input, options);
    // Adds an event listener that triggers when the place in the autocomplete dropdown is changed.
    autocomplete.addListener('place_changed', function () {
        let place = autocomplete.getPlace();
        // If the selected place does not have a geometry property, return early.
        if (!place.geometry) {
            return;
        }
    });
}

// Adds an event listener that initializes the autocomplete functionality when the window loads.
window.addEventListener("load", initAutocomplete);

// Adds an event listener to dynamically initialize autocomplete functionality based on the input length.
document.getElementById('addressInput').addEventListener('input', function () {
    let inputLength = this.value.length;
    // If the user has typed 3 or more characters, initialize the autocomplete functionality.
    if (inputLength >= 3) {
        initAutocomplete();
    }
});

// Registers a service worker when the window loads, enabling offline capabilities and other PWA features.
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
});

let deferredPrompt; // Holds the event prompting the user to install the web app.
const installPopup = document.getElementById('installPopup'); // References the installation prompt's popup.
const btnInstall = document.getElementById('btnInstall'); // References the installation button.
const btnCancel = document.getElementById('btnCancel'); // References the cancel button of the installation prompt.

// Listens for the 'beforeinstallprompt' event and shows an install prompt to the user.
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevents the default install prompt from being shown.
    deferredPrompt = e; // Saves the event for later use.
    installPopup.style.display = 'block'; // Shows the custom install prompt popup.
    document.getElementById('overlay').style.display = 'block'; // Displays an overlay behind the install prompt.
});

// Adds an event listener to the install button within the custom install prompt.
btnInstall.addEventListener('click', (e) => {
    installPopup.style.display = 'none'; // Hides the install prompt popup.
    deferredPrompt.prompt(); // Shows the default install prompt.
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt'); // Logs if the user accepted the prompt.
        } else {
            console.log('User dismissed the A2HS prompt'); // Logs if the user dismissed the prompt.
        }
        deferredPrompt = null; // Resets the deferred prompt variable.
    });
    document.getElementById('overlay').style.display = 'none'; // Hides the overlay.
});

// Adds an event listener for the cancel button within the custom install prompt.
btnCancel.addEventListener('click', (e) => {
    installPopup.style.display = 'none'; // Hides the install prompt popup.
    document.getElementById('overlay').style.display = 'none'; // Hides the overlay.
});

// Listens for the 'appinstalled' event and logs a success message when the app is installed.
window.addEventListener('appinstalled', (evt) => {
    console.log('INSTALL: Success'); // Logs a message indicating successful installation.
});