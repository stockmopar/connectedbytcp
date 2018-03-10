/*
DESCRIPTION:
This file uses an alternate version of stockmopar's index.js file, called index-alt.js, which has additional functions
This File is still a work in progress
Purpose: Enable control of rooms via command line

Abilities: 
  State: by name or rid
  Toggle: by name or rid
  ON: by name or rid
  OFF: by name or rid
  ON: by name or rid
  ON with light level: by name or rid

Command line examples:
  get room state
    node ControlRoom.js -a "state" -rn "Living Room" -d
    node ControlRoom.js -a "state" -r 1 -d
  turn on room
    node ControlRoom.js -a "toggle" -rn "Living Room" -d
    node ControlRoom.js -a "toggle" -r 1 -d
  turn on room
    node ControlRoom.js -a "on" -rn "Living Room" -d
    node ControlRoom.js -a "on" -r 1 -d
  turn off room
    node ControlRoom.js -a "off" -rn "Living Room" -d
    node ControlRoom.js -a "off" -r 1 -d
  set room to level
    node ControlRoom.js -a "level" -rn "Living Room" -rl 75 -d
    node ControlRoom.js -a "level" -r 1 -rl 75 -d
*/

var helpText = '\n\nSCRIPT: ControlRoom.js\n\n';
helpText += 'Usage: node ControlRoom.js [FLAG + VALUE]... [FLAG]...\n\n';

helpText += 'DESCRIPTION:\n';
helpText += 'This file uses an alternate version of stockmopar\'s index.js file, called index - alt.js, which has additional functions\n';
helpText += 'This File is still a work in progress\n';
helpText += 'Purpose: Enable control of rooms via command line\n\n';

helpText += 'Abilities:\n';
helpText += '  State: by name or rid\n';
helpText += '  Toggle: by name or rid\n';
helpText += '  ON: by name or rid\n';
helpText += '  OFF: by name or rid\n';
helpText += '  ON: by name or rid\n';
helpText += '  ON with light level: by name or rid\n\n';

helpText += 'Command line examples:\n';
helpText += '  get room state\n';
helpText += '    node ControlRoom.js -a "state" -rn "Living Room" -d\n';
helpText += '    node ControlRoom.js -a "state" -r 1 -d\n';
helpText += '  turn on room\n';
helpText += '    node ControlRoom.js -a "toggle" -rn "Living Room" -d\n';
helpText += '    node ControlRoom.js -a "toggle" -r 1 -d\n';
helpText += '  turn on room\n';
helpText += '    node ControlRoom.js -a "on" -rn "Living Room" -d\n';
helpText += '    node ControlRoom.js -a "on" -r 1 -d\n';
helpText += '  turn off room\n';
helpText += '    node ControlRoom.js -a "off" -rn "Living Room" -d\n';
helpText += '    node ControlRoom.js -a "off" -r 1 -d\n';
helpText += '  set room to level\n';
helpText += '    node ControlRoom.js -a "level" -rn "Living Room" -rl 75 -d\n';
helpText += '    node ControlRoom.js -a "level" -r 1 -rl 75 -d\n\n';

var TCPConnected = require("./index-alt.js");
var ControlRoom = new TCPConnected("192.168.3.50");

/* VARIABLES */
var roomName = "";
var roomID = -1;
var roomState = "";
var roomLevel = -1;
var action = "";
var debugPrint = false;
var helpPrint = false;
var outS = "";

/* PROCESS ARGUMENTS */
// Output the help documentation for this file
if (process.argv.indexOf('--help') != -1) {
  helpPrint = true;
}
if (process.argv.indexOf("-rn") != -1) {
  roomName = process.argv[process.argv.indexOf("-rn") + 1];
}
if (process.argv.indexOf("-r") != -1) {
  roomID = process.argv[process.argv.indexOf("-r") + 1];
}
if (process.argv.indexOf("-rs") != -1) {
  roomState = process.argv[process.argv.indexOf("-rs") + 1];
}
if (process.argv.indexOf("-rl") != -1) {
  roomLevel = process.argv[process.argv.indexOf("-rl") + 1];
}
if (process.argv.indexOf("-a") != -1) {
  action = process.argv[process.argv.indexOf("-a") + 1].toLowerCase();
}
if (process.argv.indexOf("-d") != -1) {
  debugPrint = true;
}
if (debugPrint) {
  outS = "COMMAND LINE ARGUMENTS\n";
  outS += "\t" + "roomName: " + roomName + "\n";
  outS += "\t" + "roomID: " + roomID + "\n";
  outS += "\t" + "roomState: " + roomState + "\n";
  outS += "\t" + "roomLevel: " + roomLevel + "\n";
  outS += "\t" + "action: " + action + "\n";
  outS += "\t" + "debugPrint: " + debugPrint + "\n";
  outS += "\n";
  console.log(outS);
}

if (helpPrint) {
  console.log(helpText);
} else {
  /* PRIMARY CONTROL CODE */
  ControlRoom.Init(function(error) {
    if (!error) {
      ControlRoom.GetState(function(error, system) {
        if (action == "state") {
          //Get room State
          if (roomID != -1) {
            //process by ID
            ControlRoom.GetRoomState(roomID, function(error, state, level) {
              if (debugPrint)
                console.log("State: " + state + " at Level: " + level);
              if (state == 1) console.log("ON," + level);
              else console.log("OFF," + level);
              ControlRoom.GWEnd();
            });
          } else if (roomName != "") {
            //process by Name
            ControlRoom.GetRoomStateByName(roomName, function(
              error,
              state,
              level
            ) {
              if (debugPrint)
                console.log("State: " + state + " at Level: " + level);
              if (state == 1) console.log("ON," + level);
              else console.log("OFF," + level);
              ControlRoom.GWEnd();
            });
          }
        } else if (action == "toggle") {
          //Turn On Room
          if (roomID != -1) {
            //process by ID
            ControlRoom.GetRoomState(roomID, function(error, state, level) {
              if (debugPrint)
                console.log("State: " + state + " at Level: " + level);
              if (state == 1) {
                ControlRoom.TurnOffRoom(roomID, function(error) {
                  ControlRoom.GWEnd();
                });
              } else {
                ControlRoom.TurnOnRoom(roomID, function(error) {
                  ControlRoom.GWEnd();
                });
              }
            });
          } else if (roomName != "") {
            //process by Name
            ControlRoom.GetRoomStateByName(roomName, function(
              error,
              state,
              level
            ) {
              if (debugPrint)
                console.log("State: " + state + " at Level: " + level);
              if (state == 1) {
                ControlRoom.TurnOffRoomByName(roomName, function(error) {
                  ControlRoom.GWEnd();
                });
              } else {
                ControlRoom.TurnOnRoomByName(roomName, function(error) {
                  ControlRoom.GWEnd();
                });
              }
            });
          }
        } else if (action == "on") {
          //Turn On Room
          if (roomID != -1) {
            //process by ID
            ControlRoom.TurnOnRoom(roomID, function(error) {
              ControlRoom.GWEnd();
            });
          } else if (roomName != "") {
            //process by Name
            ControlRoom.TurnOnRoomByName(roomName, function(error) {
              ControlRoom.GWEnd();
            });
          }
        } else if (action == "off") {
          //Turn Off Room
          if (roomID != -1) {
            //process by ID
            ControlRoom.TurnOffRoom(roomID, function(error) {
              ControlRoom.GWEnd();
            });
          } else if (roomName != "") {
            //process by Name
            ControlRoom.TurnOffRoomByName(roomName, function(error) {
              ControlRoom.GWEnd();
            });
          }
        } else if (action == "level") {
          //Set Room to Level
          if (roomID != -1) {
            //process by ID
            ControlRoom.GetRoomState(roomID, function(error, state, level) {
              if (debugPrint)
                console.log("State: " + state + " at Level: " + level);
              if (state == 1) {
                ControlRoom.SetRoomLevel(roomID, roomLevel, function(error) {
                  ControlRoom.GWEnd();
                });
              } else {
                ControlRoom.TurnOnRoomWithLevel(roomID, roomLevel, function(
                  error
                ) {
                  ControlRoom.GWEnd();
                });
              }
            });
          } else if (roomName != "") {
            //process by Name
            ControlRoom.GetRoomStateByName(roomName, function(
              error,
              state,
              level
            ) {
              if (debugPrint)
                console.log("State: " + state + " at Level: " + level);
              if (state == 1) {
                ControlRoom.SetRoomLevelByName(roomName, roomLevel, function(
                  error
                ) {
                  ControlRoom.GWEnd();
                });
              } else {
                ControlRoom.TurnOnRoomWithLevelByName(
                  roomName,
                  roomLevel,
                  function(error) {
                    ControlRoom.GWEnd();
                  }
                );
              }
            });
          }
        }
      });
    } else {
      console.log("There was an issue initializing the token");
      if (debugPrint) console.log(error.message);
    }
  });
}