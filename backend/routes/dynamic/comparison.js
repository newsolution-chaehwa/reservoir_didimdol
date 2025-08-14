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

router.get('/', cors(), function(req, res, next) {

    console.log('request.body.params', req.body.params)

    // connection.query('select * from ML_mobile_flow where reservoir_ID = ')
})

module.exports = router;