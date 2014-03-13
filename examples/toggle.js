var TCPConnected = require('../index.js');

Test = new TCPConnected("192.168.1.137");

Test.GetState(function(error,system){
	Test.TurnOffRoomByName("Living Room", function(error){
		console.log("Success");
	});
	setTimeout(Test.TurnOnRoomByName("Living Room", function(error){
		console.log("Success");
	}), 3000);
});
