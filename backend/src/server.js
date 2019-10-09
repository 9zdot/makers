const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const mqttHandler = require('./core/mqttHandler');
const databaseHandler = require('./core/databaseHandler');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = new databaseHandler();

let mqttClient = new mqttHandler();
mqttClient.connect();

// Routes
app.get('/arduino/:id', function(req, res) {
    db.connect();
    res.status(200).send(db.getSensorData(req.params.id));
    db.close();
});

app.get('/doc', function(req, res) {
  res.status(200).send("Doc");
});

app.listen(3000, '0.0.0.0', () => console.log('API listening on port 3000'));