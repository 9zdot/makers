/*
*  _                                                   _
* | |__  _   _  __      ___ __ ___   __ _  ___ ___  __| | ___
* | '_ \| | | | \ \ /\ / / '_ ` _ \ / _` |/ __/ _ \/ _` |/ _ \
* | |_) | |_| |  \ V  V /| | | | | | (_| | (_|  __/ (_| | (_) |
* |_.__/ \__, |   \_/\_/ |_| |_| |_|\__,_|\___\___|\__,_|\___/
*         |___/
*/
#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
#include <ArduinoJson.h> // To send the output as a Json object
#include "DHT.h"

#define DHTPIN D1
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
#define SMOKE D2
#define LDRPIN A0

// WiFi
const char* ssid = "makers";
const char* wifi_password = "makers2019";

//Set true for ESP lolin
const boolean isLolin = true; //<------- PLEASE CHANGE!!!!!
//Increment for each ESP8266
const int clientNumber = 2; //<------- PLEASE CHANGE!!!!!
const int LEDPIN = (isLolin) ? 2 : 16;
//Sleep Time
const int st = 10000;
// MQTT
const char* mqtt_server = "makerpi.local";
const char* mqtt_topic = "makers";
// The client id identifies the ESP8266 device
const char* clientID = "Arduino#" + clientNumber;

// Initialise the WiFi and MQTT Client objects
WiFiClient wifiClient;
PubSubClient client(mqtt_server, 1883, wifiClient); // 1883 is the listener port for the Broker

void conect2Wifi() {
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, wifi_password);
    // Wait until the connection has been confirmed before continuing
    while (WiFi.status() != WL_CONNECTED) {
        digitalWrite(LEDPIN, LOW);
        delay(500);
        Serial.print(".");
        digitalWrite(LEDPIN, HIGH);
    }
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void connect2Broker(){
    Serial.print("Connecting to the MQTT Broker server: ");
    Serial.println(mqtt_server);
    // client.connect returns a boolean value to let us know if the connection was successful.
    if (client.connect(clientID))
    {
        Serial.println("Connected to MQTT Broker!");
    }
    else
    {
        Serial.print("Fail to connect to the Broker, rc=");
        Serial.println(client.state());
    }
    delay(10);
}

void setup() {
    dht.begin();
    pinMode(SMOKE, INPUT);
    pinMode(LDRPIN, INPUT);
    pinMode(LEDPIN, OUTPUT);
    // Switch the on-board LED off to start with
    digitalWrite(LEDPIN, HIGH);
    // Begin Serial on 115200
    Serial.begin(115200);
    // Connect to the WiFi
    conect2Wifi();
    // Connect to MQTT Broker
    connect2Broker();
}

void loop() {
    //json buffer
    StaticJsonDocument<200> json;
    json["id"] = clientNumber;
    //reading value from sensors
    float temp = dht.readTemperature();
    float humd = dht.readHumidity();
    int gas = digitalRead(SMOKE);
    int light = analogRead(LDRPIN);

    //mounting json to sent to MQTT
    json["temp"] = isnan(temp) ? "NA" : String(temp, 2);
    json["humd"] = isnan(humd) ? "NA" : String(humd, 2);
    json["gas"] =  gas == HIGH ? false : true; //binary result. It has gas or not in the env
    json["light"] = light ? String(light, DEC) : "NA";

    char bufferMsg[512];
    serializeJson(json, bufferMsg);
    serializeJsonPretty(json, Serial);

    if (WiFi.status() == WL_CONNECTED)
    {
        if (client.publish(mqtt_topic, bufferMsg)) {
            Serial.println("message sent: ");
            // Makes internal led blink to show message being sending
            digitalWrite(LEDPIN, LOW);
            delay(st/2);
            digitalWrite(LEDPIN, HIGH);
            delay(st/2);
        }
        else {
            //if it fails again the message will be skipped and a new measure will be done
            connect2Broker();
            client.publish(mqtt_topic, bufferMsg);
            delay(st);
        }
    }
    else
    {
        Serial.println("Lost Connection with WiFi");
        conect2Wifi();
    }
}
