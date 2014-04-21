// This example will set the level for a room and if it was off turn it on.

var TCPConnected = require('./index.js');

Test = new TCPConnected("192.168.1.137");

Test.GetState(function(error,system){
	room = "Basement";
	Test.GetRoomStateByName(room, function(error,state,level){
		console.log("State: " + state + " at Level: " + level);
	});
	Test.SetRoomLevelByName(room, 50);
	if(state == 0){
		Test.TurnOnRoomByName(room);
	}
	Test.GetRoomHueByName(room, function(error,hue){
		console.log("Hue: " + hue);
	});
});

