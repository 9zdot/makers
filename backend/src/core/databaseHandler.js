const Database = require('better-sqlite3');
const path = require('path');
const moment = require('moment');

class databaseHandler {

    constructor() {
        this.dbPath = path.resolve(__dirname, '../db/makers.db')
        this.db = null;
        if (!!databaseHandler.instance) {
            return databaseHandler.instance;
        }
        databaseHandler.instance = this;
        return this;
    }

    connect() {
        if (!this.db) {
            this.db = new Database(this.dbPath);
        }
    }

    close() {
        this.db.close();
        this.db = null;
    }

    _getNextIndex(sensorID){
        let idx = this.db.prepare('SELECT counter, first FROM "index" WHERE sensor=?').get(sensorID)
        if (++idx.counter > 5 ) {
            idx.counter = 1;
            idx.first = 1;
        }
        return(idx);
    }

    addSensorData(msg){
        let nxt = this._getNextIndex(msg.id);
        this.db.prepare('UPDATE "index" SET counter=?, first=? WHERE sensor=?')
            .run(nxt.counter, nxt.first, msg.id);
        if(nxt.first) {
            this.db.prepare('UPDATE "messages" SET sensor=?, temp=?, humd=?, gas=?, light=?, time=? WHERE rowid = (SELECT rowid from "messages" WHERE sensor = ? LIMIT 1 OFFSET ?)')
                .run(msg.id, msg.temp || "", msg.humd || "", msg.gas || "", msg.light || "", ""+moment(), msg.id, nxt.counter-1);
        } else{
            this.db.prepare('INSERT INTO "messages" (sensor, temp, humd, gas, light, time) VALUES (?, ?, ?, ?, ?, ?)')
                .run(msg.id, msg.temp || "", msg.humd || "", msg.gas || "", msg.light || "", ""+moment());
        }
    }

    getSensorData(sensorID){
        let data = this.db.prepare('SELECT * FROM "messages" WHERE sensor=?').all(sensorID);
        return data ? data : {};
    }
}

module.exports = databaseHandler;