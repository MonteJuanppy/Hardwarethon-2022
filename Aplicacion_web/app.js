// se cargan los paquetes necesarios para la aplicacion
const express = require('express');                         //Servidor web
const morgan = require('morgan');                           //Mensajes de conexion del servidor
const colors = require('colors');                           //Color de mensajes de texto salida de consola

const app = express();                                      // Iniciamos en servidor express
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mqtt = require('mqtt');                               //Servicio MQTT
const r = require('rethinkdb');                             //Servicio base datos
const server_port = 3000                                    //Puerto del servidor

var optionsMqttServer = {                     //Variable con almacena los parametros de conexion del servidor mqtt
  port: 18709,
  host: 'mqtt://driver.cloudmqtt.com',
  username: 'hvdscpnh',
  password: 'RT0dutQN19lg'
};

const clientMqtt = mqtt.connect('mqtt://test.mosquitto.org')                      //Instancia cliente mqtt
//const clientMqtt = mqtt.connect('mqtt://driver.cloudmqtt.com', optionsMqttServer)   //Instancia cliente mqtt
let topicDisaster = "alertDisaster/#";                                              //Topic suscribir 
let connectionDataBase = null;                                                      // Variable para almacenar la conexion a la base de dato 
let socketConnection = null;

//Variables de pruebas
let team = [
    { name: 'Betzabe', organization: "Telecomunicaciones", birth_year: 1996},
    { name: 'Daniel', organization: "electronics", birth_year: 1996},
    { name: 'Juan', organization: "electrical", birth_year: 1997},
    { name: 'Marcela', organization: "psychology", birth_year: 1992},
    { name: 'Pablo', organization: "agronomy", birth_year: 1986}
    ];
let tagline = "great team";
//let labels = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
//let data = [3, 4, 2, 1, 3, 1, 2]
let count = 0;

clientMqtt.on('connect', function() {                                               //Establecer conexion servidor mqtt
    console.log('connected mqtt server'.green);

    r.connect({host: 'localhost', port: 28015, db: 'sure_disaster'})                //Establece la conexion con la base datos
      .then(conn => {
        console.log('Database connected'.green);                                    
        connectionDataBase = conn;
        return r.table('level_water_data').changes().run(connectionDataBase);       //Configura que al actualizarce la tabla dispare un evento
      }).then(cursor => {
        cursor.each((err, row) => {
        if (err) throw err;
          let post = row.new_val;                                                 //Captura el registro ingresado
          console.log(post);
          //console.log(post.data);
          // publish row to the frontend
        });
      });

    clientMqtt.subscribe(topicDisaster, function(err) {                             //Suscribirse a topic
      if (err) {
      console.log('Error subscribe'.red);
      }
      else{
        console.log("topic Subscribe")
        clientMqtt.on('message', function (topic, message, packet){                 //Recibimos topics
        console.log('Topic: '.red + topic + ' Message: '.green + message );
        
          let today = new Date(); 
          let dataString = {
            date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(), 
            time: (today.getHours())+":"+(today.getMinutes()+":"+(today.getSeconds())),
            data: message.toString(),
            }

          r.table('level_water_data').insert({         //Almacenamos en dato en la base datos
            "time": dataString.time,
            "date": dataString.date,
            "topic": topic,
            "data": dataString.data,
            }).run(connectionDataBase, 
              // function(err, result) { console.log("error>", err, result) }                             //Mostramos el resultado por consola
              function(){
                socketConnection.emit("db:update", dataString , function(err){
                  console.log(err);
                });
              });
        });
      }
    });
});


io.on('connection', socket => {                               //Socket IO
  console.log('Socket conected'.green);
  socketConnection = socket;
  
  io.on('disconnect', socket => {
    console.log('Socket disconnet'.red);
    });
  
  socketConnection.on('alarmI:update', ()=>{
    console.log('socket recibido'.yellow);
    socketConnection.broadcast.emit('alarmI:update', count);
    });
  
  socketConnection.on('alarmII:update', ()=>{
    socketConnection.emit("map:update", function(err){
      if (err){
        console.log(err)
      }else{
        console.log('Map:update'.blue);
        }
    });
   });
});

//setting
app.set('appName', 'Hardwarethon2022');                       //Nombre de la app
app.set('view engine', 'ejs');                                //Confuguramos motor de renderizado EJS
app.set('views', __dirname + '/views');                       //Indicamos directorio de vistas
//middleware
app.use(morgan('dev'));                                       //Configuracion de paquete que da colores a las salidas de consola
app.use(express.static(__dirname + '/public'));               //Indicamos directorio de paginas estaticas


//rutas de las diferentes paginas a las que se accede en el servicio
app.get('/', async (req, res, next) => {                      //Pagina Inicio

  let labels = [];
  let data = [];

  let posts = await r.table('level_water_data').orderBy(r.asc('time')).limit(10).run(connectionDataBase)
   .then(cursor => cursor.toArray());
  
  for (let reg of posts){
    labels.push(reg.time);
    data.push(reg.data);
  }

  res.render('index',{
    labels: labels,
    data: data,
    posts: posts
    },(err, html) => {
      res.send(html);
    });
});

app.get('/contacts', (req, res) => {              //Pagina Contactos
    res.render('contact',{
    team: team,
    tagline: tagline
    },(err, html) => {
      res.send(html);
    });
});

app.get('*', (req, res) => {                      //Pagina de no encontrado
  res.send('Not Found');
  res.end();
});

app.post('/dis', (req, res) => {  
  ++count;
  console.log(count);
  res.json({count});
});

http.listen(server_port, () => {                      //Iniciamos el servidor
  console.log(`app express server in port ${server_port}`.green);
  console.log('App Name: ' + app.get('appName'));
});
