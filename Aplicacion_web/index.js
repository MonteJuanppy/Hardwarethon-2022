// se cargan los paquetes necesarios para la aplicacion
const express = require('express');     //Servidor web
const morgan = require('morgan');       //Mensajes de conexion del servidor
const colors = require('colors');       //Color de mensajes de texto salida de consola
const mqtt = require('mqtt');            //Servicio MQTT
const rtdb = require('rethinkdb');


var optionsMqttServer = {                     //Variable con almacena los parametros de conexion del servidor mqtt
  port: 18709,
  host: 'mqtt://driver.cloudmqtt.com',
  username: 'hvdscpnh',
  password: 'RT0dutQN19lg'
};
const clientMqtt = mqtt.connect('mqtt://driver.cloudmqtt.com', optionsMqttServer) //Instancia cliente mqtt
var topicDisaster = "alertDisaster/#";                                            //Topic suscribir 

var content = { levelMsg: "", tempMsg:"", moistureMsg:"", motionMsg: ""};         //Variables de prueba
var connectionDataBase = null;                                                    // Variable para almacenar la conexion a la base de dato 

clientMqtt.on('connect', function() {                                   //Establecer conexion servidor mqtt
    console.log('connected mqtt server'.green);
    
    rtdb.connect( {host: 'localhost', port: 28015}, function(err, conn) {         //Establecemos la conexion con la base de datos
    if (err) throw err;
        console.log('Database connected'.green);
        connectionDataBase = conn;                                                // Almacenamos la conexion
    });

    clientMqtt.subscribe(topicDisaster, function(err) {                     //Suscribirse a topic
        if (err) {
            console.log('Error subscribe'.red);
        }
        else{
            clientMqtt.on('message', function (topic, message, packet){                 //Recibimos topics
                console.log('Topic: '.red + topic + ' Message: '.green + message );
                if(topic === "alertDisaster/fieldSensor001/tempisque_1/levelWater") {   //Manejo de topic segun tema
                    level(message);                                                     //Enviamos al dato del mensaje a una variable

                    rtdb.db('sure_disaster').table('level_water_data').insert({         //Almacenamos en dato en la base datos
                        "date": Date(),
                        "topic": topic,
                        "data": content.levelMsg
                    }).run(connectionDataBase, function(err, result) {
                        console.log("error>", err, result)                              //Mostramos el resultado por consola
                        }
                    );
                }
            });
        }
    });
});

var level = (message) => {                    //almacenamos el dato en una variable
    content.levelMsg = message.toString();
}

const app = express();                        // Iniciamos en servidor express
const server_port = 3000                      // Puerto del servidor


//Variables de pruebas
var team = [
    { name: 'Betzabe', organization: "Telecomunicaciones", birth_year: 1996},
    { name: 'Daniel', organization: "electronics", birth_year: 1996},
    { name: 'Juan', organization: "electrical", birth_year: 1997},
    { name: 'Marcela', organization: "psychology", birth_year: 1992},
    { name: 'Pablo', organization: "agronomy", birth_year: 1986}
    ];
var tagline = "great team";

var labels = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
var data = [3, 4, 2, 1, 8, 1, 2]

//setting
app.set('appName', 'Hardwarethon2022');     //Nombre de la app
app.set('view engine', 'ejs');              //Confuguramos motor de renderizado EJS
app.set('views', __dirname + '/views');     //Indicamos directorio de vistas

//middleware
app.use(morgan('combined'));                      //Configuracion de paquete morgan
app.use(express.static(__dirname + '/public'));   //Indicamos directorio de paginas estaticas

//rutas de las diferentes paginas a las que se accede en el servicio
app.get('/', (req, res, next) => {                      //Pagina Inicio
  res.render('index',{
    labels: labels,
    data: data,
    content: content
  });
  res.end();
});

app.get('/mqtt', (req, res) => {                      //Pagina Inicio
  res.render('mqtt_test');
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
