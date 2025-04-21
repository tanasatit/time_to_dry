import uasyncio as asyncio
from machine import Pin, ADC, I2C
from config import MQTT_BROKER, MQTT_PASS, MQTT_USER, WIFI_SSID, WIFI_PASS
from umqtt.robust import MQTTClient
import network
import math
import json
import dht
import time

TOPIC_SENSORS = "b6610545391/time_to_dry"

s1 = Pin(16, Pin.IN, Pin.PULL_UP)

sensor_1 = dht.DHT11(Pin(32))  # I1 Pin
sensor_2 = dht.DHT11(Pin(33))  # I2 Pin


def get_temperature(sensor, sensor_name):
    sensor.measure()
    temp = sensor.temperature()
    return temp

    
def get_humidity(sensor, sensor_name):
    sensor.measure()
    humidity = sensor.humidity()
    return humidity

    
def get_lux():
    PHOTORESISTOR_PIN = 34  # ADC input pin I3
    adc = ADC(Pin(PHOTORESISTOR_PIN))
    adc.atten(ADC.ATTN_11DB)  # Full range 0-3.3V
    
    A = 500  # Adjust based on real light conditions
    B = 1.2  # Empirical exponent (depends on LDR)
    
    light_intensity = adc.read()
    lux = A * ((4095 / light_intensity) - 1) ** B
    return lux
    
    
async def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASS)
    
    print("Connecting to Wi-Fi...")
    for _ in range(20):  # Try for 20 seconds
        if wlan.isconnected():
            print("Connected!")
            return True
        await asyncio.sleep(1)  # Wait before retrying
    return False


def mqtt_callback(topic, msg):
    pass

async def mqtt_setup():
    global mqtt
    mqtt = MQTTClient(client_id="",
                      server=MQTT_BROKER,
                      user=MQTT_USER,
                      password=MQTT_PASS)
    mqtt.set_callback(mqtt_callback)

    try:
        mqtt.connect()
        print(f"Connected to MQTT broker")
    except Exception as e:
        print("MQTT connection failed:", e)


async def ensure_wifi():
    """ Ensure Wi-Fi is always connected """
    wlan = network.WLAN(network.STA_IF)
    if not wlan.isconnected():
        print("Wi-Fi lost! Reconnecting...")
        await connect_wifi()

async def ensure_mqtt():
    """ Ensure MQTT is always connected """
    global mqtt
    try:
        mqtt.ping()  # Check if still connected
    except Exception:
        print("MQTT lost! Reconnecting...")
        await mqtt_setup()

async def publish_readings():
    while True:
        await ensure_wifi()  # Reconnect Wi-Fi if needed
        await ensure_mqtt()  # Reconnect MQTT if needed

        try:
            lux = get_lux()

            temp_in = get_temperature(sensor_1, 1)
            temp_out = get_temperature(sensor_2, 2)

            hum_in = get_humidity(sensor_1, 1)
            hum_out = get_humidity(sensor_2, 2)

            diff_hum = hum_in - hum_out
            diff_temp = temp_in - temp_out
            
            payload = json.dumps({
                "lat": 13.837202976085079,
                "lon": 100.57642001151498,
                "light": lux,
                "temp_in": temp_in,
                "temp_out": temp_out,
                "hum_in": hum_in,
                "hum_out": hum_out,
                "diff_hum": diff_hum,
                "diff_temp": diff_temp
            })
            print("Publishing:", payload)
            mqtt.publish(TOPIC_SENSORS, payload)
        except Exception as e:
            print("Error publishing data:", e)
            await mqtt_setup()  # Reconnect MQTT if publish fails
        # time 180 for 3 min    
        await asyncio.sleep(5)  # Collect data every 3 minutes


async def mqtt_listener():
    while True:
        try:
            mqtt.check_msg()  # Handle incoming messages (not used for data collection)
        except Exception as e:
            print("MQTT listener error:", e)
            await mqtt_setup()  # Reconnect MQTT if needed
        await asyncio.sleep(0.1)


async def main():
    while True:
            if await connect_wifi():  # Connect Wi-Fi only when collecting data
                await mqtt_setup()
                await asyncio.gather(
                        publish_readings(),
                        mqtt_listener()
                        )
                print("Disconnecting Wi-Fi after 3 minutes of data collection.")
                wlan = network.WLAN(network.STA_IF)
                wlan.active(False)  # Disconnect from Wi-Fi after data collection
            else:
                print("Wi-Fi connection failed!")
            # 180 for 3 min
            await asyncio.sleep(5)  # Wait for 3 minutes before reconnecting to Wi-Fi

asyncio.run(main())
