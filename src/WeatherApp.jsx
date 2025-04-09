import React, { useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { BiRefresh } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [isDarkMode, ImplementDarkMode] = useState(true);
  const [lastCity, setLastCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchHistory, MySearches] = useState([]);
  const [showHistory, ShowHistory] = useState(true);

  const apiKey = "c1bbf9dc91be4fb166da4ca1f05cdbe7";

  const fetchWeather = async (cityName = city) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;

    setLoading(true);
    setWeather(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmed}&appid=${apiKey}&units=metric`
      );
      const fetchedCity = response.data.name;
      setWeather(response.data);
      setLastCity(fetchedCity);
      setCity("");

      MySearches((prev) => {
        const filtered = prev.filter(
          (item) => item.toLowerCase() !== fetchedCity.toLowerCase()
        );
        return [fetchedCity, ...filtered].slice(0, 5);
      });
    } catch (err) {
      alert("City not found");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const handleRefresh = () => {
    if (lastCity) fetchWeather(lastCity);
  };

  const removeHistoryItem = (item) => {
    MySearches((prev) => prev.filter((city) => city !== item));
  };

  const toggleHistory = () => ShowHistory((prev) => !prev);

  const getWeatherIcon = () => {
    const weatherMain = weather.weather[0].main.toLowerCase();
    switch (weatherMain) {
      case "clouds":
        return "/images/clouds.png";
      case "clear":
        return "/images/clear.png";
      case "drizzle":
        return "/images/drizzle.png";
      case "mist":
        return "/images/mist.png";
      case "rain":
        return "/images/rain.png";
      case "snow":
        return "/images/snow.png";
      default:
        return "/images/clear.png";
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-teal-400 to-blue-500"
          : "bg-gray-900"
      }`}
    >
      <div
        className={`relative ${
          isDarkMode ? "bg-white/10 text-white" : "bg-gray-800 text-white"
        } backdrop-blur-lg rounded-3xl p-8 w-[520px] text-center shadow-xl transition-colors duration-500`}
      >
        {/* Top Row - Refresh (left) + Toggle Theme (right) */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleRefresh}
            title="Refresh"
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <BiRefresh className="text-white text-lg" />
          </button>

          <button
            onClick={() => ImplementDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white/20 hover:bg-gray-500/30 transition"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <BsSunFill className="text-yellow-300" />
            ) : (
              <BsMoonFill className="text-white" />
            )}
          </button>
        </div>

        {/* Search bar */}
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-full mb-3 ${
            isDarkMode ? "bg-white/20" : "bg-gray-500"
          }`}
        >
          <input
            type="text"
            placeholder="Search city..."
            className={`bg-transparent outline-none flex-1 text-lg ${
              isDarkMode
                ? "text-white placeholder-white"
                : "text-white placeholder-white"
            }`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => fetchWeather(city)}
            className="p-1 hover:scale-110 transition"
          >
            <FiSearch
              size={24}
              className={isDarkMode ? "text-white" : "text-gray-700"}
            />
          </button>
        </div>

        {/* History Dropdown */}
        <div className="mb-4 text-left">
          <div className="flex justify-between items-center px-2">
            <p className="text-sm font-semibold text-white/80">
              Recent Searches
            </p>
            <button
              onClick={toggleHistory}
              className="text-xs text-blue-200 hover:underline"
            >
              {showHistory ? "Hide" : "Show"}
            </button>
          </div>
          {showHistory && searchHistory.length > 0 && (
            <ul className="bg-white/10 mt-1 rounded-lg py-2 px-3 space-y-1 max-h-40 overflow-y-auto">
              {searchHistory.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center cursor-pointer hover:bg-white/20 px-2 py-1 rounded-md"
                >
                  <span onClick={() => fetchWeather(item)}>{item}</span>
                  <AiOutlineClose
                    className="ml-2 text-white/70 hover:text-red-400"
                    onClick={() => removeHistoryItem(item)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Loader */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center my-8"
          >
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}

        {/* Weather Data */}
        {weather && (
          <>
            <img
              src={getWeatherIcon()}
              alt="weather icon"
              className="w-28 h-28 mx-auto mb-4"
            />
            <h1 className="text-5xl font-bold">
              {Math.round(weather.main.temp)}°C
            </h1>
            <h2 className="text-2xl font-medium mt-1">{weather.name}</h2>

            <div className="flex justify-around mt-6 text-center">
              <div className="flex flex-col items-center">
                <img
                  src="/images/humidity.png"
                  alt="Humidity"
                  className="w-10 h-10 mb-2"
                />
                <p className="text-xl">{weather.main.humidity}%</p>
                <p className="text-sm">Humidity</p>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src="/images/wind.png"
                  alt="Wind Speed"
                  className="w-10 h-10 mb-2"
                />
                <p className="text-xl">{weather.wind.speed} km/h</p>
                <p className="text-sm">Wind Speed</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
