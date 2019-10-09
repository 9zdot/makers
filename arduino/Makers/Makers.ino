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

#define SMOKE A0

// WiFi
const char* ssid = "9z.";
const char* wifi_password = "1wISEcASE1936";

//change for ESP lolin
const boolean isLolin = false; //<------- PLEASE CHANGE!!!!!
//Change for each ESP8266
const int clientNumber = 1; //<------- PLEASE CHANGE!!!!!
// MQTT
const char* mqtt_server = "makerpi.local";
const char* mqtt_topic = "makers";
// The client id identifies the ESP8266 device
const char* clientID = "Arduino#" + clientNumber;

const int ledPin = (isLolin) ? 2 : 16;

// Initialise the WiFi and MQTT Client objects
WiFiClient wifiClient;
PubSubClient client(mqtt_server, 1883, wifiClient); // 1883 is the listener port for the Broker

void setup() {
  dht.begin();
  pinMode(SMOKE, INPUT);
  pinMode(ledPin, OUTPUT);
  // Switch the on-board LED off to start with
  digitalWrite(ledPin, HIGH);
  // Begin Serial on 115200
  // This is just for debugging purposes
  Serial.begin(115200);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  // Connect to the WiFi
  WiFi.begin(ssid, wifi_password);
  // Wait until the connection has been confirmed before continuing
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Debugging - Output the IP Address of the ESP8266
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  // Connect to MQTT Broker
  // client.connect returns a boolean value to let us know if the connection was successful.
  if (client.connect(clientID)) {
    Serial.println("Connected to MQTT Broker!");
  }
  else {
    Serial.println("Connection to MQTT Broker failed...");
  }
}

void loop() {
  StaticJsonDocument<200> doc;
  doc["id"] = clientNumber;
  if(dht.readTemperature()){
    doc["temp"] = dht.readTemperature();
  } else {
     doc["temp"] = "NA";
  }
  if(dht.readHumidity()){
    doc["humd"] = dht.readHumidity();
  } else {
     doc["humd"] = "NA";
  }
  if(analogRead(SMOKE) > 30){
    doc["gas"] = analogRead(SMOKE);
  } else {
     doc["gas"] = "NA";
  }

  doc["light"] = "NA";
  char bufferMsg[512];
  serializeJson(doc, bufferMsg);
  if (client.publish(mqtt_topic, bufferMsg)) {
    Serial.println("message sent!");
    digitalWrite(ledPin, LOW);
    delay(3000);
    digitalWrite(ledPin, HIGH);
    delay(2000);
  }
  else {
    Serial.println("Message failed to send. Reconnecting to MQTT Broker and trying again");
    client.connect(clientID);
    delay(10); // This delay ensures that client.publish doesn't clash with the client.connect call
    client.publish(mqtt_topic, bufferMsg);
  }
}
