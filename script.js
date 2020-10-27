window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

$(document).ready(function () {
    $("#search").val("");
    $("#search").focus();
});

function setWeather(weather, i){
    switch(weather){
        case "Clear":
            $(`.wt-${i}.sunny`).removeClass("d-none").addClass("active")
            break
        case "Clouds":
            $(`.wt-${i}.cloudy`).removeClass("d-none").addClass("active")
            break
        case "Rain":
            $(`.wt-${i}.rainy`).removeClass("d-none").addClass("active")
            break
        case "Snow":
            $(`.wt-${i}.flurries`).removeClass("d-none").addClass("active")
        default:
            $(`.wt-${i}.default`).removeClass("d-none").addClass("active")
            //AAAAAAAAA 
            //Qui stavo scapocciando, che ridere
            break
    }
}

function getForecasts(array){
    let forecasts = []
    for (let i = 0; i < array.length; i++) {
        let date = array[i]['dt_txt'].split(" ")[0]
        let average = 0
        let j = 0
        let weather = array[i]['weather'][0]['main']
        while(array[i]['dt_txt'].split(" ")[0] == date){
            average += array[i]['main']['temp']
            i += 1
            j += 1
            if(i >= array.length){
                break
            }
        }
        i -= 1
        forecasts.push({
            "date" : date,
            "temp" : parseInt(average/j),
            "weather" : weather
        })
    }
    return forecasts
}

let index = 0

$("#search").on("change keyup paste", function () {
    
    $(".active").addClass("d-none").removeClass("active")
    let localization = $("#search").val();
    let unit = "metric"
    const API_KEY = '' 
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${localization}&units=${unit}&appid=${API_KEY}`

    $.get(forecast, function (res) {
        console.log(res)
       $("#forecast").removeClass("d-none")
       $("#navigation").removeClass("d-none").addClass("d-md-none ")
       $("#cityName").text(res['city']['name'] + ", " + res['city']['country'])
       let temps = getForecasts(res['list'])
       console.log(temps)
       temps.map((item, i)=>{
        setWeather(item["weather"], i)
        $(`#temp-${i}`).text(`${item["temp"]}°C`)
        $(`#day-${i}`).text(`${item["date"]}`)
       })
    })
    $(document).ajaxError(function(event, xhr, ajaxOptions, errorThrown) {
        $("#forecast").addClass("d-none")
        $("#navigation").removeClass("d-md-none").addClass("d-none")
    });


});

$("#usingPosition").click(function () {
    if ("geolocation" in navigator){
		navigator.geolocation.getCurrentPosition(function(position){ 
				console.log("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
			});
	}else{
		console.log("Browser doesn't support geolocation!");
	}
})

$("#next").click(function () {
    if (index < 4) {
        $(`#weather-${index}`).addClass("d-none").addClass("d-md-block")
        index += 1
        $(`#weather-${index}`).removeClass("d-none").removeClass("d-md-block")
        if (index == 4){
            $("#next").addClass("disabled")
        }
        $("#prev").removeClass("disabled")
    }
})

$("#prev").click(function () {
    if (index > 0) {
        $(`#weather-${index}`).addClass("d-none").addClass("d-md-block")
        index -= 1
        $(`#weather-${index}`).removeClass("d-none").removeClass("d-md-block")
        if (index == 0){
            $("#prev").addClass("disabled")
        }
        $("#next").removeClass("disabled")
    }
})
