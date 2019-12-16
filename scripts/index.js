// get weather from openweathermap open API

const key = 'ce36c4fe40c0c78389460527afbb42ee';
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;

function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}
// Global variables
var weatherGroup;
var weatherDescription;

function getWeather() {
    var weatherurl = `http://api.openweathermap.org/data/2.5/weather?appid=ce36c4fe40c0c78389460527afbb42ee&q=Hsinchu`;
    $.ajax({
        type: "GET",
        url: weatherurl,
        dataType: "json",
        async: false,
        success: function(response) {
            console.log(response.weather[0].id);
            console.log(getWeatherGroup(response.weather[0].id));
            console.log(response.weather[0].description);
            weatherGroup = getWeatherGroup(response.weather[0].id);
            weatherDescription = response.weather[0].description;
        }
    })

}


window.onload = function() {
    getWeather();
    var weatherImg = document.querySelector(".weather-img");
    var weatherText = document.querySelector(".weather-text");
    var bikeAdvice = document.querySelector(".bike-advice");
    weatherImg.innerHTML = `<img src="image/${weatherGroup}.png" alt="clear">`;
    weatherText.textContent = `Today's weather is ${weatherDescription}`;

    if (weatherGroup === "drizzle" || weatherGroup === "rain") {
        bikeAdvice.textContent = `下雨囉! 把車放在屋簷下!`
    } else if (this.weatherGroup === "atmosphere") {
        bikeAdvice.textContent = `起霧囉! 小心車會積露水!`
    } else if (this.weatherGroup === "clear") {
        bikeAdvice.textContent = `太陽曬屁股囉! 把車牽在陰陽處!`
    }

}