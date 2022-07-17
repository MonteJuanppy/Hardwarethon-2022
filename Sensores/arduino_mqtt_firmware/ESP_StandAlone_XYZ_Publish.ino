//Se incluye biblioteca para el uso de ESP8266 independiente
#include "ESP_XYZ_StandAlone.h"

//Creación del objeto esp que controla las funciones de red
ESP_XYZ esp;

//Almacenamiento de los datos de la red inalámbrica
char* ssid = "Rizoma"; //Rizoma
char* pass = "1nn0v@c10n"; //1nn0v@c10n

const int LED = 13;
const int Button = 12;

//Almacenamiento de los datos del servidor MQTT
String server = "driver.cloudmqtt.com";
String user = "hvdscpnh";
String srv_pass = "RT0dutQN19lg";
int port = 18709;

//Almacenamiento del ID del dispositivo
String device_id = "Desastres1";

//Almacenamiento de topic MQTT
String topic = "hwthon";

void setup() {
  //Se inicializa el puerto Serial en 19200 baudios para comunicación con la computadora
  Serial.begin(19200);

  pinMode (Button, INPUT_PULLUP);
  pinMode(LED,OUTPUT);
  
  //Esperar conexión con la computadora
  while(!Serial);

  //Si no hay conexión al punto de acceso, termina ejecución
  while(!esp.connectAP(ssid, pass));

  //Se imprime un mensaje verificando el correcto funcioonamiento del dispositivo
  Serial.println("Configuracion exitosa");

  //Se establece el id del dispositivo
  esp.MQTTConfig(device_id);

  //Se configura el servidor destino
  esp.MQTTSetServer(server, port, user, srv_pass);
}

void loop() {

  
  while (digitalRead(Button)){
     digitalWrite(LED,LOW);
    }
/*
  if (digitalRead(Button)){
    digitalWrite(LED,LOW);
    */
  
  
  digitalWrite(LED,HIGH);

  int numero = random(0,100);

  //Se crea un String para construir el mensaje JSON
  String json_msg = "";

  //Se agregan las variables necesarias al JSON
  jsonInit(&json_msg);
  //Argumentos posibles solo pueden ser String, float o int
  addToJson(&json_msg, "adc", analogRead(A0));
  addToJson(&json_msg, "Desastre", numero);
  addToJson(&json_msg, "millis", int(millis())); 
  jsonClose(&json_msg);

  //Se ejecuta una solicitud HTTP POST y se almacena el código de respuesta
  bool published = esp.MQTTPublish(topic, json_msg);
  
  //Se libera la memoria asociada al mensaje JSON
  jsonClear(&json_msg);

  //Se imprime el código y cuerpo de la respuesta
  Serial.println("Mensaje publicado: ");
  Serial.println(published);
  Serial.println(digitalRead(12));
  
  //Pausa de un segundo en la ejecución del programa
  delay(1000);
}
