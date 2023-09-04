const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.get("/weather", async (req, res) => {
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
    
    res.render("index", { weather, error: null, isCloudy, isDayTime });
  } catch (error) {
    res.render("index", { weather: null, error: "Error, please try again", isCloudy: false, isDayTime: false });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
