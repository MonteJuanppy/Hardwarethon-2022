//Se incluye biblioteca para el uso de ESP8266 independiente
#include "ESP_XYZ_StandAlone.h"
//Se incluye biblioteca para el manejo de LEDs
#include <Adafruit_NeoPixel.h>

//###############################Variables definidas por el usuario#########################################################

//Almacenamiento de los datos de la red inalámbrica
char* ssid = "";
char* pass = "";

//Almacenamiento de los datos del servidor MQTT
String server = "m10.cloudmqtt.com";
String user = "owqhlrel";
String srv_pass = "LAuKYqnFO9cM";
int port = 14077;

//Almacenamiento del ID del dispositivo
String device_id = "###############################";

//Almacenamiento de topic MQTT
String Publish_topic = "move/#";

//Almacenamiento de topic MQTT
String Subscribe_topic = "horse/#";

//#########################################################################################################################

//Definición de pines para el multiplexor del control
const int Mux_Selector_0 = 4; //Pin 0 de seleccion del MUX
const int Mux_Selector_1 = 5; //Pin 1 de seleccion del MUX
const int Mux_Selector_2 = 16; //Pin 2 de seleccion del MUX
const int Mux_Output = 13;    //Pin Output del MUX
const int Start_Button_Pin = 14;
const int Select_Button_Pin = 12;

//Definición de variables globales para el funcionamiento del control
word Button_Pressed = 0;
word Last_Button_Pressed = 258;//NO cambiar
String Button_Name = "NULL";
bool Multiple_Button_Pressed = false;

//Definición de pines para los LEDs Neopixels
#define LED_PIN 2
#define NUMPIXELS 5

//Creación del objeto pixels que controla los Neopixels
Adafruit_NeoPixel pixels(NUMPIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

//Creación del objeto esp que controla las funciones de red
ESP_XYZ esp;

void setup() {
  // Inicializar los pines de los botones:
  pinMode(Mux_Selector_0, OUTPUT);
  pinMode(Mux_Selector_1, OUTPUT);
  pinMode(Mux_Selector_2, OUTPUT);
  pinMode(Start_Button_Pin, INPUT);
  pinMode(Select_Button_Pin, INPUT);
  pinMode(Mux_Output, INPUT);

  // Inicializar los Neopixels
  pixels.begin();
  pixels.clear();
  pixels.show();

  //Se inicializa el puerto Serial en 19200 baudios para comunicación con la computadora
  Serial.begin(115200);

  //Esperar conexión con la computadora
  while (!Serial);

  //Si no hay conexión al punto de acceso, termina ejecución
  while (!esp.connectAP(ssid, pass));

  //Se imprime un mensaje verificando el correcto funcioonamiento del dispositivo
  Serial.println("Configuracion exitosa");

  //Se establece el id del dispositivo
  esp.MQTTConfig(device_id);

  //Se configura el servidor destino
  esp.MQTTSetServer(server, port, user, srv_pass);

  //Suscripción a servidor MQTT
  esp.MQTTSubscribe(Subscribe_topic);

  //Configuración de función de callback
  esp.MQTTSetCallback(mqtt_callback);
}

byte Concatenate_Mux() {
  Button_Pressed = 0;
  for (byte Mux_Position = 0; Mux_Position < 8; Mux_Position++) {
    //Uncomment for debug
    //Serial.println("MUX_sel: " + String(Mux_Position) + " " + String(bitRead(Mux_Position, 2)) + String(bitRead(Mux_Position, 1)) + String(bitRead(Mux_Position, 0)));
    digitalWrite(Mux_Selector_2, bitRead(Mux_Position, 2));
    digitalWrite(Mux_Selector_1, bitRead(Mux_Position, 1));
    digitalWrite(Mux_Selector_0, bitRead(Mux_Position, 0));
    bitWrite(Button_Pressed, Mux_Position, digitalRead(Mux_Output));
  }
  if (digitalRead(Start_Button_Pin) == HIGH) {
    Button_Pressed = 256;
  }
  else if (digitalRead(Select_Button_Pin) == HIGH) {
    Button_Pressed = 257;
  }
  //Uncomment for debug
  //Serial.println("Button: " + String(Button_Pressed) + " " + String(bitRead(Button_Pressed, 8))+ String(bitRead(Button_Pressed, 7)) + String(bitRead(Button_Pressed, 6)) + String(bitRead(Button_Pressed, 5)) + String(bitRead(Button_Pressed, 4)) + String(bitRead(Button_Pressed, 3)) + String(bitRead(Button_Pressed, 2)) + String(bitRead(Button_Pressed, 1)) + String(bitRead(Button_Pressed, 0)));
}

String Button_Identifier() {
  switch (Button_Pressed) {
    case 0:
      Multiple_Button_Pressed = false;
      return "Null";
      break;
    case 1:
      return "Left";
      break;
    case 2:
      return "Up";
      break;
    case 4:
      return "Right";
      break;
    case 8:
      return "Down";
      break;
    case 16:
      return "B";
      break;
    case 32:
      return "Y";
      break;
    case 64:
      return "X";
      break;
    case 128:
      return "A";
      break;
    case 256:
      return "Start";
      break;
    case 257:
      return "Select";
      break;
    default:
      Multiple_Button_Pressed = true;
      return "Null";
      break;
  }
}

void publish_message() {
  // Se crea un String para construir el mensaje JSON
  String json_msg = "";

  //Se agregan las variables necesarias al JSON
  jsonInit(&json_msg);
  //Argumentos posibles solo pueden ser String, float o int
  addToJson(&json_msg, "Value", Button_Name);
  jsonClose(&json_msg);
  bool published = esp.MQTTPublish(Publish_topic, json_msg);

  //Uncomment for debug
  //Se imprime el código y cuerpo de la respuesta
  /*Serial.print("Mensaje publicado: ");
  Serial.print(json_msg);
  if (published) {
    Serial.println(" CON EXITO");
  } else {
    Serial.println(" FALLIDO");
  }*/

  //Se libera la memoria asociada al mensaje JSON
  jsonClear(&json_msg);
}


void loop() {
  Concatenate_Mux();
  if (Button_Pressed != Last_Button_Pressed) {
    Last_Button_Pressed = Button_Pressed;
    Button_Name = Button_Identifier();
    if ((Button_Name != "Null") and (!Multiple_Button_Pressed)) {
      publish_message();
    }
  }

  //Se verifica que el dispositivo este conectado
  if (!esp.MQTTConnected()) {
    //De lo contrario se conecta nuevamente
    esp.MQTTReconnect(device_id);
  }

  //Debe estar presente siempre que se utilice MQTTSubscribe
  esp.MQTTLoop();
}

void mqtt_callback(char* topicSub, byte* payload, unsigned int len) {
  //Notifica en puerto UART la recepción de un mensaje
  Serial.print("Mensaje recibido [");
  Serial.print(topicSub);
  Serial.print("] ");

  //Se imprime el mensaje caracter por caracter
  for (int i = 0; i < len; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}
