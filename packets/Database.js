
//Dependecies
var mysql = require("mysql");
var dotenv = require("dotenv");
dotenv.config();

//SetUp Connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.pass,
    database: "pcap"
});

//EXPORT DATABASE CONNECTION
module.exports = con; 