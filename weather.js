const express = require("express");
const axios = require("axios");
const router = express.Router();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); 
require('dotenv').config();

router.get("/", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;
  const units = req.query.units || 'imperial'; 
  const cacheKey = `${city}-${units}`;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  
  if (!city) {
    return res.render("weather", { weather: null, error: "City is required", isCloudy: false, isDayTime: false });
  }
  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.render("weather", { ...cachedData, error: null });
    }
    
    const response = await axios.get(APIUrl);
    const weather = response.data;
    const isCloudy = weather.weather && weather.weather.length > 0 && weather.weather[0].main === "Clouds";
    const isDayTime = weather.sys && weather.sys.sunrise && weather.sys.sunset
      ? (new Date().getTime() / 1000) >= weather.sys.sunrise && (new Date().getTime() / 1000) < weather.sys.sunset
      : false;

    const responseData = { weather, isCloudy, isDayTime };

    cache.set(cacheKey, responseData);

    res.render("weather", { ...responseData, error: null });
  } catch (error) {
    let errorMessage = "Error, please try again";
    if (error.response && error.response.status === 404) {
      errorMessage = "City not found";
    } else if (error.response) {
      errorMessage = `Error: ${error.response.data.message}`;
    }
    res.render("weather", { weather: null, error: errorMessage, isCloudy: false, isDayTime: false });
  }
});

module.exports = router;
