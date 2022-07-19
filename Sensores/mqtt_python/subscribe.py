import paho.mqtt.client as mqtt
import time

def on_message(client, userdata, message):
    print("received message: " ,str(message.payload.decode("utf-8")))

#mqttBroker ="mqtt.eclipseprojects.io"
mqttBroker = "test.mosquitto.org"
topic = "level_river"
client = mqtt.Client("disaster86")
client.connect(mqttBroker)

client.loop_start()

client.subscribe(topic)
#client.subscribe("#")
client.on_message=on_message

time.sleep(30)
client.loop_stop()
