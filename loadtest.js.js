var TCPConnected = require('./index.js');

Test = new TCPConnected("192.168.1.137");


var fetchState = function() {
	console.log("Getting TCP Lights State");
	Test.GetState(function(error,system){
		system.forEach(function(room) { 
			Test.GetRoomStateByName(room["name"], function(error,state,level){
				console.log(room["name"] + " has state of " + state + " at level " + level);
			});
		});
		setTimeout(fetchState,1000);
	});
};
setTimeout(fetchState,500);