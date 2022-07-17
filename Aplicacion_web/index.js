// se cargan los paquetes necesarios para la aplicacion
const express = require('express');     //Servidor web
const morgan = require('morgan');       //Mensajes de conexion del servidor
const colors = require('colors');       //Color de mensajes de texto salida de consola
const mqtt = require('mqtt')            //Servicio MQTT

const app = express();
const server_port = 3000

var options = {
    port: 18709,
    host: 'mqtt://driver.cloudmqtt.com',
    clientId: 'Disaster Team',
    username: 'hvdscpnh',
    password: 'RT0dutQN19lg'
};                                      //Variable con almacena los parametros de conexion del servidor mqtt

const client =mqtt.connect('mqtt://driver.cloudmqtt.com', options)
client.on('connect', function() {                                   //Establecer conexion servidor mqtt
  console.log('connected'.green);
  client.subscribe('level_river/#', function(){                     //Suscribirse a topic
    client.on('message', function(topic, message, packet){          //Mostrar mensaje recibido por consola
      console.log('Recibido; ' + message);
      });
    });
  });

//Variables de pruebas
var team = [
    { name: 'Daniel', organization: "electronics", birth_year: 1996},
    { name: 'Juan', organization: "electrical", birth_year: 1997},
    { name: 'Marcela', organization: "psychology", birth_year: 1992},
    { name: 'Pablo', organization: "agronomy", birth_year: 1986}
    ];
var tagline = "great team";


//setting
app.set('appName', 'Hardwarethon2022');     //Nombre de la app
app.set('view engine', 'ejs');              //Confuguramos motor de renderizado EJS
app.set('views', __dirname + '/views');     //Indicamos directorio de vistas

//middleware
app.use(morgan('combined'));                      //Configuracion de paquete morgan
app.use(express.static(__dirname + '/public'));   //Indicamos directorio de paginas estaticas

//rutas de las diferentes paginas a las que se accede en el servicio
app.get('/', (req, res) => {                      //Pagina Inicio
  res.render('index');
  res.end();
});

app.get('/contacts', (req, res) => {              //Pagina Contactos
    res.render('contact',{
    team: team,
    tagline: tagline
  });
  res.end();
});

app.get('*', (req, res) => {                      //Pagina de no encontrado
  res.send('Not Found');
  res.end();
});

app.listen(server_port, function(){                      //Dejamos el servidor a escucha en el puerto 3000
  console.log('app express server in port 3000'.red);
  console.log('App Name: ' + app.get('appName'));
});
