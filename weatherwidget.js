class WeatherWidget extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.render();
        this.onComponentDefined();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <img src="" alt="">
        <p id="short-forecast"></p>
        <p id="temperature"></p>
        `;
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
                if(name.toLowerCase().includes("night"))
                {
                    nightMode = true;
                }
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
                console.log(forecastWidget.querySelector('img').src);


                forecastWidget.querySelector('#temperature').innerText = temp + " " + tempUnit;
                forecastWidget.querySelector('#short-forecast').innerText = shortForecast;  
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