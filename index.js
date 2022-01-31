
//Dependencies
var express = require("express");
var router = require("./routes");

//SETUP
var app = express();
app.use(express.json());

//Routers
app.use("/api/capture", router);

//Listen through Port: 8080
app.listen(8080, () => {
    console.log("Server Up and Running...")
});