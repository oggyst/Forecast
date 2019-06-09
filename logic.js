var token, units;
var input = "auto:ip"
var chossen = "metric";
var pickedDay = 0;
updateCity();

function onClick() {
  input = document.getElementById("cityName");
  input = input.value.toUpperCase();
  updateCity();
}
//Promena izmedju imperial i metric jedinica merenja
function unitChange(select) {
  chossen = (select.options[select.selectedIndex].getAttribute("id"))
  day(pickedDay);
}
// Funkcija za trenutno vreme (day = 0)
function current() {
  document.getElementById("temp").style.fontSize = "8rem";
  $('#city').html(token.location.name + "<br>Current");
  $('#temp').html(Math.round(token.current.temp_c) + '&#8451;');
  $('#icon').attr('src', "http:" + token.current.condition.icon);
  if (chossen === "metric") {
    $('#temp').html(Math.round(token.current.temp_c) + "&#8451");
    $('#desc').html(token.current.condition.text + "<br>Wind speed:" + token.current.wind_kph + "kph");
  } else if (chossen === "imperial") {
    $('#temp').html(Math.round(token.current.temp_f) + "&#8457;");
    $('#desc').html(token.current.condition.text + "<br>Wind speed:" + token.current.wind_mph + "mph");
  }
}
//Ubacivanje u HTML-u info od izabranog dana(datuma)
function day(i) {
  pickedDay = i;
  if (i == 0) {
    current();
  } else {
    document.getElementById("temp").style.fontSize = "4rem";
    $('#city').html(token.location.name + "<br>" + token.forecast.forecastday[i - 1].date);
    $('#icon').attr('src', ("http:" + token.forecast.forecastday[i - 1].day.condition.icon));
    if (chossen === "metric") {
      $('#desc').html((token.forecast.forecastday[i - 1].day.condition.text) + "<br>Max wind speed:" +
        token.forecast.forecastday[i - 1].day.maxwind_kph + "kph");
      $('#temp').html("Max:" + Math.round(token.forecast.forecastday[i - 1].day.maxtemp_c) + "&#8451;<br>Min:" +
        Math.round(token.forecast.forecastday[i - 1].day.mintemp_c) + '&#8451;');
    } else if (chossen === "imperial") {
      $('#temp').html("Max:" + Math.round(token.forecast.forecastday[i - 1].day.maxtemp_f) + "&#8457;<br>Min:" +
        Math.round(token.forecast.forecastday[i - 1].day.mintemp_f) + "&#8457;");
      $('#desc').html((token.forecast.forecastday[i - 1].day.condition.text) + "<br>Max wind speed:" +
        token.forecast.forecastday[i - 1].day.maxwind_mph + "mph");
    }
  }
}
//Funkcija se poziva kada se izabere drugi dan iz padajuceg menija.
function newDay() {
  document.getElementById("datePick").classList.toggle("show");
}
//dobijanje liste dana za popunjavanje padajuceg menija
function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}
// Poziva se kada se unese drugi grad
function updateCity() {
  fetch('http://api.apixu.com/v1/forecast.json?key=b9cfa296afcb457f8cb143741190706&days=7&q=' + input + '&days=7')
    .then((res) => {
      //Obrada greske izazvane unosom pogresnog imena grada
      if (res.status === 400) {
        $('#city').html("Incorrect city name <br>Displaying " + token.location.name);
        document.getElementById("cityName").value = (token.location.name);
      }
      return res.json();
    })
    .then(json => {
      $.getJSON('http://api.apixu.com/v1/forecast.json?key=b9cfa296afcb457f8cb143741190706&days=7&q=' + input, function(data) {
        // console.log(data);
        token = data;
        current();
        for (var i = 0; i < data.forecast.forecastday.length; i++) {
          date = (data.forecast.forecastday[i].date)
          $("#" + (i + 1)).html(getDayOfWeek(date))
        }
      })
    })
}
