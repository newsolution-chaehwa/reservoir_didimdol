/**
 * DB
 * @module backend/db
 */

const Database = {}

var mysql = require('mysql')
var ConnectionInfo = require('./connection-info.json')

// var connection = mysql.createConnection({
//     host: ConnectionInfo.host,
//     user: ConnectionInfo.user,
//     password: ConnectionInfo.password,
//     port:ConnectionInfo.port,
//     database:ConnectionInfo.database
// })

// console.log('---CONNECTION---')
// // console.log(connection)
// connection.connect(function(err) {
//     if(err) {
//         console.err('error connection: ' + err.stack)
//     }
//     connection.query('select count(*) from Map_Data;', function(error, rows, fields) {
//         if(error) throw error;
//         console.log('rows', rows)
//     })
// })
// db.connection = connection

let result = undefined

Database.sendQuery = async(query) => {

    try {

        let conn = await mysql.createConnection({
            host: ConnectionInfo.host,
            user: ConnectionInfo.user,
            password: ConnectionInfo.password,
            port:ConnectionInfo.port,
            database:ConnectionInfo.database
        })

        let [rows, fields] = await conn.query(query)
        console.log('rows', rows)

        let data = {}



    } catch(e) {

        console.error('DB ERROR:::', e)

    }

    // connection.connect(function(err) {
    //     if(err) {
    //         console.err('CONNECTION ERROR::::', err.stack)
    //     }
    
    //     connection.query(query, function(error, rows, fields) {
    //         if(error) throw error;

    //       result = rows
    //       console.log('ROWS:', rows)
    //     // console.log('Fields:', fields)
    //     })
    // })
}

module.exports = Database