var TCPConnected = require('./index.js');

Test = new TCPConnected("10.0.1.3");

Test.GetState(function(error,system){
	room = "Bedroom";
	Test.GetRoomStateByName(room, function(error,state,level){
		console.log("State: " + state + " at Level: " + level);
	});
	if(state == 1){
		Test.TurnOffRoomByName(room);
	}else{
		Test.TurnOnRoomByName(room);
	}
});

