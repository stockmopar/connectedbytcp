var util = require('util');
var request = require('request');
var xml = require('libxml-to-js');
var EventEmitter = require('events').EventEmitter;

module.exports = TCPConnected;

var RequestString = 'cmd=%s&data=%s&fmt=xml';
var GetStateString = ['<gwrcmds><gwrcmd><gcmd>RoomGetCarousel</gcmd><gdata><gip><version>1</version><token>1234567890</token><fields>name,control,power,product,class,realtype,status</fields></gip></gdata></gwrcmd></gwrcmds>'].join('\n');
var RoomSendCommand = ['<gip><version>1</version><token>1234567890</token><rid>%s</rid><value>%s</value></gip>'].join('\n');
var RoomSendLevelCommand = ['<gip><version>1</version><token>1234567890</token><rid>%s</rid><value>%s</value><type>level</type></gip>'].join('\n');
var Rooms = [];

function TCPConnected(host) {
	EventEmitter.call(this);
	if (!host) throw new Error("Invalid Parameters to WeMo")
	this._host = host;
};

TCPConnected.prototype.GetState = function (cb){
	var payload = util.format(RequestString,'GWRBatch',encodeURIComponent(GetStateString));
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
		xml(b, function (error, result) {
			// Need to add validation to make sure that Rooms is proper or else result error
			console.log(result);
			if(typeof(result["gip"]) !== 'undefined'){
				error = 1;
			}else{
				Rooms = result['gwrcmd']['gdata']['gip']['room'];
				if (typeof(Rooms["rid"]) !== 'undefined'){
					Rooms = [ Rooms ];
				}
			}
			//console.log(Rooms);
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
TCPConnected.prototype.GetRoomHueByName = function (name, cb){
	Rooms.forEach(function(room) { 
		if(room["name"] == name){
			var color = room["color"];
			
			var r = parseInt(color.substr(0,2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
			var g = parseInt(color.substr(2,2), 16);
			var b = parseInt(color.substr(4,2), 16);
			
			console.log(r + "." + g + "." + b);
			
			var hue = parseInt(rgb2hsv(r, g, b)["h"] * 182);
			
			cb(null,hue);
		}
	});
}
TCPConnected.prototype.GetRoomStateByName = function (name, cb){
	Rooms.forEach(function(room) { 
		if(room["name"] == name){
			state = 0;
			var i = 0;
			var sum = 0;
			var devices = room["device"];
			if (typeof(devices["did"]) !== 'undefined'){
				i = i+1;
				if(devices["state"] != "0"){
					state = 1;
					sum = sum + parseInt(devices["level"]);
				}
			}else{
				devices.forEach(function(device) { 
					i = i+1;
					if(device["state"] != "0"){
						state = 1;
						sum = sum + parseInt(device["level"]);
					}
				});
				
			}
			if(i == 0){
				sum = 0;
				i = 1;
				state = 0;
			}
			level = sum / i;
			cb(null,state,level);
		}
	});
}
TCPConnected.prototype.GetRIDByName = function (name){
	var rid = 0;
	//console.log(Rooms);
	Rooms.forEach(function(room) {
		//console.log(room);
		if(room["name"] == name){
			rid = room["rid"];
		}
	});
	//console.log(rid);
	return rid;
}

TCPConnected.prototype.TurnOnRoomByName = function (name){
	rid = this.GetRIDByName(name);
	
	var RoomCommand = util.format(RoomSendCommand,rid,1);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomCommand));

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
		// Request Complete
	});
}
TCPConnected.prototype.TurnOffRoomByName = function (name, cb){
	console.log("Turn Off Room");
	rid = this.GetRIDByName(name);
	
	var RoomCommand = util.format(RoomSendCommand,rid,0);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomCommand));
	
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
		// Request Complete
	});
}
TCPConnected.prototype.SetRoomLevelByName = function (name, level, cb){
	console.log("Set Level of Room");
	rid = this.GetRIDByName(name);
	
	var RoomLevelCommand = util.format(RoomSendLevelCommand,rid,level);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomLevelCommand));
	
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
		// Request Complete
	});
}

function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}