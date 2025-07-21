import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:5000/api/weather`, {
        params: { city },
      });

      
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App 🌤️</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-data">
          <h2>{weather.city}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather icon"
          />
          <p><strong>{weather.description}</strong></p>
          <p>🌡️ Temperature: {weather.temperature}°C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬️ Wind Speed: {weather.windSpeed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
