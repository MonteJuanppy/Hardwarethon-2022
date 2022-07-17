//Se incluye biblioteca para el uso de ESP8266 independiente
#include "ESP_XYZ_StandAlone.h"

//Creación del objeto esp que controla las funciones de red
ESP_XYZ esp;

//Almacenamiento de los datos de la red inalámbrica
char* ssid = "Rizoma"; //Rizoma
char* pass = "1nn0v@c10n"; //1nn0v@c10n

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

  //Esperar conexión con la computadora
  while(!Serial);

  //Si no hay conexión al punto de acceso, termina ejecución
  while(!esp.connectAP(ssid, pass));

  //Se imprime un mensaje verificando el correcto funcioonamiento del dispositivo
  Serial.println("Configuracion exitosa");

  //Se establece el id del dispositivo
  esp.MQTTConfig(device_id);

  //Se configura el servidor destino
  esp.MQTTSetServer(server, port, srv_user, srv_pass);

  //Suscripción a servidor MQTT
  esp.MQTTSubscribe(topic);

  //Configuración de función de callback
  esp.MQTTSetCallback(mqtt_callback);
}

void loop() {
  //Se verifica que el dispositivo este conectado
  if (!esp.MQTTConnected()) {
    //De lo contrario se conecta nuevamente
    esp.MQTTReconnect(device_id);
  }
  //Debe estar presente siempre que se utilice MQTTSubscriibe
  esp.MQTTLoop();
}

//Función de callback
//Debe retornar void y tener los mismos argumentos
void mqtt_callback(char* topic, byte* payload, unsigned int len) {
  //Notifica en puerto UART la recepción de un mensaje
  Serial.print("Mensaje recibido [");
  Serial.print(topic);
  Serial.print("] ");

  //Se imprime el mensaje caracter por caracter
  for (int i = 0; i < len; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}
