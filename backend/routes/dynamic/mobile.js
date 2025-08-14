var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var ConnectionInfo = require('../../database/connection-info.json');

var cors = require('cors')

var connection = mysql.createConnection({
    host: ConnectionInfo.host,
    user: ConnectionInfo.user,
    password: ConnectionInfo.password,
    port: ConnectionInfo.port,
    database: ConnectionInfo.database
})

router.get('/current', function(req, res, next) {
    connection.query(`select * from Yester_Data where reservoir_ID = ${req.query.id}`, function(error, rows, fields) {
        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
})

router.get('/week', function(req, res, next) {

    connection.query(`select * from ML_mobile_week where reservoir_ID = ${req.query.id}`, function(error, rows, fields) {
        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
})

router.get('/predict', function(req, res, next) {

    connection.query(`select * from ML_mobile_flow where reservoir_ID = ${req.query.id}`, function(error, rows, fields) {
        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
})



module.exports = router