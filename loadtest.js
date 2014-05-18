var TCPConnected = require('./index.js');

Test = new TCPConnected("192.168.1.137");

if(1){
	// NUMBER OF CYCLES
	ccycles = 100;
	j = 0;
	ctotal = 0;
	Test.GetState(function(error,system){
		room = "Bathroom";
		Test.GetRoomStateByName(room, function(error,state,level){
			console.log("State: " + state + " at Level: " + level);
		});
		
		var cfetchState = function() {
			if(state == 1){
				Test.TurnOffRoomByName(room, function(error,timeForRequest){
					console.log("[TOG" + j + "] " + error + " : " + timeForRequest);
					ctotal += timeForRequest;
					state = 0;
					if(j<ccycles) setTimeout(cfetchState,1);
					else console.log(ctotal/j);
				});
			}else{
				Test.TurnOnRoomByName(room, function(error,timeForRequest){
					console.log("[TOG" + j + "] " + error + " : " + timeForRequest);
					ctotal += timeForRequest;
					state = 1;
					if(j<ccycles) setTimeout(cfetchState,1);
					else console.log(ctotal/j);
				});
			}
			j++;
			//console.log(i);
		};
		
		setTimeout(cfetchState,1);
	});
}

if(1){
	// NUMBER OF CYCLES
	cycles = 100;
	i = 0;
	total = 0;
	var fetchState = function() {
		Test.GetState(function(error,system,timeForRequest){
			console.log("[GS " + i + "] " + timeForRequest);
			
			//console.log(system);
			
			total += timeForRequest;
			i++;
			if(i<cycles) setTimeout(fetchState,1);
			else console.log(total/i);
		});
	};
	setTimeout(fetchState,1);
}


/*
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
*/