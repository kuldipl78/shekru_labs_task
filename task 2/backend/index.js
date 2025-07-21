// backend/index.js or server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    const { temp, humidity } = response.data.main;
    const { description, icon } = response.data.weather[0];
    const { speed } = response.data.wind;

    res.json({
      temperature: temp,
      humidity,
      description,
      icon,
      windSpeed: speed,
      city: response.data.name,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(404).json({ error: "City not found or API error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
