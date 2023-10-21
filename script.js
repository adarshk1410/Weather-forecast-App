const temp = document.getElementById("temp"),
date = document.getElementById("date-time"),
currentLocation = document.getElementById("location"),
condition = document.getElementById("condition"),
mainIcon = document.getElementById("icon"),
humidity = document.querySelector(".humidity"),
humidity_status = document.querySelector(".humidity-status"),
visibility = document.querySelector(".visibility"),
visibility_status = document.querySelector(".visibility-status"),
windspeed = document.querySelector(".wind-speed"),
Sunrise = document.querySelector(".Sunrise"),
Sunset = document.querySelector(".Sunset"),
weatherCards = document.querySelector("#weather-cards"),
celciusBtn = document.querySelector(".celcius"),
farenheitBtn = document.querySelector(".Farenheit"),
hourlyBtn = document.querySelector(".hourly"),
weekBtn = document.querySelector(".week"),
tempUnit = document.querySelectorAll(".temp-unit"),
searchForm = document.querySelector("#search"),
search = document.querySelector("#query");
const cityArray = [];

let currentCity = ""; 
let currentUnit = "C";
let hourlyorWeek = "Week";

//Update date time
function getDateTime(){
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();
    seconds = now.getSeconds();
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ]

    hour = hour%12;
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}:${seconds}`;
}

date.innerText = getDateTime();

//update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

//function to get public IP with Fetch
function getPublicIp(){
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
            console.log(data);
            currentCity = data.city;           ;
            getWeatherData(data.city, currentUnit, hourlyorWeek)
    });
}

getPublicIp();

//function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    const apikey = "Z7AXEZHC7PSS6RKQVFSD3UZB8";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,
    {
        method: "GET",
    }
  )
   .then((response) => response.json())
   .then((data) => {
    currentLocation.innerText = data.resolvedAddress;
    console.log(data);
    let today = data.currentConditions;
    if(unit === 'C'){
        temp.innerText = today.temp;
    }else{
        temp.innerText = celciusToFarenheit(today.temp);
    }
    condition.innerText = today.conditions;
    humidity.innerText = today.humidity + "%";
    visibility.innerText = today.visibility;
    windspeed.innerText = today.windspeed;
    Sunrise.innerText = convertTo12(today.sunrise);
    Sunset.innerText = convertTo12(today.sunset);
    updateHumidityStatus(humidity);
    updateVisibilityStatus(visibility);
    mainIcon.src = getIcon(today.icon); 
    changeBackground(today.icon); 
    if(hourlyorWeek === "hourly"){
        updateForecast(data.days[0].hours, unit, "day"); 
    }else{
        updateForecast(data.days, unit, "week");
    }
  })
  .catch((err) => {
    alert("City not found!");
  }); 
}

function celciusToFarenheit(temp){
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function updateHumidityStatus(humidity){
    if(humidity <= 30){
        humidity_status.innerText = "Low";
    } else if(humidity <= 60){
        humidity_status.innerText = "Moderate";
    } else{
        humidity_status.innerText = "High";
    }
}

function updateVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibility_status.innerText = "Dense Fog";
    }else if(visibility <= 0.16){
        visibility_status.innerText = "Moderate Fog";
    }else if(visibility <= 0.35){
        visibility_status.innerText = "Light Fog";
    }else if(visibility <= 1.13){
        visibility_status.innerText = "Very Light Fog";
    }else if(visibility <= 2.16){
        visibility_status.innerText = "Light Mist";
    }else if(visibility <= 5.4){
        visibility_status.innerText = "Clear Air";
    }else{
        visibility_status.innerText = "Very Clear Air";
    }
}

function convertTo12(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let ampm = hour >= 12 ? "P.M" : "A.M";
    hour = hour%12;
    if(hour < 10){
        hour = "0" + hour;
    }
    let str = hour + ":" + min + " " + ampm;
    return str;
}

function getIcon(condition){
    if(condition === "Partly-cloudy-day"){
        return "icons/sun/27.png";
    }else if(condition === "Party-cloudy-night"){
        return "icons/moon/15.png";
    }else if(condition === "rain"){
        return "icons/rain/39.png";
    }else if(condition === "clear-day"){
        return "icons/sun/26.png";
    }else if(condition === "clear-night"){
        return "icons/moon/10.png";
    }else{
        return "icons/sun/26.png";
    }
}

function getDayName(date){ 
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wedday",
        "Thursday",
        "Friday",
        "Satday",
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1]; 
    if(hour > 12){
      hour = hour - 12;
      return `${hour}:${min} PM`;
    }else {
      return `${hour}:${min} AM`;  
    }
   
}

function updateForecast(data, unit, type){
    weatherCards.innerHTML = " ";

    let day = 0;
    let numCards = 0;
    if(type === "day"){
        numCards = 24;
    }else{
        numCards = 7;
    }
    for(let i = 0; i < numCards; i++){
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if(type === "week"){
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if(unit === 'F'){
           dayTemp = celciusToFarenheit(data[day].temp); 
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";  
        if(unit === 'F'){
            tempUnit = "°F";
        }      
        card.innerHTML = `
        <h2 class ="day-name">${dayName}</h2>
        <div class="card-icon">
          <img src="${iconSrc}" alt="" />
        </div>
        <div class="day-temp">
          <h2 class = "temp">${dayTemp}</h2>
          <span class="temp-unit">${tempUnit}</span>
        </div>
      `
    weatherCards.appendChild(card);
    day++;
    }
}

function changeBackground(condition){
    const body = document.querySelector("body");
    let bg = " ";
    if(condition === "Partly-cloudy-day"){
        bg = "images/pc.jpg";
    }else if(condition === "Party-cloudy-night"){
        bg = "images/pcn.jpg";
    }else if(condition === "rain"){
        bg = "images/rain.jpg";
    }else if(condition === "clear-day"){
        bg = "images/cd.jpg";
    }else if(condition === "clear-night"){
        bg = "images/cn.jpg";
    }else{
        bg = "images/pc.jpg";
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}

farenheitBtn.addEventListener("click", () => {
    changeUnit("F");
});

celciusBtn.addEventListener("click", () => {
    changeUnit("C");
});

function changeUnit(unit) {
    if(currentUnit !== unit){
        currentUnit = unit; 
        {
           tempUnit.forEach((elem) => {
            elem.innerText = `${unit.toUpperCase()}`;
            });
            if(unit === 'C') {
                celciusBtn.classList.add("active");
                farenheitBtn.classList.remove("active");
            }else{
                celciusBtn.classList.remove("active");
                farenheitBtn.classList.add("active");
            }
            //call getWeatherData after unit change
            getWeatherData(currentCity, currentUnit, hourlyorWeek)
        }
    }
}

hourlyBtn.addEventListener("click", () => {
    changheTimeSpan("hourly");
});

weekBtn.addEventListener("click", () => {
    changheTimeSpan("week");
});

function changheTimeSpan(unit){
    if(hourlyorWeek !== unit){
      hourlyorWeek = unit;
       if(unit === "hourly"){
        hourlyBtn.classList.add("active");
        weekBtn.classList.remove("active");
       }else{
        hourlyBtn.classList.remove("active");
        weekBtn.classList.add("active");
       }
       //update weather on time change
       getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let location = search.value;
    if(location){
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
})

function getcities(){
    fetch("https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        data.forEach(item => {
            cityArray.push(item.name);
        })
    });
}

getcities();
var currentFocus;

//adding eventlistener on search input
search.addEventListener("input", function (e){
    removeSuggestion();
    var a,b,i,
    val = this.value;
    //if there is nothing search input do nothing
    if(!val){
        return false;
    }
    currentFocus = -1;
    //creating a ul with a id suggesstion
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");
    //append the ul to it parent which is search form
    this.parentNode.appendChild(a);
    //adding li's with mathcing search suggestions
    for(i = 0; i < cityArray.length; i++){
        //check if items start with same letters which are in input
        if(cityArray[i].substr(0, val.length).toUpperCase() === val.toUpperCase()){
            //if any suggestion matching then create li
            b = document.createElement("li");
            //adding content to li
            b.innerHTML="<strong>" + cityArray[i].substr(0,val.length) + "</strong>"
            b.innerHTML += cityArray[i].substr(val.length);
            //input field to hold the suggestion value
            b.innerHTML += "<input type= 'hidden' value=' " + cityArray[i] + "'>"; 
            b.addEventListener("click", function(e){
                //onclick set the search input value with the clicked suggestion value
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestion();
            });
            //append suggestion li to ul
            a.appendChild(b);
        }
    }
});

function removeSuggestion(){
    //select the ul which is being adding on search input
    var x = document.getElementById("suggestions");
    //if x exists remove it
    if (x) x.parentNode.removeChild(x);
}

