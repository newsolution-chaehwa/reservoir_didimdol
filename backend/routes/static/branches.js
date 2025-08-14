var express = require("express");
var router = express.Router();

var mysql = require("mysql");
var ConnectionInfo = require("../../database/connection-info.json");

var connection = mysql.createConnection({
  host: ConnectionInfo.host,
  user: ConnectionInfo.user,
  password: ConnectionInfo.password,
  port: ConnectionInfo.port,
  database: ConnectionInfo.database,
  timezone: ConnectionInfo.timezone,
});

router.get('/headquarters', function(req, res, next) {
    connection.query('select * from headquarters order by id asc', function(error, rows, fields) {
        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
})

router.get('/branches', function(req, res, next) {
    connection.query('SELECT * FROM branches where headquarter_id = 5 order by id ASC;', function(error, rows, fields) {
        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
})

module.exports = router