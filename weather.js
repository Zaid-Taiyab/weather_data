const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const city = req.query.city;
  const apiKey = ""; 
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  try {
    const response = await axios.get(APIUrl);
    
    const weather = response.data;
    
    const isCloudy = weather.weather && weather.weather.length > 0 && weather.weather[0].main === "Clouds";
    const isDayTime = weather.sys && weather.sys.sunrise && weather.sys.sunset
      ? (new Date().getTime() / 1000) >= weather.sys.sunrise && (new Date().getTime() / 1000) < weather.sys.sunset
      : false;
    
    res.render("weather", { weather, error: null, isCloudy, isDayTime });
  } catch (error) {
    res.render("weather", { weather: null, error: "Error, please try again", isCloudy: false, isDayTime: false });
  }
});

module.exports = router;
