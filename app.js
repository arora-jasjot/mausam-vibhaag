$(function(){
  var url="", city="";
  $("#search-btn").click(function(){
      city=$("#search-box").val();
      var appid=prompt("Please Enter the APPID of OpenWeatherMap");
      url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+appid+"&units=metric";
      result(url);
    });

  for(i=0;i<18;i++){
    $(".city")[i].addEventListener("click", function(){
      city=this.innerHTML;
      var appid=prompt("Please Enter the APPID of OpenWeatherMap");
      url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+appid+"&units=metric";
      result(url);
    });
  }

  $("#search-box").keypress(function(e){
    if(e.keyCode == 13){
      city=$("#search-box").val();
      var appid=prompt("Please Enter the APPID of OpenWeatherMap");
      url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+appid+"&units=metric";
      result(url);
    }
  })
  function result(url){
    fetch(url)
    .then(res => res.json())
	  .then((data) => {
      $("#search").css("height", "auto");
      $("#search-box").val("");
      $("#results").addClass("no-display");
      $("#error-message").addClass("no-display");
      if(data.cod!=200){
        code=data.cod;
        error=data.message;
        error_msg="Error "+ code+ " : "+ error;
        $("#error-message").text(error_msg);
        $("#error-message").removeClass("no-display");
      }
      else{
        var country="", dt=0, date=0,time=0, day="",  cityname="", latitude=0, longitude=0, crttemperatue=0, 
        maxtemperature=0, mintemperature=0,  iconid="", mainweather="", weatherdesc="", pressure=0, humidity=0, clouds=0, 
        srisetime=0, ssettime=0, iconurl="";

        country=data.sys.country;
        dt=data.dt;
        cityname=data.name;
        latitude=data.coord.lat;
        longitude=data.coord.lon;
        crttemperature=data.main.temp;
        maxtemperature=Math.ceil(data.main.temp_max);
        mintemperature=Math.floor(data.main.temp_min);
        iconid=data.weather[0].icon;
        mainweather=data.weather[0].main;
        weatherdesc=data.weather[0].description;
        pressure=data.main.pressure;
        humidity=data.main.humidity;
        clouds=data.clouds.all;
        srisetime=data.sys.sunrise;
        ssettime=data.sys.sunset;
        iconurl="http://openweathermap.org/img/wn/"+iconid+"@2x.png";
        var Days=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


        if(country!="IN"){
          error_msg="Error : Please Serach for Indian City only";
          $("#error-message").removeClass("no-display");
          $("#error-message").text(error_msg);
        }
        else{
        $("#results").removeClass("no-display");
          date=new Date(dt * 1000);
          day=Days[date.getDay()];
          dd=date.getDate();
          mm=(date.getMonth()+1);
          yyyy=date.getFullYear();
          hour=date.getHours();
          min=date.getMinutes();
          sec=date.getSeconds();
          if(dd<10) dd="0"+ dd;
          if(mm<10) mm="0" + mm;
          if(hour<12){
            period="AM";
          }
          else{
            period="PM"
            hour=hour-12;
          }
          if(hour==0)
          hour=12;
          if(hour<10) hour="0" + hour;
          if(min<10) min="0" + min;
          if(sec<10) sec="0" + sec;
          date= dd +"/"+ mm +"/"+ yyyy;
          time= hour+":"+min+":"+sec+" "+period;

          srisetime= new Date(srisetime * 1000);
          srisetime= timesetup(srisetime);

          ssettime= new Date(ssettime * 1000);
          ssettime= timesetup(ssettime);

          $("#date").text(date);
          $("#day").text(day);
          $("#time").text(time);
          $("#cityname").text(cityname);
          $("#lat").text("Latitude : "+latitude);
          $("#lon").text("Longitude: "+longitude);
          $("#wicon").attr("src", iconurl)
          $("#crt-temp").html(crttemperature+" <sup>o</sup>C");
          $("#max-temp").html("Max Temp: "+maxtemperature+" <sup>o</sup>C");
          $("#min-temp").html("Min Temp: "+mintemperature+" <sup>o</sup>C");
          $("#weather").text(mainweather);
          $("#weather-desc").text("Description : "+weatherdesc);
          $("#sunrise").text("Sunrise : "+ srisetime);
          $("#sunset").text("Sunset : "+ ssettime);
          $("#pressure").text("Pressure : "+ pressure + " hpa");
          $("#humidity").text("Humidity : "+ humidity + "%");
          $("#clouds").text("Clouds : "+ clouds + "%");
        }
      }
    })
    loading();
  };

  function timesetup(x){
    hour = x.getHours();
    min = x.getMinutes();
     if(hour<12)
       period="AM"; 
     else{
       period="PM" 
       hour=hour-12;
      }
     if(hour==0)
       hour=12;
       if(hour<10) hour="0" + hour;
       if(min<10) min="0" + min;
       x= hour + ":" + min + " "+ period;
       return x;
  }

  var counter=0;
  function loading(){
    $("#main-content").addClass("no-display");
    $("#fetching").removeClass("no-display");
    if(counter%3===0) $("#dots").html(".");
    if(counter%3===1) $("#dots").html("..");
    if(counter%3===2) $("#dots").html("...");
    counter++;
    if(counter<10){
      setTimeout(loading, 200);
    }
    else{
      $("#main-content").removeClass("no-display");
      $("#fetching").addClass("no-display");
      $('html, body').animate({
        scrollTop: $("#results").offset().top
      }, 1);
      counter=0;
    }
  }
});
