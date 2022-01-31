
//Dependencies
var express = require("express")
var capture = require("./packets/capture");
var db = require("./packets/Database");

//SetUp Router
var router = express.Router();
router.use(express.json());

//GET STORED SESSIONS { GET:: #/api/capture/sessions }
router.get("/sessions", (req, res) => {
    db.query(`SELECT * FROM sessions`, (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

//GET PACKETS STORED IN A SESSION { GET:: #/api/capture/:Session_ID }
router.get("/:id", (req, res) => {
    var id = req.params.id;
    db.query(`SELECT * FROM sessions WHERE id = ${id}`, (err, data) => {
        if (data.length) {
            db.query(`SELECT * FROM packets WHERE session_id = ${id}`, (err, data) => {
                if (err) throw err;
                res.send(data);
            });
        } else res.status(404).send(`NO SUCH SESSION: { id = ${id} }`);
    });
});

//INITIATE NEW CAPTURE SESSION { POST:: #/api/capture/new } ~~ BODY: {name, device, filter, duration}
router.post("/new", (req,res) => {
    var {name, device, filter, duration} = req.body
    var id = capture.capture(name, device, filter, duration);
    res.send(`Capturing Packets To Session { ${name} } ~ ${duration} sec.`);
});

//END THE CURRENT CAPTURE SESSION { DELETE:: #/api/capture/endCapture }
router.delete("/endCapture", (req, res) => {
    if (capture.isCapturing()) {
        capture.endCapture();
        res.send("CAPTURE TERMINATED");
    } else {
        res.status(404).send("NO CAPTURE IN PROGRESS");
    }
})

//DELETE SESSION WITH PACKETS { DELETE:: #/api/capture/:Session_ID }
router.delete("/:sessionId", (req, res) => {
    var id = req.params.sessionId;
    db.query(`SELECT * FROM sessions WHERE id = ${id}`, (err, result) => {
        if (err) throw err;
        if (result.length) {
            db.query(`DELETE FROM packets WHERE session_id = ${id}`);
            db.query(`DELETE FROM sessions WHERE id = ${id}`);
            res.send("DELETED");
        } else res.status(404).send(`NO SUCH SESSION: { id = ${id} }`);
    });
});

module.exports = router; //Export Router