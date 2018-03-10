Connected by TCP Node.js Control
=================================
 
[![PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NKVWX2AJRLDT2)

Version 0.0.8

Small changes to pass ESLint recommended
Added alternate version of index.js (index-alt.js) with additional functionality:

* GetDeviceState
* GetDeviceStateByName
* GetDIDByName
* TurnOnDeviceByName
* TurnOffDeviceByName
* SetDeviceLevelByName
* TurnOnDeviceWithLevel
* TurnOnDeviceWithLevelByName
* GetRoomState
* TurnOnRoomWithLevel
* ReturnRoomsArray

Added OutputIDs.js which allows you to query the gateway for light and group and room ids
Added LightControl.js which allows you to send Light commands
Added RoomControl.js which allows you to send Room commands
Added SceneControl.js which allows you to send Scene commands

Version 0.0.7

Removed https dependency to fix npm install error.

Version 0.0.6:

First release to support the new protocol with the gateway.

This contains an example which will turn off and on the lights in a room based on the name of the room.

For more information see:

http://home.stockmopar.com

http://home.stockmopar.com/connected-by-tcp-unofficial-api

http://home.stockmopar.com/updated-connected-by-tcp-api/

You can now install using npm package manager using the following command:
```sh
npm install connectedbytcp
