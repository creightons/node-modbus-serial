/* eslint-disable no-console, spaced-comment */

// create an empty modbus client
//var ModbusRTU = require("modbus-serial");
var ModbusRTU = require("../index");
var client = new ModbusRTU();

var networkErrors = ['ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'];

// open connection to a serial port
//client.connectRTU("/dev/ttyUSB0", {baudrate: 9600})
client.connectTCP("127.0.0.1", {port: 8502})
    .then(setClient)
    .then(function() {
        console.log("Connected"); })
    .catch(function(e) {
        if(e.errno) {
            if(networkErrors.contains(e.errno)) {
                console.log('we have to reconnect');
            }
        }
        console.log(e.message); });

function setClient() {
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client.setID(1);
    client.setTimeout(1000);

    // run program
    run();
}

function run() {
    // read the 4 registers starting at address 5
    client.readHoldingRegisters(5, 4)
        .then(function(d) {
            console.log("Receive:", d.data); })
        .catch(function(e) {
            console.log(e.message); })
        .then(function() { setTimeout(run, 1000); });
}
