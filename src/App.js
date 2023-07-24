import { useEffect, useState } from "react";
import "./App.css";
import weather_code from "./assets/weather_code.json";
import right_arrow from "./image/right-arrow (1).png";
import left_arrow from "./image/left-arrow.png";

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d;
};

function App() {
  const [info, setInfo] = useState(null);
  const [toTheRight, setToTheRight] = useState(false);
  function fetchHandler() {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=22.5455&longitude=114.0683&hourly=temperature_2m,relativehumidity_2m,rain,weathercode,windspeed_10m,uv_index&daily=sunrise,sunset,uv_index_max&current_weather=true&timezone=auto"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setInfo(data);
      });
  }

  function handleRight() {
    setToTheRight(true);
  }

  function handleLeft() {
    setToTheRight(false);
  }
  useEffect(() => {
    fetchHandler();
    // console.log(weather_code[info.current_weather.weathercode]);
  }, []);

  if (info == null) {
    return <div className="loading">loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="heading">This is a weather app</h1>
        <label>Latitude: </label>
        <input></input>
        <label>Longtitude: </label>
        <input></input>
      </div>
      <div className="current_weather">
        <div className="row">
          {weekday[formatDate(info.current_weather.time).getDay()]}{" "}
          {formatDate(info.current_weather.time).getDate()}|
          {info.current_weather.is_day ? "Day" : "Night"}
        </div>
        <div className="row">
          <h1 className="temperature">{info.current_weather.temperature}°</h1>
          {/* <div></div> */}
          <img
            className="image"
            src={weather_code[info.current_weather.weathercode].day.image}
            alt="sun"
          />
          <div className="rain_and_wind">
            <p>
              Rain:{" "}
              {
                info.hourly.rain[
                  formatDate(info.current_weather.time).getHours()
                ]
              }{" "}
              mm
            </p>
            <p>
              Wind:{" "}
              {
                info.hourly.windspeed_10m[
                  formatDate(info.current_weather.time).getHours()
                ]
              }{" "}
              km/h
            </p>
          </div>
        </div>
        <div className="row">
          {weather_code[info.current_weather.weathercode].day.description}
        </div>
      </div>
      <div className="extra_info">
        <div className="row">
          <div className="attribute">
            <p className="title">Humidity</p>
            <p className="value">
              {" "}
              {
                info.hourly.relativehumidity_2m[
                  formatDate(info.current_weather.time).getHours()
                ]
              }{" "}
              %
            </p>
          </div>
          <div className="attribute">
            <p className="title">UV Index</p>
            <p className="value">
              {" "}
              {
                info.hourly.uv_index[
                  formatDate(info.current_weather.time).getHours()
                ]
              }{" "}
              of 11
            </p>
          </div>
        </div>
        <div className="row">
          <div className="attribute">
            <p className="title">Sunrise</p>
            <p className="value">
              {formatDate(info.daily.sunrise[0]).getHours()}:
              {formatDate(info.daily.sunrise[0]).getMinutes()}
            </p>
          </div>
          <div className="attribute">
            <p className="title">Sunset</p>
            <p className="value">
              {formatDate(info.daily.sunset[0]).getHours()}:
              {formatDate(info.daily.sunset[0]).getMinutes()}
            </p>
          </div>
        </div>
      </div>
      <div className="hourly_weather">
        <div className="row">
          <h1 className="hourly_forecast">hourly forecast</h1>
        </div>

        <div className="row" id="hourly_row">
          <img
            className="left_arrow"
            src={left_arrow}
            onClick={handleLeft}
          ></img>
          <img
            className="right_arrow"
            src={right_arrow}
            onClick={handleRight}
          ></img>
          {info.hourly.time.map((time, index) => {
            if (
              index < formatDate(info.current_weather.time).getHours() ||
              index > formatDate(info.current_weather.time).getHours() + 15
            ) {
              return null;
            }
            return (
              <Hourly_card
                key={index}
                time={formatDate(time).getHours()}
                weather_code={info.hourly.weathercode[index]}
                temperature={info.hourly.temperature_2m[index]}
                toTheRight={toTheRight}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

function Hourly_card(props) {
  return (
    <div className={`hourly ${props.toTheRight ? "rightward" : ""}`}>
      <p>{props.time}</p>
      <img src={weather_code[props.weather_code].day.image}></img>
      <h1>{props.temperature}°</h1>
    </div>
  );
}
