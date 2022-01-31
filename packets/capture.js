
//Dependencies
var pcap = require('pcap');
var pcap_session = pcap.createSession('en0', { filter: "tcp" });
var db = require("./Database");

//DECLARE GLOBAL VARS
var curSession = null;
var isCapturing = false;

//ON PACKET CAPTURE:
pcap_session.on('packet', async function (raw_packet) {
    if (!isCapturing || curSession == null) return;
    var packet = pcap.decode.packet(raw_packet);

    console.log(`Captured Packet from ${packet.payload.payload.saddr} to ${packet.payload.payload.daddr} during session ${curSession}`);
    db.query(`INSERT INTO packets (s_addr, d_addr, info, session_id) VALUES (\
    '${(packet.payload.payload.saddr)}',\
    '${packet.payload.payload.daddr}',\
    '${packet.toString()}', ${curSession})`);
});

//SESSION MANAGEMENT:
var endCapture = () => { isCapturing = false; curSession = null; console.log("..<Session has Ended>..") };
var capture = (name, device, filter, scnds) => {
    if (isCapturing) return;
    pcap.device = device;
    pcap.filter = filter;
    console.log(`New Session: { ${name} }`)
    db.query(`INSERT INTO sessions (name, device, filter, time, dur) VALUES ('${name}', '${device}', '${filter}', NOW(), ${scnds})`, (err, data) => {
        if (err) throw err;
        curSession = data.insertId;
        isCapturing = true;
        setTimeout(endCapture, scnds * 1000);
    });
}

module.exports = { capture, endCapture, isCapturing}; //EXPORT CAPTURE METHODS