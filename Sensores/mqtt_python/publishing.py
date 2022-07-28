import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

device_id = "disaster_team";
type_device = "/river"
point_ID = "/tempisque_1"
parameter = "/levelWater"

#Almacenamiento de topic MQTT
topic = "alertDisaster" + type_device + point_ID + parameter;

#mqttBroker ="mqtt.eclipseprojects.io" 
mqttBroker = "test.mosquitto.org"
client = mqtt.Client()
client.connect(mqttBroker) 

while True:
    randNumber = uniform(0, 20.0)
    client.publish(topic, randNumber)
    print("Just published " + str(randNumber) + " to topic " + topic)
    time.sleep(3)
