import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

server = "driver.cloudmqtt.com";
user = "hvdscpnh";
srv_pass = "RT0dutQN19lg";
port = 18709;

#Almacenamiento del ID del dispositivo
device_id = "disaster_team";

#Almacenamiento de topic MQTT
topic = "level_river";

mqttc = mqtt.Client()
# Connect
mqttc.username_pw_set(user,srv_pass)
mqttc.connect(server, port)

while True:
    randNumber = uniform(10.0, 21.0)
    mqttc.publish(topic, randNumber)
    print("Just published " + str(randNumber) + " to topic: " + topic)
    time.sleep(5)
