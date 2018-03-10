/*
DESCRIPTION:
This file uses an alternate version of stockmopar's index.js file, called index-alt.js, which has additional functions
This File is still a work in progress
Purpose: Enable control of custom scenes via command line

Abilities: 
  
Command line examples:
  turn on scene
    node ControlScene.js -a on -r 1 -d -l
  turn off scene
    node ControlScene.js -a off -r 1 -d -l
  set room to level
  set lights to level
    node ControlScene.js -a level -d -r "{\"rooms\": [{\"id\":\"6\",\"level\":20},{\"id\":\"2\",\"level\":10}]}" -l "{\"lights\": [{\"id\":\"216799804394159703\",\"level\":30},{\"id\":\"216799804394160404\",\"level\":40}]}"
*/

var TCPConnected = require("./index-alt.js");
var ControlScene = new TCPConnected("192.168.3.50");

/* VARIABLES */
var sceneName = "";
var roomIDs = "";
var lightIDs = "";
var action = "";
var debugPrint = false;

/* PROCESS ARGUMENTS */
if (process.argv.indexOf("-sn") != -1) {
  sceneName = process.argv[process.argv.indexOf("-sn") + 1].toLowerCase();
}
if (process.argv.indexOf("-r") != -1) {
  roomIDs = process.argv[process.argv.indexOf("-r") + 1];
}
if (process.argv.indexOf("-l") != -1) {
  lightIDs = process.argv[process.argv.indexOf("-l") + 1];
}
if (process.argv.indexOf("-a") != -1) {
  action = process.argv[process.argv.indexOf("-a") + 1].toLowerCase();
}
if (process.argv.indexOf("-d") != -1) {
  debugPrint = true;
}

if (debugPrint) {
  console.log("sceneName: " + sceneName);
  console.log("roomIDs: " + roomIDs);
  console.log("lightIDs: " + lightIDs);
  console.log("action: " + action);
}

/* PRIMARY CONTROL CODE */
ControlScene.Init(function (error) {
  if (!error) {
    var tRooms = [];
    ControlScene.GetState(function (error, system) {
      if (sceneName != "") {
        if (sceneName == "off") {
          if (debugPrint) console.log("sceneName: off");
          ControlScene.ReturnRoomsArray(function (error, tR) {
            tRooms = tR;
            tRooms.forEach(function (room) {
              ControlScene.TurnOffRoom(room.rid, function (error) {});
            });
            ControlScene.GWEnd();
          });
        } else if (sceneName == "on") {
          if (debugPrint) console.log("sceneName: on");
          ControlScene.ReturnRoomsArray(function (error, tR) {
            tRooms = tR;
            tRooms.forEach(function (room) {
              ControlScene.TurnOnRoomWithLevel(room.rid, 100, function (error) {});
            });
            ControlScene.GWEnd();
          });
        } else if (sceneName == "morning") {
          if (debugPrint) console.log("sceneName: morning");
          ControlScene.TurnOnDeviceWithLevel("216799804394159703", 50, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394160404",100,function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394534162", 25, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394724881",100,function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394741118", 25, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394063781",100,function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394740698", 60, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394784583",100,function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394788206", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394202507", 40, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394361402", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804398230062", 30, function (error) {});
          ControlScene.GWEnd();
        } else if (sceneName == "evening") {
          if (debugPrint) console.log("sceneName: evening");
          ControlScene.TurnOffRoom(1, function (error) {});
          ControlScene.TurnOffRoom(2, function (error) {});
          ControlScene.TurnOffRoom(6, function (error) {});
          ControlScene.TurnOffRoom(7, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394063781", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394740698", 25, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394784583", 35, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394534162", 35, function (error) {});
          ControlScene.GWEnd();
        } else if (sceneName == "weekdayhome") {
          if (debugPrint) console.log("sceneName: weekdayhome");
          ControlScene.TurnOnRoomWithLevel(4, 100, function (error) {});
          ControlScene.TurnOnRoomWithLevel(6, 60, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394159703",100,function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394160404", 25, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394534162", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394724881", 50, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394741118", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804398230062",100,function (error) {});
          ControlScene.GWEnd();
        } else if (sceneName == "intimacy") {
          if (debugPrint) console.log("sceneName: intimacy");
          ControlScene.TurnOffRoom(6, function (error) {});
          ControlScene.TurnOffRoom(7, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394159703", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394160404", 25, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394534162", 40, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394724881", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394741118", 40, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394063781", 60, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394740698", 60, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394784583", 40, function (error) {});
          ControlScene.GWEnd();
        } else if (sceneName == "bedtime") {
          if (debugPrint) console.log("sceneName: bedtime");
          ControlScene.TurnOffRoom(1, function (error) {});
          ControlScene.TurnOffRoom(2, function (error) {});
          ControlScene.TurnOffRoom(6, function (error) {});
          ControlScene.TurnOffRoom(7, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394063781", 0, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394740698", 25, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394784583", 10, function (error) {});
          ControlScene.GWEnd();
        } else if (sceneName == "movienight") {
          if (debugPrint) console.log("sceneName: movienight");
          ControlScene.TurnOffRoom(1, function (error) {});
          ControlScene.TurnOffRoom(2, function (error) {});
          ControlScene.TurnOffRoom(6, function (error) {});
          ControlScene.TurnOffRoom(7, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394063781", 50, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394740698", 30, function (error) {});
          ControlScene.TurnOnDeviceWithLevel("216799804394784583", 0, function (error) {});
          ControlScene.GWEnd();
        }
      } else if (action == "state") {
        // TODO: implement in the future
      } else if (action == "toggle") {
        // TODO: implement in the future
      } else if (action == "on") {
        //Turn On Scene
        if (debugPrint) console.log("Action: on");
        ControlScene.ReturnRoomsArray(function (error, tR) {
          tRooms = tR;
          tRooms.forEach(function (room) {
            if (debugPrint) console.log("roomid: " + room.rid);
            ControlScene.TurnOnRoom(room.rid, function (error) {});
          });
          ControlScene.GWEnd();
        });
      } else if (action == "off") {
        //Turn Off Scene
        if (debugPrint) console.log("Action: off");
        ControlScene.ReturnRoomsArray(function (error, tR) {
          tRooms = tR;
          tRooms.forEach(function (room) {
            if (debugPrint) console.log("roomid: " + room.rid);
            ControlScene.TurnOffRoom(room.rid, function (error) {});
          });
          ControlScene.GWEnd();
        });
      } else if (action == "level") {
        ControlScene.ReturnRoomsArray(function (error, tR) {
          if (lightIDs != "") {
            lightIDs = lightIDs
              .replace(/\"/g, "")
              .replace(/Z/g, "")
              .replace(/Y/g, '"');
            console.log(lightIDs);
            lightIDs = JSON.parse(lightIDs);
            if (debugPrint) console.log("Action: light level");
            for (var i = 0; i < lightIDs.lights.length; i++) {
              ControlScene.TurnOnDeviceWithLevel(
                lightIDs.lights[i].id,
                parseInt(lightIDs.lights[i].level),
                function (error) {}
              );

              if (debugPrint) {
                console.log("id: " + lightIDs.lights[i].id);
                console.log("level: " + lightIDs.lights[i].level);
              }
            }
            ControlScene.GWEnd();
          }

          if (roomIDs != "") {
            console.log(roomIDs);
            roomIDs = roomIDs
              .replace(/\"/g, "")
              .replace(/Z/g, "")
              .replace(/Y/g, '"');
            console.log(roomIDs);
            roomIDs = JSON.parse(roomIDs);
            if (debugPrint) console.log("Action: room level");
            for (var k = 0; k < roomIDs.rooms.length; k++) {
              ControlScene.TurnOnRoomWithLevel(
                parseInt(roomIDs.rooms[k].id),
                parseInt(roomIDs.rooms[k].level),
                function (error) {}
              );

              if (debugPrint) {
                console.log("id: " + roomIDs.rooms[k].id);
                console.log("level: " + roomIDs.rooms[k].level);
              }
            }
            ControlScene.GWEnd();
          }
        });
      }
    });
  } else {
    console.log("There was an issue initializing the token");
    if (debugPrint) console.log(error.message);
  }
});

/*
My Personal light IDs and Values for testing
  216799804394159703	Floor Lamp
  216799804394160404	Table Lmap
  216799804394534162	Nightstand Left
  216799804394724881	Ceiling fan --> moved to kitchen back
  216799804394741118	Nightstand right
  216799804394063781	Upstairs Hall
  216799804394740698	Back Kitcher --> BROKEN
  216799804394784583	Hall main floor
  216799804394788206	Office
  216799804394202507	Playroom Front
  216799804394361402	Playroom Back
  216799804398230062	Katelyn
  1 = living room
  2 = master bedroom
  4 = hall and kitchen
  6 = attic
  7 = kids rooms
*/