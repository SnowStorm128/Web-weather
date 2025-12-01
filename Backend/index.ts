import express from "express";
import { exec } from "child_process";
const app = express();

app.use(express.static('../Frontend/Weather-FrontEnd/dist'));

// In-memory cache
let cachedWeatherData: any = null;

// Function to fetch data from Python script
function fetchWeatherData() {
    exec("python3 ../../main.py -api", (error, stdout, stderr) => {
        if (error) {
            console.error("Python script error:", error);
            return;
        }
        try {
            cachedWeatherData = JSON.parse(stdout);
            console.log("Weather data updated:", new Date().toISOString());
        } catch (e) {
            console.error("Failed to parse JSON from Python:", e);
        }
    });
}

// Fetch data on server startup
fetchWeatherData();

// Schedule daily update at 06:00 AM (server time)
const now = new Date();
const millisTill6 =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0).getTime() - now.getTime();
const oneDay = 24 * 60 * 60 * 1000;

// If 6AM already passed today, schedule for tomorrow
setTimeout(function () {
    fetchWeatherData();
    setInterval(fetchWeatherData, oneDay);
}, millisTill6 > 0 ? millisTill6 : millisTill6 + oneDay);

app.get("/api/weather", (req, res) => {
    if (!cachedWeatherData) {
        return res.status(503).json({ error: "Weather data not ready yet" });
    }
    res.json(cachedWeatherData);
});


app.listen(3000, () => console.log("Server running on port 3000"));