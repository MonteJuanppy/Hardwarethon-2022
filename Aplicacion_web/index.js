const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const mqtt = require('mqtt')

const app = express();

const server = 'driver.cloudmqtt.com'
const user = 'hvdscpnh'
const pass = 'RT0dutQN19lg'
const port = 18709

//setting
app.set('appName', 'Hardwarethon2022');
app.set('view engine', 'ejs');

//middleware
app.use(morgan('combined'));

//rutes
app.get('/', (req, res) => {
  res.render('pages/index');
  res.end();
});

app.get('/contacts', (req, res) => {
  var team = [
    { name: 'Daniel', organization: "electronics", birth_year: 1996},
    { name: 'Juan', organization: "electrical", birth_year: 1997},
    { name: 'Marcela', organization: "psychology", birth_year: 1992},
    { name: 'Pablo', organization: "agronomy", birth_year: 1986}
    ];
  var tagline = "great team";
  res.render('pages/contact',{
    team: team,
    tagline: tagline
  });
  res.end();
});

app.get('*', (req, res) => {
  res.send('Not Found');
  res.end();
});

app.listen(3000, function(){
  console.log('app express server in port 3000'.red);
  console.log('App Name: ' + app.get('appName'));
});
