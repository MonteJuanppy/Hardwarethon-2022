import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

#mqttBroker ="mqtt.eclipseprojects.io" 
mqttBroker = "test.mosquitto.org"
topic = "level_river"
client = mqtt.Client("disaster86")
client.connect(mqttBroker) 

while True:
    randNumber = uniform(10.0, 21.0)
    client.publish(topic, randNumber)
    print("Just published " + str(randNumber) + " to topic " + topic)
    time.sleep(3)
