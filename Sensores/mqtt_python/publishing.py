import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

device_id = "disaster_team";
type_device = "/sensor"
location = "/Filadelfia"
point_id = "/1"
parameter = "/waterLevel"
hot_point = "/rio_tempisque"
type_message = "/data"

#Almacenamiento de topic MQTT
topic = "alertDisaster" + type_device + location + point_id + parameter + hot_point + type_message;

#mqttBroker ="mqtt.eclipseprojects.io" 
mqttBroker = "test.mosquitto.org"
client = mqtt.Client()
client.connect(mqttBroker) 

while True:
    randNumber = uniform(0, 20.0)
    client.publish(topic, randNumber)
    print("Just published " + str(randNumber) + " to topic " + topic)
    time.sleep(3)
