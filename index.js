var util = require('util');
var request = require('request');
var xml = require('libxml-to-js');
var EventEmitter = require('events').EventEmitter;

module.exports = TCPConnected;

var RequestString = 'cmd=%s&data=%s&fmt=xml';
var GetStateString = ['<gwrcmds><gwrcmd><gcmd>RoomGetCarousel</gcmd><gdata><gip><version>1</version><token>1234567890</token><fields>name,control,power,product,class,realtype,status</fields></gip></gdata></gwrcmd></gwrcmds>'].join('\n');
var RoomSendCommand = ['<gip><version>1</version><token>1234567890</token><rid>%s</rid><value>%s</value></gip>'].join('\n');
var Rooms = [];

function TCPConnected(host) {
	EventEmitter.call(this);
	if (!host) throw new Error("Invalid Parameters to WeMo")
	this._host = host;
};

TCPConnected.prototype.GetState = function (cb){
	
	var payload = util.format(RequestString,'GWRBatch',encodeURIComponent(GetStateString));

	//console.log(payload);
	
	var opts = {
	method:"POST",
	body:payload,
	headers:{
	  'Content-Type':'text/xml; charset="utf-8"',
	  //'SOAPACTION':'"urn:Belkin:service:basicevent:1#GetBinaryState"',
	  'Content-Length':payload.length
	},
	uri:'http://'+this._host+'/gwr/gop.php',
	};
	
	request(opts,function(e,r,b) {
		//console.log(b);
		
		xml(b, function (error, result) {
			Rooms = result['gwrcmd']['gdata']['gip']['room'];
			// console.dir(Rooms);
			if (error) {
			return cb(error);
			}
			try {
			var state = result['s:Body']['u:GetBinaryStateResponse'].BinaryState
			} catch (err) {
			var error = {error:'Unkown Error'}
			}
			cb(error||null,Rooms);
		});
	});
}

TCPConnected.prototype.GetRIDByName = function (name){
	var rid = 0;
		
	Rooms.forEach(function(room) { 
		if(room["name"] == name){
			rid = room["rid"];
			console.log(room["rid"]);
		}
	});
	
	return rid;
}
TCPConnected.prototype.TurnOnRoomByName = function (name, cb){
	rid = this.GetRIDByName(name);
	
	var RoomCommand = util.format(RoomSendCommand,rid,1);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomCommand));
	
	console.log(RoomCommand);
	
	var opts = {
	method:"POST",
	body:payload,
	headers:{
	  'Content-Type':'text/xml; charset="utf-8"',
	  'Content-Length':payload.length
	},
	uri:'http://'+this._host+'/gwr/gop.php',
	};
	
	request(opts,function(e,r,b) {
		console.log(b);
		cb(1);
	});
}
TCPConnected.prototype.TurnOffRoomByName = function (name, cb){
	rid = this.GetRIDByName(name);
	
	var RoomCommand = util.format(RoomSendCommand,rid,0);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomCommand));
	
	console.log(RoomCommand);
	
	var opts = {
	method:"POST",
	body:payload,
	headers:{
	  'Content-Type':'text/xml; charset="utf-8"',
	  'Content-Length':payload.length
	},
	uri:'http://'+this._host+'/gwr/gop.php',
	};
	
	request(opts,function(e,r,b) {
		console.log(b);
		cb(1);
	});
}

Test = new TCPConnected("192.168.1.137");

Test.GetState(function(error,system){
	//console.log(system);
	Test.TurnOffRoomByName("Living Room", function(error){
		console.log("Success");
	});
});
