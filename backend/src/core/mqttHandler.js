const mqtt = require('mqtt');
const moment = require('moment');
const databaseHandler = require('./databaseHandler');

class mqttHandler {

  constructor() {
    this.mqttClient = null;
    this.host = 'http://192.168.0.10:1883';
    this.topic = "makers";
  }

  normalizeMsg(msg){
      return msg;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
        console.log(err);
        this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
        console.log(`mqtt client connected at `+ moment().format("h:mm:ss a"));
    });

    // mqtt subscriptions
    this.mqttClient.subscribe(this.topic, {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, msg) {
        let db = new databaseHandler();
        db.connect();
        db.addSensorData(JSON.parse(msg));
        db.close();
    });

    this.mqttClient.on('close', () => {
        console.log(`mqtt client disconnected at `+ moment().format("h:mm:ss a"));
    });
  }
}

module.exports = mqttHandler;