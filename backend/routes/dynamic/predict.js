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

/* GET users listing. */
router.get('/week', function(req, res, next) {

    connection.query('select * from ML_Pred_week', function(error, rows, fields) {

        if(error) throw error

        console.log(rows.length)
        res.send(JSON.stringify(rows))
    })

});

router.get('/week/mobile', function(req, res, next) {

    connection.query(`select * from ML_Pred_week where reservoir_id = ${req.body.params.reservoirId}`, function(error, rows, fields) {

        console.log('rows', rows)
        if(error) throw error

        console.log(rows.length)
        res.send(JSON.stringify(rows))
    })

    // connection.end()
});

/* GET users listing. */
router.get('/week/weather', function(req, res, next) {

    connection.query('select * from ML_Pred_week_weather', function(error, rows, fields) {
        if(error) throw error
        res.send(JSON.stringify(rows))
    })

    // connection.end()
});

/* GET users listing. */
router.get('/month', function(req, res, next) {

    connection.query('select * from ML_Pred_month', function(error, rows, fields) {
        if(error) throw error
        res.send(JSON.stringify(rows))
    })

    // connection.end()
});

/* GET users listing. */
router.get('/month/weather', function(req, res, next) {

    connection.query('select * from ML_Pred_month_weather', function(error, rows, fields) {
        if(error) throw error
        res.send(JSON.stringify(rows))
    })

    // connection.end()
});

/* GET users listing. */
router.get('/quarter', function(req, res, next) {

    connection.query('select * from ML_Pred_quarter', function(error, rows, fields) {
        if(error) throw error
        res.send(JSON.stringify(rows))
    })

    // connection.end()
});

/* GET users listing. */
router.get('/quarter/weather', function(req, res, next) {

    connection.query('select * from ML_Pred_quarter_weather', function(error, rows, fields) {
        if(error) throw error
        res.send(JSON.stringify(rows))
    })

    // connection.end()
});

module.exports = router;