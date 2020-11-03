window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

$(document).ready(function () {
    $("#search").val("");
    $("#search").focus();
});
//funzione che setta la visibilità dell'icona del meteo
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
            break
    }
}
//funzione che restituisce un oggetto con la media delle temperature, la data e il meteo attuale a partire dalla risposta del server
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
//funzione che effettua una query e inserisce i suoi risultati all'interno della pagina web
function getWeather(query){
    $.get(query, function (res) {
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
}

let index = 0
const unit = "metric"
const API_KEY = '' 

//la richiesta viene effettuata alla modifica del campo di ricerca
$("#search").on("change keyup paste", function () {
    $(".active").addClass("d-none").removeClass("active")
    let localization = $("#search").val();
    const REQUEST = `https://api.openweathermap.org/data/2.5/forecast?q=${localization}&units=${unit}&appid=${API_KEY}`
    getWeather(REQUEST)
});
//la richiesta viene effettuata al click del tasto di geocalizzazione
$("#usingPosition").click(function () {
    if ("geolocation" in navigator){
		navigator.geolocation.getCurrentPosition(function(position){ 
                const REQUEST = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${unit}&appid=${API_KEY}`
                getWeather(REQUEST)
            });
	}else{
		console.log("Browser doesn't support geolocation!");
	}
})
//funzioni per scorrere i le previsioni su mobile
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
