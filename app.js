const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const API_KEY = "1830039cb0f5378be094cd3c5573730f";

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

let weatherString="";
let descString="";
let imgURL="";

app.get("/",(req,res)=>{
    res.render("weather",{weatherString, descString, imgURL});    
});


app.post("/",(req,res)=>{
    city = req.body.cityInp;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    https.get(url,(response)=>{
        if(response.statusCode==200){
            response.on("data", (data)=>{

            let weatherData = JSON.parse(data);
            console.log(weatherData);
            temp = weatherData.main.temp;
            desc = weatherData.weather[0].description;
            let icon = weatherData.weather[0].icon;
            
            imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            weatherString = `Temperature in ${city} is ${temp} \xB0 C`;
            descString = `Feels like ${desc}`;
            res.redirect("/");
            });
        }
        else{
            weatherString = `Sorry, can't Tell About "${city}" Yet...`;
            descString = "";
            imgURL="";
            res.redirect("/");
        }
    });
})
  
app.listen(PORT,()=>{
    console.log(PORT+" Running...");
});