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

router.get("/history", function (req, res, next) {
  connection.query(`select * from calendar order by date desc`, function (error, rows, fields) {
    if (error) throw error;
    res.send(JSON.stringify(rows));
  });
});

router.get("/history/mobile", function (req, res, next) {
  connection.query(`select * from calendar where reservoir_id = ${req.query.id} order by request_date asc  `, function (error, rows, fields) {
    if (error) throw error;
    res.send(JSON.stringify(rows));

  });
});

router.post("/create", function (req, res, next) {
  connection.query(
    `insert into calendar(DATE, reservoir_id, request_type, request_date, request_start_time, request_end_time) 
    values('${req.body.params.date}', 
    '${req.body.params.reservoirId}', ${req.body.params.requestType}, 
    '${req.body.params.requestDate}', '${req.body.params.requestStartTime}', 
    '${req.body.params.requestEndTime}')`,
    function (error, rows, fields) {
      if (error) throw error;
      res.send(JSON.stringify(rows));
    }
  );
});

router.delete("/delete", function (req, res, next) {
  connection.query(
    `delete from calendar where seq = ${parseInt(req.query.seq)}`,
    function (error, rows, fields) {
      if (error) throw error;
      res.send(JSON.stringify(rows));
    }
  );
});

module.exports = router;
