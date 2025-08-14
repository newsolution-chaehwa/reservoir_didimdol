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

    connection.query('select * from Yester_Data', function(error, rows, fields) {

        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
})

/* GET users listing. */
router.get('/map', function(req, res, next) {

    connection.query('select * from Map_Data', function(error, rows, fields) {
        if(error) throw error;
        res.send(JSON.stringify(rows))
    })
  
});


module.exports = router;