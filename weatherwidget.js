class WeatherWidget extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.render();
        this.onComponentDefined();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                background: rgb(2,0,36);
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
                grid-column-gap: 0px;
                grid-row-gap: 0px;
                background: radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 47%, rgba(0,212,255,1) 100%);
                border: 5px black solid;
                border-radius: 10px;
                padding: 10px;
                color: white;
                height: fit-content;
                width: fit-content;
            }
            img { grid-area: 1 / 1 / 2 / 2; }
            #summary { grid-area: 1 / 2 / 2 / 3;
        height: fit-content; }
            #other-info { grid-area: 2 / 1 / 3 / 3; }
            #short-forecast, #temperature{
                font-size: 2.5rem;
                font-weight: bold;
            }
            img, #summary{
                padding: 10px;
            }
            #summary > * {
                margin: 0.5rem;
            }
            img{
                width: 100px;
            }
            #other-info {
                text-align: center;
            }
        </style>
        <img src="" alt="">
        <div id= "summary">
            <p id="short-forecast"></p>
            <p id="temperature"></p>
        </div>
        <div id= "other-info">
            <p id="dewpoint">Dew Point: </p>
            <p id="precipitation">Chance of Rain: </p>
            <p id="humidity">Humidity: </p>
            <p id="wind-speed">Wind Speed: </p>
        </div>
        `;
    }

    CtoF(celsius){
        const fahrenheit = (celsius * 9 / 5) + 32;
        return fahrenheit.toFixed(1);

    }

    onComponentDefined() {
        const URL = 'https://api.weather.gov/points/32.8801,-117.2341';
        const forecastWidget = this.shadowRoot;

        fetch(URL)
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const forecastURL = data.properties.forecast;
            fetch(forecastURL)
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse the JSON response
                return response.json();
            })
            .then(data => {
                // Handle the data from the response
                const forecast = data.properties.periods[0];
                const name = forecast.name;
                let nightMode = false;
                const temp = forecast.temperature;
                const tempUnit = forecast.temperatureUnit;
                const shortForecast = forecast.shortForecast;
                const dewpoint = forecast.dewpoint.unitCode === "wmoUnit:degC" ? this.CtoF(forecast.dewpoint.value) + " F" : forecast.dewpoint.value + " F";
                const humidity = forecast.relativeHumidity.unitCode === "wmoUnit:percent" ? forecast.relativeHumidity.value + "%" : "Humidity data unavailable";
                const precipitation = forecast.probabilityOfPrecipitation.unitCode === "wmoUnit:percent" ? (forecast.probabilityOfPrecipitation.value == null ? 0 : forecast.probabilityOfPrecipitation.value) + "%" : "Precipitation data unavailable";
                const windSpeed = `${forecast.windSpeed} ${forecast.windDirection}`;
                nightMode = !forecast.isDaytime;
                if(shortForecast.toLowerCase().includes("rain")){
                    forecastWidget.querySelector('img').src = "icons/rain.png";
                }
                else if(shortForecast.toLowerCase().includes("showers") || shortForecast.toLowerCase().includes("drizzle")){
                    forecastWidget.querySelector('img').src = "icons/drizzle.png";
                }
                else if(shortForecast.toLowerCase().includes("snow") || shortForecast.toLowerCase().includes("sleet")){
                    forecastWidget.querySelector('img').src = "icons/snow.png";
                }
                else if(shortForecast.toLowerCase().includes("storm")){
                    forecastWidget.querySelector('img').src = "icons/thunderstorms.png";
                }
                else if(shortForecast.toLowerCase().includes("wind") || shortForecast.toLowerCase().includes("gust")){
                    forecastWidget.querySelector('img').src = "icons/wind.png";
                }
                else if(shortForecast.toLowerCase().includes("mostly clear") || shortForecast.toLowerCase().includes("partly clear")){
                    forecastWidget.querySelector('img').src = nightMode ? "icons/mostly_clear_night.png" : "icons/mostly_clear.png";
                }
                else if(shortForecast.toLowerCase().includes("mostly cloudy") || shortForecast.toLowerCase().includes("partly cloudy")){
                    forecastWidget.querySelector('img').src = nightMode ? "icons/mostly_cloudy_night.png" : "icons/mostly_cloudy.png";
                }
                else if(shortForecast.toLowerCase().includes("cloudy") || shortForecast.toLowerCase().includes("overcast")){
                    forecastWidget.querySelector('img').src = "icons/cloudy.png";
                }
                else
                {
                    forecastWidget.querySelector('img').src = nightMode ? "icons/clear_night.png" : "icons/clear.png";
                }
                // console.log(forecast);
                forecastWidget.querySelector('#temperature').innerText = temp + " " + tempUnit;
                forecastWidget.querySelector('#short-forecast').innerText = shortForecast;

                forecastWidget.querySelector('#dewpoint').innerText += " " + dewpoint;  
                forecastWidget.querySelector('#precipitation').innerText += " " + precipitation;  
                forecastWidget.querySelector('#humidity').innerText += " " + humidity;  
                forecastWidget.querySelector('#wind-speed').innerText += " " + windSpeed;  
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

}

customElements.define('weather-widget', WeatherWidget);