import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

server = "driver.cloudmqtt.com";
user = "hvdscpnh";
srv_pass = "RT0dutQN19lg";
port = 18709;

#Almacenamiento del ID del dispositivo
type_device = "/fieldSensor"
device_ID = "001"
point_ID = "/tempisque_1"
parameter = "/levelWater"

#Almacenamiento de topic MQTT
topic = "alertDisaster" + type_device + device_ID + point_ID + parameter;

mqttc = mqtt.Client()
# Connect
mqttc.username_pw_set(user,srv_pass)
mqttc.connect(server, port)

while True:
    randNumber = uniform(10.0, 21.0)
    mqttc.publish(topic, randNumber)
    print("Just published " + str(randNumber) + " to topic: " + topic)
    time.sleep(10)
