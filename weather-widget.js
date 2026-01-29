class WeatherWidget {
    constructor() {
        this.apiBase = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingBase = 'https://geocoding-api.open-meteo.com/v1/search';
        this.defaultLocation = { latitude: 51.5074, longitude: -0.1278 }; // London fallback
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadWeather();
    }

    bindEvents() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadWeather();
        });
    }

    async loadWeather() {
        try {
            this.showLoading();
            const position = await this.getCurrentPosition();
            const weatherData = await this.fetchWeatherData(position.latitude, position.longitude);
            const locationName = await this.getLocationName(position.latitude, position.longitude);
            this.updateDisplay(weatherData, locationName);
            this.hideError();
        } catch (error) {
            console.error('Weather loading error:', error);
            this.showError('Unable to load weather data. Please try again.');
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported, using default location');
                resolve(this.defaultLocation);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                    resolve(this.defaultLocation);
                },
                { 
                    timeout: 10000,
                    enableHighAccuracy: false,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    async fetchWeatherData(lat, lon) {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
            timezone: 'auto'
        });
        const response = await fetch(`${this.apiBase}?${params}`);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.current) {
            throw new Error('Invalid weather data received');
        }
        return data;
    }

    async getLocationName(lat, lon) {
        try {
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                count: 1,
                language: 'en',
                format: 'json'
            });
            const response = await fetch(`${this.geocodingBase}?${params}`);
            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    return result.name + (result.country ? `, ${result.country}` : '');
                }
            }
        } catch (error) {
            console.warn('Geocoding error:', error);
        }
        return 'Unknown Location';
    }

    updateDisplay(data, locationName) {
        const current = data.current;
        document.getElementById('location').textContent = locationName;
        document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
        // Add weather icon before condition text
        const icon = this.getWeatherIcon(current.weather_code);
        document.getElementById('condition').textContent = `${icon} ${this.getWeatherDescription(current.weather_code)}`;
        document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
        document.getElementById('wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        document.getElementById('weatherWidget').classList.remove('loading');
    }


    /**
     * Get weather icon for WMO code
     */
    getWeatherIcon(code) {
        const iconMap = {
            0: '☀️',    // Clear sky
            1: '🌤️',    // Mainly clear
            2: '⛅',    // Partly cloudy
            3: '☁️',    // Overcast
            45: '🌫️',   // Fog
            48: '🌫️',   // Depositing rime fog
            51: '🌦️',   // Light drizzle
            53: '🌦️',   // Moderate drizzle
            55: '🌦️',   // Dense drizzle
            56: '🌧️',   // Light freezing drizzle
            57: '🌧️',   // Dense freezing drizzle
            61: '🌧️',   // Slight rain
            63: '🌧️',   // Moderate rain
            65: '🌧️',   // Heavy rain
            66: '🌧️',   // Light freezing rain
            67: '🌧️',   // Heavy freezing rain
            71: '🌨️',   // Slight snow fall
            73: '🌨️',   // Moderate snow fall
            75: '🌨️',   // Heavy snow fall
            77: '🌨️',   // Snow grains
            80: '🌦️',   // Slight rain showers
            81: '🌦️',   // Moderate rain showers
            82: '🌦️',   // Violent rain showers
            85: '🌨️',   // Slight snow showers
            86: '🌨️',   // Heavy snow showers
            95: '⛈️',   // Thunderstorm
            96: '⛈️',   // Thunderstorm with slight hail
            99: '⛈️'    // Thunderstorm with heavy hail
        };
        return iconMap[code] || '🌡️';
    }

    getWeatherDescription(code) {
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        return weatherCodes[code] || 'Unknown';
    }

    showLoading() {
        document.getElementById('weatherWidget').classList.add('loading');
        document.getElementById('temperature').textContent = 'Loading...';
        document.getElementById('condition').textContent = 'Fetching data...';
        document.getElementById('location').textContent = 'Getting location...';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        document.getElementById('weatherWidget').classList.remove('loading');
        document.getElementById('temperature').textContent = '--°';
        document.getElementById('condition').textContent = 'Error';
        document.getElementById('location').textContent = 'Unable to load';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
});
