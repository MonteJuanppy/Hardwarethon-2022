// se cargan los paquetes necesarios para la aplicacion
const express = require('express');                         //Servidor web
const morgan = require('morgan');                           //Mensajes de conexion del servidor
const colors = require('colors');                           //Color de mensajes de texto salida de consola
const fs = require("fs");

const app = express();                                      // Iniciamos en servidor express
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mqtt = require('mqtt');                               //Servicio MQTT
const r = require('rethinkdb');                             //Servicio base datos
const server_port = 3000                                    //Puerto del servidor

var optionsMqttServer = {                     //Variable con almacena los parametros de conexion del servidor mqtt
  port: 1883,
  host: 'fortuitous-actor.cloudmqtt.com',
  username: 'rkejuyun',
  password: 'c56JRlI0Z5Z_'
};

//const clientMqtt = mqtt.connect('mqtt://test.mosquitto.org')                      //Instancia cliente mqtt
const clientMqtt = mqtt.connect(optionsMqttServer)   //Instancia cliente mqtt
let topicDisaster = "hwthon/SAMAN/#";                                              //Topic suscribir 
let connectionDataBase = null;                                                      // Variable para almacenar la conexion a la base de dato 
let socketConnection = null;

//Variables de pruebas
let count = 0;

clientMqtt.on('connect', function() {                                               //Establecer conexion servidor mqtt
    console.log('connected mqtt server'.green);

    r.connect({host: 'localhost', port: 28015, db: 'sure_disaster'})                //Establece la conexion con la base datos
      .then(conn => {
        console.log('Database connected'.green);                                    
        connectionDataBase = conn;
        return r.table('sensors_data').changes().run(connectionDataBase);       //Configura que al actualizarce la tabla dispare un evento
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
          
          let table_database = null;
          
          let topicMessage = topic.split("/");
          //console.log(topic); 
          
          if (topicMessage[4] == 'sensor'){
            table_database = 'sensors_data';
          }else if (topicMessage[4] == 'alarm'){
            table_database = 'alarm_data';
          }
          
          if(topicMessage[6] == 'setPicture'){
            console.log("imagen Recibida");
            
            let base64Image = message.toString().split(';base64,').pop();
            let today = new Date();
            
            time = (today.getHours())+"_"+(today.getMinutes()+"_"+(today.getSeconds()))
            
            let path_imagen = `public/imagen${time}.png`
            fs.writeFile(path_imagen, base64Image, {encoding: 'base64'}, function(err) {
            console.log('File created');
            
            path_imagen = path_imagen.split('/').pop();

              if (socketConnection != null){
                socketConnection.emit("updatePicture",path_imagen);
              }else{
                console.log("socket not set".red);
              }
              
            });
          }
                    
          let today = new Date(); 

          let dataGraph = {
            "timestamp": new Date(),
            //"date": today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
            //"time": (today.getHours())+":"+(today.getMinutes()+":"+(today.getSeconds())),
            "topic": {
              "hot_point": topicMessage[2],
              "location": topicMessage[3],
              "type_device": topicMessage[4],
              "device_id": topicMessage[5],
              "parameter": topicMessage[6],
              },
            "data": message.toString(),
            };

          r.table("disaster_monitors").filter({"properties": {"device_id": topicMessage[5]}}).update({"properties": {"update": new Date()}}).run(connectionDataBase, function(err, result) { console.log("error>", err, result) });
          
          if (topicMessage[6] != 'setPicture' && topicMessage[4] != 'alarm'){
            r.table(table_database).insert(         //Almacenamos en dato en la base datos
              dataGraph 
              ).run(connectionDataBase, 
                // function(err, result) { console.log("error>", err, result) }                             //Mostramos el resultado por consola
                function(){
                  if (socketConnection != null){
                    socketConnection.emit("db:update", dataGraph);
                  }
                  else{ 
                    console.log("socket not set".red);  
                    
                  }
                });
            }
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

    socketConnection.on('push:AlarmI', (data)=>{
      
      if(clientMqtt.connected == true){
        console.log(`alerta emitida ${data}`);
        clientMqtt.publish("hwthon/SAMAN/tempisque/Filadelfia/alarm/002/sound", data);
      }else{
        console.log("Cliente Mqtt no conectado");
        }
      });

   /* socketConnection.on('push:AlarmII', (data)=>{
    console.log(data);
    if(clientMqtt.connected == true){
      console.log("alerta emitida");
      clientMqtt.publish("hwthon/SAMAN/tempisque/Filadelfia/alarm/002/sound", "2");
    }else{
      console.log("Cliente Mqtt no conectado");
      }
    });

    socketConnection.on('push:AlarmIII', (data)=>{
    console.log(data);
      if(clientMqtt.connected == true){
        console.log("alerta emitida");
        clientMqtt.publish("hwthon/SAMAN/tempisque/Filadelfia/alarm/002/sound", "3");
      }else{
        console.log("Cliente Mqtt no conectado");
        }
      });
 */

  socketConnection.on('push:updatePicture', ()=>{
    if(clientMqtt.connected == true){
      console.log("Se solicita Foto");
      clientMqtt.publish("hwthon/SAMAN/tempisque/Filadelfia/sensor/001/getPicture", "?getstill");
    }else{
      console.log("Cliente Mqtt no conectado");
    }
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

  let imn_stations = await r.table('imn_station').orderBy(r.desc('name')).run(connectionDataBase)
    .then(cursor => cursor.toArray());

  let iot_devices = await r.table('disaster_monitors').orderBy(r.desc('properties.location')).run(connectionDataBase)
   .then(cursor => cursor.toArray());
  
  res.render('index',{
    imn: imn_stations,
    devices: iot_devices,
    },(err, html) => {
      res.send(html);
    });
});

app.get('/tempisque', async (req, res, next) => {

  let labels = [];
  let data = [];

  let posts = await r.table('sensors_data').filter({"topic":{"location": "Filadelfia"}}).orderBy(r.desc('timestamp')).limit(14).run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let imn_stations = await r.table('imn_station').orderBy(r.desc('name')).run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let iot_devices = await r.table('disaster_monitors').run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let coord_page = await r.table('disaster_monitors').filter({"properties": {"location": "Filadelfia"}}).run(connectionDataBase).then(cursor => cursor.toArray());

  for (let reg of posts){
    let today = new Date(reg.timestamp);
    let time = (today.getHours())+":"+(today.getMinutes()+":"+(today.getSeconds()));
    labels.unshift(time);
    data.unshift(reg.data);
  }

  res.render('tempisque',{
    labels: labels,
    data: data,
    coord_page: coord_page,
    imn: imn_stations,
    devices: iot_devices,
    },(err, html) => {
      res.send(html);
    });
});

app.get('/ruta32', async (req, res, next) => {

  let labels = [];
  let data = [];

  let posts = await r.table('sensors_data').filter({"topic":{"location": "Braulio_Carrillo"}}).orderBy(r.desc('timestamp')).limit(14).run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let imn_stations = await r.table('imn_station').orderBy(r.desc('name')).run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let iot_devices = await r.table('disaster_monitors').run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let coord_page = await r.table('disaster_monitors').filter({"properties": {"location": "Braulio_Carrillo"}}).run(connectionDataBase).then(cursor => cursor.toArray());

  for (let reg of posts){
    let today = new Date(reg.timestamp);
    let time = (today.getHours())+":"+(today.getMinutes()+":"+(today.getSeconds()));
    labels.unshift(time);
    data.unshift(reg.data);
  }

  res.render('ruta32',{
    labels: labels,
    data: data,
    coord_page: coord_page,
    imn: imn_stations,
    devices: iot_devices,
    },(err, html) => {
      res.send(html);
    });
});



app.get('/upala', async (req, res, next) => {

  let labels = [];
  let data = [];

  let posts = await r.table('sensors_data').filter({"topic":{"location": "upala"}}).orderBy(r.desc('timestamp')).limit(14).run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let imn_stations = await r.table('imn_station').orderBy(r.desc('name')).run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let iot_devices = await r.table('disaster_monitors').run(connectionDataBase)
   .then(cursor => cursor.toArray());

  let coord_page = await r.table('disaster_monitors').filter({"properties": {"location": "Upala"}}).run(connectionDataBase).then(cursor => cursor.toArray());

  for (let reg of posts){
    let today = new Date(reg.timestamp);
    let time = (today.getHours())+":"+(today.getMinutes()+":"+(today.getSeconds()));
    labels.unshift(time);
    data.unshift(reg.data);
  }

  res.render('zapote',{
    labels: labels,
    data: data,
    coord_page: coord_page,
    imn: imn_stations,
    devices: iot_devices,
    },(err, html) => {
      res.send(html);
    });
});

app.get('/contacts', (req, res) => {              //Pagina Contactos
    res.render('contact',{
    },(err, html) => {
      res.send(html);
    });
});

  app.get('*', (req, res) => {              //Pagina Contactos
    res.render('page-error-404',{
    },(err, html) => {
      res.send(html);
    });
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
