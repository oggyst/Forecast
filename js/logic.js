var input = "auto:ip";
var token;
var chossenDist = "km";
var chossenTemp = "celsius";

function tempUnitChange(select) {
  chossenTemp = (select.options[select.selectedIndex].getAttribute("id"));
  onTempChange(chossenTemp);
}

function onTempChange(chossenTemp) {
  if (chossenTemp == "fahrenheit") {
    $('#temp').html(Math.round(token.current.temp_f) + "&#8457; <br>Feal:&#160; " + Math.round(token.current.feelslike_f) + "&#8457;");
    for (var i = 0; i < token.forecast.forecastday.length; i++) {
      $('#maxTemp' + i).html(token.forecast.forecastday[i].day.maxtemp_f + "&#8457");
      $('#minTemp' + i).html(token.forecast.forecastday[i].day.mintemp_f + "&#8457");
      $('#avgTemp' + i).html(token.forecast.forecastday[i].day.avgtemp_f + "&#8457");
    }
  } else if (chossenTemp == "celsius") {
    $('#temp').html(Math.round(token.current.temp_c) + "&#8451 <br>Feal:&#160; " + Math.round(token.current.feelslike_c) + "&#8451");
    for (var i = 0; i < token.forecast.forecastday.length; i++) {
      $('#maxTemp' + i).html(token.forecast.forecastday[i].day.maxtemp_c + "&#8451");
      document.getElementById("maxTemp" + i).style.color = 'red';
      $('#minTemp' + i).html(token.forecast.forecastday[i].day.mintemp_c + "&#8451");
      document.getElementById("minTemp" + i).style.color = 'blue';
      $('#avgTemp' + i).html(token.forecast.forecastday[i].day.avgtemp_c + "&#8451");
    }
  }
}

function distUnitChange(select) {
  chossenDist = (select.options[select.selectedIndex].getAttribute("id"));
  onDistChange(chossenDist);
}

function onDistChange(chossenDist) {
  if (this.chossenDist == "km") {
    $('#desc').html(token.current.condition.text + "<br>Wind speed:&#160; " + token.current.wind_kph + "kph <br>Humidity:&#160; " + token.current.humidity + "%<br> UV:&#160; " +
      token.current.uv);
    for (var i = 0; i < token.forecast.forecastday.length; i++) {
      $('#maxWind' + i).html(token.forecast.forecastday[i].day.maxwind_kph + "kph");
      $('#totalPrecip' + i).html(token.forecast.forecastday[i].day.totalprecip_mm + "mm");
      $('#avgVis' + i).html(token.forecast.forecastday[i].day.avgvis_km + "km");
    }
  } else if (this.chossenDist == "m") {
    $('#desc').html(token.current.condition.text + "<br>Wind speed: &#160; " + token.current.wind_mph + "mph <br>Humidity:&#160; " + token.current.humidity + "%<br> UV:&#160; " +
      token.current.uv);
    for (var i = 0; i < token.forecast.forecastday.length; i++) {
      $('#maxWind' + i).html(token.forecast.forecastday[i].day.maxwind_mph + "mph");
      $('#totalPrecip' + i).html(token.forecast.forecastday[i].day.totalprecip_in + "inch");
      $('#avgVis' + i).html(token.forecast.forecastday[i].day.avgvis_miles + "m");
    }
  }
}

function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}
$(document).ready(function() {
  $('#citySearchBar').keypress(function(e) {
    if (e.keyCode == 13) {
      input = document.getElementById("citySearchBar").value;
      onLoad();
    }
  });
});

function onLoad() {
  fetch('https://api.apixu.com/v1/forecast.json?key=b9cfa296afcb457f8cb143741190706&days=7&q=' + input + '&days=7')
    .then((res) => {
      console.log('https://api.apixu.com/v1/forecast.json?key=b9cfa296afcb457f8cb143741190706&days=7&q=' + input + '&days=7');
      if (res.status === 400) {
        $('#city').html("Incorrect city name <br>Displaying " + token.location.name);
      }
      return res.json();
    })
    .then(json => {
      $.getJSON('https://api.apixu.com/v1/forecast.json?key=b9cfa296afcb457f8cb143741190706&days=7&q=' + input, function(data) {
        console.log(data);
        token = data;
        $('#city').html(token.location.name);
        $('#icon').attr('src', "https:" + token.current.condition.icon);
        for (var i = 0; i < data.forecast.forecastday.length; i++) {
          console.log(i);
          $('#date' + i).html(token.forecast.forecastday[i].date);
          $('#icon' + i).html("<img style = 'width:50px;height:50px;resize: none;' src=https:" + token.forecast.forecastday[i].day.condition.icon + ">");
          $('#condition' + i).html(token.forecast.forecastday[i].day.condition.text);
          date = (data.forecast.forecastday[i].date)
          $("#date" + i).html("<b>" + getDayOfWeek(date) + "</b> </br>" + date);
          // $('#totalPrecip' + i).html(token.forecast.forecastday[i].day.totalprecip_mm + "mm");
          // $('#avgVis' + i).html(token.forecast.forecastday[i].day.avgvis_km + "km");
          $('#avgHumidity' + i).html(token.forecast.forecastday[i].day.avghumidity + "%");
          onDistChange(chossenDist);
          onTempChange(chossenTemp);
          var uv = token.forecast.forecastday[i].day.uv;
          if (uv < 2) {
            $('#uv' + i).html("Low" + "(" + uv + ")");
          } else if (uv < 5) {
            $('#uv' + i).html("Moderate" + " (" + uv + ")");
          } else if (uv < 7) {
            $('#uv' + i).html("High" + " (" + uv + ")");
          } else if (uv < 10) {
            $('#uv' + i).html("Very high" + " (" + uv + ")");
          } else {
            $('#uv' + i).html("Extreme" + " (" + uv + ")");
            break;
          }
          $('#sun' + i).html(token.forecast.forecastday[i].astro.sunrise + " / " + token.forecast.forecastday[i].astro.sunset);
        }
      });
    });
}
onLoad();
