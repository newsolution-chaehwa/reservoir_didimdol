var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var ConnectionInfo = require('../../database/connection-info.json');

var connection = mysql.createConnection({
    host: ConnectionInfo.host,
    user: ConnectionInfo.user,
    password: ConnectionInfo.password,
    port: ConnectionInfo.port,
    database: ConnectionInfo.database,
    timezone: ConnectionInfo.timezone
})

var moment = require('moment')

router.get('/', function(req, res, next) {

    let today = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
    console.log('today', today)

    connection.query(`select * from Weather_Data where date = '${today}'`, function(error, rows, fields) {

        if(error) throw error
        res.send(JSON.stringify(rows))
    })

});

module.exports = router
