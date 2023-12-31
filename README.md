# Weather

<img src="https://github.com/TubaJordan/Weather/blob/main/images/Display.png">

## Table of Contents

- [Introduction](#introduction)
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [PWA and Service Workers](#pwa-and-service-workers)
- [Project Dependencies](#project-dependencies)

## Introduction

Weather is a simple Progressive Web App (PWA) designed to provide quick and accurate weather information, with an emphasis on simplicity and effectiveness.

## Overview

This app offers a simple interface where users can search for weather data by entering a City, State, and the app displays current conditions as well as a seven-day forecast.

## Live Demo

[Click here for the Live Site](https://tubajordan.github.io/Weather/)

## Features

- **Responsive Design**: The app works well on both desktop and mobile devices.
- **Accurate Weather Data**: Current weather conditions are served from Open Weather Map.
- **Weekly Weather Forecast**: Users can view the weather forecast for the next seven days.
- **Location-Based Searches**: The app allows users to enter a location to retrieve weather data.

## PWA and Service Workers

As a Progressive Web App, Weather includes features like:

- **Offline Functionality**: Users can access key features of the app even without an internet connection, thanks to service workers.
- **Installable**: The app can be added to the home screen of a device and used like a native application.
- **Fast Performance**: Service workers help in efficient loading and caching of resources.

## Project Dependencies

- HTML
- CSS
- JavaScript
- [Google Maps API](https://maps.googleapis.com) for geocoding and autocomplete functionality
- [OpenWeatherMap API](https://openweathermap.org/api)
- Service Worker for offline access and performance optimization
- Custom in-house API for processing and serving weather data
