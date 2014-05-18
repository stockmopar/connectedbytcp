var TCPConnected = require('./index.js');

Test = new TCPConnected("192.168.1.137");

Test.GetState(function(error,system){
	room = "Front Porch";
	Test.GetRoomStateByName(room, function(error,state,level){
		console.log("State: " + state + " at Level: " + level);
	});
	if(state == 1){
		Test.TurnOffRoomByName(room, function(error,timeForRequest){
			console.log(error + " : " + timeForRequest);
		});
	}else{
		Test.TurnOnRoomByName(room, function(error,timeForRequest){
			console.log(error + " : " + timeForRequest);
		});
	}
});

