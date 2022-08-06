import paho.mqtt.client as mqtt 
from random import randrange, uniform
import time

def on_connect(client, userdata, flags, rc):
    print("Connected with result code", rc)
    client.subscribe("test")

def on_message(client, userdata, msg):
    print(msg.topic, msg.payload)

def on_publish(mqttc, obj, mid):
    print("mid: "+str(mid))

def on_subscribe(mqttc, obj, mid, granted_qos):
    print("Subscribed: "+str(mid)+" "+str(granted_qos))

def on_log(mqttc, obj, level, string):
    print(string)

id_topic = "hwthon/SAMAN"
hot_point = "/zapote"
location = "/upala"
type_device = "/sensor"
device_id = "/004"
parameter = "/waterLevel"

#Almacenamiento de topic MQTT
topic = id_topic #+ hot_point + location + type_device + device_id + parameter;


client = mqtt.Client() # client ID "mqtt-test"
client.on_connect = on_connect
client.on_message = on_message
client.on_publish = on_publish
client.on_subscribe = on_subscribe
client.username_pw_set("rkejuyun", "c56JRlI0Z5Z_")
print("Conectado a servidor")

client.connect('fortuitous-actor.cloudmqtt.com', 1883)
client.subscribe(topic, 0)
client.loop_forever()  # Start networking daemon 


