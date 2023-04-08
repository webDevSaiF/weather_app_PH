//USER LOCATION
(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getLocation(latitude, longitude);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
})();

function getLocation(latitude, longitude) {
  // RECEIVING DATA
  async function loadData() {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9597a0a9db407aaae8bbaeabd461ee36`
    );
    const data = await response.json();
    return data;
  }
  loadData()
    .then((data) => printData(data))
    .catch((err) => {
      console.log(err);
    });

  // PRINTING DATA
  function printData(obj) {
    const locationTime = document.querySelector(".weather-status h6.time");

    const { temp } = obj.main;

    // SET LOCATION
    const { country } = obj.sys;
    const weatherLocationName = document.querySelector(".weather-status h6");
    weatherLocationName.innerText = obj.name + ", " + country;

    // GET & SET GLOBAL TIME
    function timeLoad() {
      const { timezone } = obj;
      const currentTime = new Date();
      const gmtTime = new Date(currentTime.getTime() - timezone * 1000);
      const hours = gmtTime.getUTCHours();
      const minutes = gmtTime.getUTCMinutes();
      const ampm = hours <= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      locationTime.innerText = `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    timeLoad();
    setInterval(timeLoad, 30000);

    // SET TEMPERATURE
    const weatherLocationTemp = document.querySelector(".showTemp");
    weatherLocationTemp.innerText = `${temp - 273.15}°C`;
    console.log(obj);

    // SET WEATHER CONDITION
    const weatherLocationStatus = document.querySelector(".w-condition");
    weatherLocationStatus.innerText = obj.weather[0].main;

    // CHANGING IMAGE
    const weatherLocationImage = document.querySelector(".weather-status img");
    const iconID = obj.weather[0].icon;
    weatherLocationImage.src = `https://openweathermap.org/img/wn/${iconID}@2x.png`;

    //SET WIND AND DIRECTION
    const { speed, deg } = obj.wind;
    const windSpeed = document.querySelector(".wind-speed");
    const windDirection = document.querySelector(".wind-direction");
    let direction = "";
    windSpeed.innerText = `${speed} km/h`;

    if (deg >= 0 && deg < 90) {
      direction = "North-East";
    } else if (deg >= 90 && deg < 180) {
      direction = "South-East";
    } else if (deg >= 180 && deg < 270) {
      direction = "South-West";
    } else if (deg >= 270 && deg <= 360) {
      direction = "North-West";
    }
    windDirection.innerText = `${direction}`;

    // SET SUNRISE AND SUNSET
    const printSunrise = document.querySelector(".sunrise");
    const printSunset = document.querySelector(".sunset");

    const { sunrise, sunset } = obj.sys;
    const sunriseTime = new Date(sunrise * 1000);
    printSunrise.innerText = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()} AM`;

    const sunsetTime = new Date(sunset * 1000);
    printSunset.innerText = `${
      sunsetTime.getHours() - 12
    }:${sunsetTime.getMinutes()} PM`;
  }
}
