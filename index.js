var util = require('util');
var https = require('https');
var xml = require('libxml-to-js');
var EventEmitter = require('events').EventEmitter;
var nconf = require('nconf');
var uuid = require('node-uuid');

module.exports = TCPConnected;

var RequestString = 'cmd=%s&data=%s&fmt=xml';
var GetStateString = ['<gwrcmds><gwrcmd><gcmd>RoomGetCarousel</gcmd><gdata><gip><version>1</version><token>%s</token><fields>name,control,power,product,class,realtype,status</fields></gip></gdata></gwrcmd></gwrcmds>'].join('\n');

var RoomSendCommand = ['<gip><version>1</version><token>%s</token><rid>%s</rid><value>%s</value></gip>'].join('\n');
var RoomSendLevelCommand = ['<gip><version>1</version><token>%s</token><rid>%s</rid><value>%s</value><type>level</type></gip>'].join('\n');

var DeviceSendCommand = ['<gip><version>1</version><token>%s</token><did>%s</did><value>%s</value></gip>'].join('\n');
var DeviceSendLevelCommand = ['<gip><version>1</version><token>%s</token><did>%s</did><value>%s</value><type>level</type></gip>'].join('\n');

var LogInCommand = ['<gip><version>1</version><email>%s</email><password>%s</password></gip>'].join('\n');

var Rooms = [];

// needed to keep socket variable in scope
var tcpSocket = this;

function TCPConnected(host) {
	EventEmitter.call(this);
	if (!host) throw new Error("Invalid Parameters to TCP Connected")
	this._host = host;
	this._hasToken = 0;
};
TCPConnected.prototype.Init = function(cb){
	this.LoadToken(cb);
}
TCPConnected.prototype.GWEnd = function(){
	tcpSocket.end(); 
}
TCPConnected.prototype.GWRequest = function(payload,cb){
	if(!this._hasToken){
		cb(1);
	}else{
		var options = {
			hostname: this._host,
			port: 443,
			path: '/gwr/gop.php',
			method: 'POST',
			headers:{
			  'Content-Type':'text/xml; charset="utf-8"',
			  'Content-Length':payload.length
			},
			rejectUnauthorized: false,
			agent: false
		};
		
		tcpSocket = https.request(options, function(res) {
			res.on('data', function(data){
				cb(data);
			});
		});
		
		tcpSocket.write(payload);
	}
}
TCPConnected.prototype.SyncGateway = function(cb){
	var myuuid = uuid.v4();
	var username = myuuid;
	var password = myuuid;
	
	var gLogInCommand = util.format(LogInCommand,username,password);
	
	var payload = util.format(RequestString,'GWRLogin',encodeURIComponent(gLogInCommand));
	var options = {
		hostname: this._host,
		port: 443,
		path: '/gwr/gop.php',
		method: 'POST',
		headers:{
		  'Content-Type':'text/xml; charset="utf-8"',
		  'Content-Length':payload.length
		},
		rejectUnauthorized: false,
		agent: false
	};
	
	tcpSocket = https.request(options, function(res) {
		res.on('data', function(data){
			process.stdout.write(data);
			if(data == "<gip><version>1</version><rc>404</rc></gip>"){
				console.log("Permission Denied: Gateway Not In Sync Mode. Press Button on Gateway to Sync.");
				cb(1);
			}else{
				xml(data,function(error,result){	
					if(result['token'] != undefined){
						this._token = result['token'];
						nconf.use('file', { file: './config.json' });
						nconf.set('token', this._token);
						nconf.save(function (err) {
							if (err) {
								console.error(err.message);
								return;
							}
							console.log('Configuration saved successfully.');
						});
						cb(0);
					}
				});
			}
		});
	});
	
	tcpSocket.write(payload);
}
TCPConnected.prototype.LoadToken = function(cb){
	nconf.use('file', { file: './config.json' });
	nconf.load();
	if(nconf.get('token') != undefined){
		this._token = nconf.get('token');
		this._hasToken = 1;
		cb(0);
	}else{
		console.log("No Token Saved. Attempting to Connect With Gateway to Get Token.");
		console.log("Button On Gateway Must Be Pressed Prior to This.");
		this.SyncGateway(cb);
	}
}
TCPConnected.prototype.GetState = function (cb){
	var StateString = util.format(GetStateString,this._token);
	var payload = util.format(RequestString,'GWRBatch',encodeURIComponent(StateString));
		
	this.GWRequest(payload,function(data){
		//process.stdout.write(data);
		if(data == "<gip><version>1</version><rc>401</rc></gip>"){
			console.log("Permission Denied: Invalid Token");
		}else{
			xml(data,function(error,result){
				//console.log(result);
				if (error) {
					cb(1);
					return;
				}else{
					if(typeof(result["gip"]) !== 'undefined'){
						error = 1;
					}else{
						Rooms = result['gwrcmd']['gdata']['gip']['room'];
						if (typeof(Rooms["rid"]) !== 'undefined'){
							Rooms = [ Rooms ];
						}
					}
					cb(error||null,Rooms);
				}
			});
		}
	});
}
TCPConnected.prototype.TurnOnDevice = function (did, cb){
	
	var DeviceCommand = util.format(DeviceSendCommand,this._token,did,1);
	var payload = util.format(RequestString,'DeviceSendCommand',encodeURIComponent(DeviceCommand));

	this.GWRequest(payload,function(data){
		cb(0);
	});
}
TCPConnected.prototype.TurnOffDevice = function (did, cb){
	
	var DeviceCommand = util.format(DeviceSendCommand,this._token,did,0);
	var payload = util.format(RequestString,'DeviceSendCommand',encodeURIComponent(DeviceCommand));

	this.GWRequest(payload,function(data){
		cb(0);
	});
}
TCPConnected.prototype.SetDeviceLevel = function (did, level, cb){	
	var DeviceLevelCommand = util.format(DeviceSendLevelCommand,this._token,did,level);
	var payload = util.format(RequestString,'DeviceSendCommand',encodeURIComponent(DeviceLevelCommand));
	
	this.GWRequest(payload,function(data){
		cb(0);
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
	Rooms.forEach(function(room) {
		if(room["name"] == name){
			rid = room["rid"];
		}
	});
	return rid;
}
TCPConnected.prototype.TurnOnRoom = function (rid, cb){
	
	var RoomCommand = util.format(RoomSendCommand,this._token,rid,1);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomCommand));

	this.GWRequest(payload,function(data){
		cb(0);
	});
}
TCPConnected.prototype.TurnOnRoomByName = function (name, cb){
	rid = this.GetRIDByName(name);
	
	this.TurnOnRoom(rid,cb);
}

TCPConnected.prototype.TurnOnRoomWithLevelByName = function (name,level, cb){
	var self = this;
	rid = this.GetRIDByName(name);

	this.SetRoomLevel(rid,level,function(error){
		self.TurnOnRoom(rid,cb);
	});
}
TCPConnected.prototype.TurnOffRoom = function (rid, cb){
	var RoomCommand = util.format(RoomSendCommand,this._token,rid,0);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomCommand));

	this.GWRequest(payload,function(data){
		cb(0);
	});
	
}
TCPConnected.prototype.TurnOffRoomByName = function (name, cb){
	rid = this.GetRIDByName(name);
	
	this.TurnOffRoom(rid,cb);
}
TCPConnected.prototype.SetRoomLevel = function (rid, level, cb){	
	var RoomLevelCommand = util.format(RoomSendLevelCommand,this._token,rid,level);
	var payload = util.format(RequestString,'RoomSendCommand',encodeURIComponent(RoomLevelCommand));
	
	this.GWRequest(payload,function(data){
		cb(0);
	});
	
}
TCPConnected.prototype.SetRoomLevelByName = function (name, level, cb){
	rid = this.GetRIDByName(name);
	
	this.SetRoomLevel(rid,level,cb);
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