
//Sensor de movimiento
//Se incluye biblioteca para el uso de ESP8266 independiente
#include "ESP_XYZ_StandAlone.h"

#include <Wire.h>
#include <Adafruit_ADS1X15.h>
Adafruit_ADS1115 ads;

//Creación del objeto esp que controla las funciones de red
ESP_XYZ esp;

//Almacenamiento de los datos de la red inalámbrica
char* ssid = "Rizoma"; //Rizoma
char* pass = "1nn0v@c10n"; //1nn0v@c10n

//Almacenamiento de los datos del servidor MQTT
String server = "fortuitous-actor.cloudmqtt.com";
String user = "rkejuyun";
String srv_pass = "c56JRlI0Z5Z_";
int port = 1883;
bool Mov = false;

//Almacenamiento del ID del dispositivo


//Almacenamiento de topic MQTT
String device_id = "/007";
String device_id2 = "/001";
String id_topic = "hwthon/SAMAN";
String hot_point = "/sucio";
String hot_point2 = "/tempisque";
String location = "/Braulio_Carrillo";
String location2 = "/Filadelfia";
String type_device = "/sensor";
String parameter ="/vibration";
String parameter2 ="/waterLevel";

unsigned long previousMillis1 = 0;   

unsigned long previousMillis2 = 0;   
// constants won't change:
const long interval = 4000;  

String Id = id_topic+hot_point+location+type_device+device_id+parameter;
String Id2 = id_topic+hot_point2+location2+type_device+device_id2+parameter2;
int lectura_movimiento; //Variable para almacenar lectura de movimiento
int lectura1;
int lectura2;
int x;
bool published;
const int movpin =  13; 
int mov = 0;  

void setup(){
  Serial.begin(19200); // sets the serial port to 9600
  
  //Esperar conexión con la computadora
  while(!Serial);

  //Si no hay conexión al punto de acceso, termina ejecución
  while(!esp.connectAP(ssid, pass));

  //Se imprime un mensaje verificando el correcto funcioonamiento del dispositivo
  Serial.println("Configuracion exitosa");

  //Se establece el id del dispositivo
  esp.MQTTConfig(device_id);
  esp.MQTTConfig(device_id2);

  //Se configura el servidor destino
  esp.MQTTSetServer(server, port, user, srv_pass);

  published = esp.MQTTPublish(Id, "online");
  published = esp.MQTTPublish(Id2, "online");

  // initialize the pushbutton pin as an input:
  pinMode(movpin, INPUT);
}

 
void loop(){

 unsigned long currentMillis = millis();
  String dato = "0";
  String val;
  mov = digitalRead(movpin);
  if (mov==LOW) val="1";
  if (mov==HIGH) val="0";
  if(mov==LOW){
    //Se ejecuta una solicitud HTTP POST y se almacena el código de respuesta
    published = esp.MQTTPublish(Id, val);
     Serial.println("Mensaje 1 publicado: ");
    Serial.println(published);
    Serial.println(val);
    delay(100);
   
  }
  

   currentMillis = millis();

   
   
   if(currentMillis - previousMillis2 >= interval){
    lectura1 = analogRead(0);
  
  // convert the reading to voltage
  float sensorVoltage = lectura1 * (5.0 / 1023.0);
  // convert the reading to it’s PSI equivilant [(Vout = Vs*(0.0018*P+0.04)), (Vs = 5.0Vdc)]
  // thus: P= (-V+0.2)/0.009 (kPa)
  float kPa = (sensorVoltage - 0.2) / 0.009;
  //Para presion a altura
   float altura = (kPa/(1000*9.8))*1000;

    lectura2 = analogRead(0);
  
  // convert the reading to voltage
  float sensorVoltage2 = lectura2 * (5.0 / 1023.0);
  // convert the reading to it’s PSI equivilant [(Vout = Vs*(0.0018*P+0.04)), (Vs = 5.0Vdc)]
  // thus: P= (-V+0.2)/0.009 (kPa)
  float kPa2 = (sensorVoltage2 - 0.2) / 0.009;
  //Para presion a altura
   float altura2 = (kPa2/(1000*9.8))*1000;
    if (altura!=altura2){
       published = esp.MQTTPublish(Id, String(val));
       
       Serial.println("Mensaje 1 publicado: ");
    Serial.println(published);
    Serial.println(val);
    published = esp.MQTTPublish(Id2, String(altura2));
    Serial.println("Mensaje 2 publicado: ");
    Serial.println(published);
    Serial.println(altura);
   
     previousMillis2 = currentMillis;
    }
   
   }
 
  // delay(1000);
}
