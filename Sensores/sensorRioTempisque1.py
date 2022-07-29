import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

hot_point = "/tempisque"
location = "/Filadelfia"
type_device = "/sensor"
device_id = "/001"
parameter = "/waterLevel"


#Almacenamiento de topic MQTT
topic = "alertDisaster" + hot_point + location + type_device + device_id + parameter;

#mqttBroker ="mqtt.eclipseprojects.io" 
mqttBroker = "test.mosquitto.org"
client = mqtt.Client()
client.connect(mqttBroker) 

while True:
    randNumber = uniform(0, 20.0)
    client.publish(topic, randNumber)
    print("Just published " + str(randNumber) + " to topic " + topic)
    time.sleep(3)
