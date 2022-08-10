//Se incluye biblioteca para el uso de ESP8266 independiente
#include "ESP_XYZ_StandAlone.h"

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif


//Creación del objeto esp que controla las funciones de red
ESP_XYZ esp;

//Almacenamiento de los datos de la red inalámbrica
char* ssid = "Rizoma"; //Rizoma
char* pass = "1nn0v@c10n"; //1nn0v@c10n

//Almacenamiento de los datos del servidor MQTT
String server = "fortuitous-actor.cloudmqtt.com";
String srv_user = "rkejuyun";
String srv_pass = "c56JRlI0Z5Z_";
int port = 1883;

//Almacenamiento de topic MQTT
String device_id = "/002";
String id_topic = "hwthon/SAMAN";
String hot_point = "/tempisque";
String location = "/Filadelfia";
String type_device = "/alarm";
String parameter ="/sound";

int Bit1 = 0;
int Bit2 = 0;
String Id = id_topic+hot_point+location+type_device+device_id+parameter;

const int buzzer = 13; //buzzer to arduino pin 13


// Which pin on the Arduino is connected to the NeoPixels?
#define PIN        14 // On Trinket or Gemma, suggest changing this to 1

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 4 // Popular NeoPixel ring size

// When setting up the NeoPixel library, we tell it how many pixels,
// and which pin to use to send signals. Note that for older NeoPixel
// strips you might need to change the third parameter -- see the
// strandtest example for more information on possible values.
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

#define DELAYVAL 500 // Time (in milliseconds) to pause between pixels


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
  esp.MQTTSubscribe(Id);

  //Configuración de función de callback
  esp.MQTTSetCallback(mqtt_callback);

   pinMode(buzzer, OUTPUT); 
   pinMode(12, OUTPUT);
   pinMode(15, OUTPUT);

   #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
  #endif

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {
  
  //Se verifica que el dispositivo este conectado
  if (!esp.MQTTConnected()) {
    //De lo contrario se conecta nuevamente
    esp.MQTTReconnect(device_id);
  }
  //Debe estar presente siempre que se utilice MQTTSubscriibe
 
  esp.MQTTLoop();

  strip.show();   // Send the updated pixel colors to the hardware.

}

//Función de callback
//Debe retornar void y tener los mismos argumentos
void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  uint32_t nada = strip.Color(0, 0, 0); 
  uint32_t verde = strip.Color(0, 255, 0);
  uint32_t amarillo = strip.Color(255, 255, 0); 
  uint32_t rojo = strip.Color(255, 0, 0);
  uint32_t naranja = strip.Color(255, 255, 255);
  uint32_t morado = strip.Color(160, 32, 240);
  
  String entrada;
   for (int i = 0; i < length; i++) {
    entrada =  entrada+((char)payload[i]);
  }
  int stint = entrada.toInt();

  if (stint<8){//Caso todo good
    Serial.print("Todo tranquilon\n");
    for( int i = 0; i<NUMPIXELS; i++){
        strip.setPixelColor(i, verde);
    } 
     strip.show();

    noTone(buzzer);
    digitalWrite(12, LOW); 
    digitalWrite(15, LOW);
    
  }

  else if ((stint>=8) & (stint <9)){//Caso todo good
    Serial.print("Soque se despicha tere\n");
    for( int i = 0; i<NUMPIXELS; i++){
        strip.setPixelColor(i, amarillo);
    } 
     strip.show();
     tone(buzzer, 1000); // Send 1KHz sound signal...
    delay(500);        // ...for 1 sec
    noTone(buzzer);     // Stop sound...
    delay(500);        // ...for 1sec
    digitalWrite(12, HIGH); 
    digitalWrite(15, LOW);
  }

 else if ((stint>=9) & (stint <100)){//Caso todo good
    Serial.print("Me ahogoooo\n");
    for( int i = 0; i<NUMPIXELS; i++){
        strip.setPixelColor(i, rojo);
    } 
     strip.show();
     tone(buzzer, 1000); // Send 1KHz sound signal...
    delay(250);        // ...for 1 sec
    noTone(buzzer);     // Stop sound...
    delay(250);        // ...for 1sec
    digitalWrite(12, HIGH); 
    digitalWrite(15, LOW);
  }

   else if ((stint>=100)){//Caso todo good
    Serial.print("Se viene el tembloor\n");
    for( int i = 0; i<NUMPIXELS; i++){
        strip.setPixelColor(i, naranja);
    } 
     strip.show();
     tone(buzzer, 2000); // Send 1KHz sound signal...
    delay(100);        // ...for 1 sec
    noTone(2000);     // Stop sound...
    delay(100);        // ...for 1sec
     digitalWrite(12, HIGH); 
    digitalWrite(15, HIGH);
    
  }

  else {
    Serial.print("No hay waifai\n");
    for( int i = 0; i<NUMPIXELS; i++){
        strip.setPixelColor(i, morado);
         strip.show();
         noTone(buzzer);
    } 
    
  }
 
  Serial.println(entrada);
/*
  else Serial.print("Nada, ni modo");
   for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();*/
}
