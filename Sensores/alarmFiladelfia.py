import paho.mqtt.client as mqtt
import time

hot_point = "/tempisque"
location = "/Filadelfia"
type_device = "/alarm"
device_id = "/002"
parameter = "/ligth"

def on_message(client, userdata, message):
    print("Topic: ", str(message.topic))
    print("received message: " ,str(message.payload.decode("utf-8")))

#mqttBroker ="mqtt.eclipseprojects.io"
mqttBroker = "test.mosquitto.org"

topic = "alertDisaster" + hot_point + location + type_device + "/#";
client = mqtt.Client()
client.connect(mqttBroker)

client.loop_start()

client.subscribe(topic)
client.on_message=on_message

time.sleep(30)
client.loop_stop()
