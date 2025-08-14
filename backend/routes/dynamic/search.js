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

router.get("/", function (req, res, next) {

  connection.query(
    `SELECT * FROM ML_Pred_week_hist WHERE reservoir_ID = ${req.query.reservoirId} AND DATE between '${req.query.startDate}' AND '${req.query.endDate}'`,
    function (error, rows, fields) {
      if (error) throw error;
      res.send(JSON.stringify(rows));
    }
  );
});

module.exports = router;
