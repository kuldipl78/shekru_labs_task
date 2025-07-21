const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

// Get conversion rate
app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  try {
    const response = await axios.get(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "API call failed" });
  }
});

// Get currency symbols
app.get("/api/symbols", async (req, res) => {
  try {
    const response = await axios.get("https://api.exchangerate.host/symbols");
    res.json(response.data.symbols); // return only symbols object
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch symbols" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
