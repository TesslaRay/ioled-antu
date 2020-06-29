const { getUser, getDevices } = require("../services/firestore");

/**
 * @CristianValdivia
 * Returns the current authenticated user.
 * @param {{user: object}} req googleID
 * @param {object} res Response.
 */
exports.currentUser = async (req, res) => {
  console.log("[iOLED-API][user][currentUser][Request] ", req.body);
  const { user } = req.body;
  const googleID = user;

  // If user is not authenticated, return null.
  if (!googleID) {
    console.log("[iOLED-API][user][currentUser][Error]", {
      error: "User not logged in",
    });
    res.status(500).json({ error: "User not logged in" });
  } else {
    try {
      // Search in the DB for the user.
      const { user: userInfo } = await getUser(googleID);

      console.log("[iOLED-API][user][currentUser][Response]", userInfo);
      res.status(200).send({ currentUser: userInfo });
    } catch (err) {
      console.log("[iOLED-API][user][currentUser][Error]", err);
      res.status(500).json(err);
    }
  }
};

/**
 * @CristianValdivia
 * List all the registered devices for the current user.
 * @description List the devices registered in the user database.
 * @param {{user: object}} req googleID
 * @param {object} res Response.
 */
exports.getDevices = async (req, res) => {
  console.log("[iOLED-API][user][getDevices][Request]"), req.body;
  const { user } = req.body;
  const googleID = user;

  // If user is not authenticated, return null.
  if (!googleID) {
    console.log("[iOLED-API][user][getDevices][Error]", {
      error: "User not logged in",
    });
    res.status(500).json({ error: "User not logged in" });
  } else {
    try {
      // Search in the DB for the devices.
      const devices = await getDevices(googleID);

      console.log("[iOLED-API][user][getDevices][Response]", devices);
      res.status(200).send({ userDevices: devices });
    } catch (error) {
      console.log("[iOLED-API][user][getDevices][Error]", error);
      res.status(500).json(error);
    }
  }
};

// /**
//  * @DiegoSepulveda
//  * Save a new device in the firestore database with default config
//  * @description Save new device in the database
//  * @param {{body: {user: string, deviceID: string}}} req Request.
//  * @param {object} res Response.
//  */
// exports.saveDevice = async (req, res) => {
//   console.log('[iOLED-API][user][saveDevice][Request]', req.params, req.body);
//   const {user, deviceID, power} = req.body;

//   const device = {
//     alias: deviceID,
//     duty: 1,
//     state: true,
//     timerOn: '00:00',
//     timerOff: '00:00',
//     timerState: false,
//     user,
//     deviceID,
//     week: 1,
//     power,
//   };

//   try {
//     const ref = await addDevice(device);
//     console.log('[iOLED-API][user][saveDevice][Response]', {newDevice: deviceID});
//     res.status(200).send({newDevice: ref.id});
//   } catch (error) {
//     console.log('[iOLED-API][user][saveDevice][Error]', error);
//     res.status(500).json(error);
//   }
// };

// /**
//  * Link a device to a user
//  * @description Set the devices' user property to the specified user
//  * @param {{params: {userId: string, deviceId: string}}} req Request.
//  * @param {object} res Response.
//  */
// exports.linkUserToDevice = async (req, res) => {
//   console.log('[iOLED-API][user][linkUserToDevice][Request]', req.params);
//   const {userId, deviceId} = req.params;

//   try {
//     const updatedDevice = await setUserToDevice(deviceId, userId);
//     console.log('[iOLED-API][user][linkUserToDevice][Response]', updatedDevice);
//     res.status(200).send({updatedDevice});
//   } catch (err) {
//     console.log('[iOLED-API][user][linkUserToDevice][Error]', err);
//     res.status(500).json(err);
//   }
// };

// /**
//  * @DiegoSepulveda
//  * List all the devices
//  * @description List the devices registered in Firestore database
//  * @returns {object} HTTP status code - 200, 500.
//  * @example Response example:
//  * {
//  *  "devices": [
//  *   {
//  *    "device": "esp32_...",
//  *    "user":
//  *      {"fullName": "...", "email": "...", "profilePic": "..."}
//  *   },
//  *   ...
//  *  ]
//  * }
//  */
// exports.getAllDevices = async (req, res) => {
//   console.log('[User-API][getAllDevices][Request]');
//   try {
//     const devices = await getAllDevicesWithUserInfo();

//     console.log('[User-API][getAllDevices][Response] ', devices);
//     res.status(200).json({data: devices});
//   } catch (error) {
//     console.log('[User-API][getAllDevices][Error] ', error);
//     res.status(500).json({error});
//   }
// };

// /**
//  * Get the user related to the device
//  * @description Controller that returns a JSON object with the user information of the device user
//  * @param {String} id - ID of the device listed in IoT Core
//  * @returns {object} HTTP status code - 200, 500.
//  * @example Response example:
//  * {
//  *  "user": {
//  *    "fullName": "John Doe",
//  *    "email": "johndoe@gmail.com",
//  *    "profilePic": "..."
//  *  }
//  * }
//  */

// exports.getUserByDevice = async (req, res) => {
//   const {id} = req.params;
//   console.log('[User-API][getUserByDevice (' + id + ')][Request] ', req.params);
//   try {
//     const user = await getUserByDevice(id);
//     console.log('[User-API][getUserByDevice (' + id + ')][Response] ', user);
//     res.status(200).json({data: user});
//   } catch (error) {
//     console.log('[User-API][getUserByDevice (' + id + ')][Error] ', error);
//     return res.status(500).json({error});
//   }
// };

// /**
//  * Update the configuration of a registered device.
//  * @description Update the configuration in Firestore database
//  * @param {String} id - ID of the device listed in IoT Core
//  * @example Request example:
//  * {
//  *	"device": {
//  *		"deviceId": "esp8266_16CB39",
//  *		"config": {
//  *			"alias": casa
//  *		}
//  *	}
//  * }
//  */
// exports.updateDeviceConfig = async (req, res) => {
//   // Get the deviceId and config from the request body.
//   const id = req.body.deviceId;
//   const config = req.body.config;

//   console.log('[User API][updateDeviceConfig (' + id + ')][Request] ', req.params);

//   if (config === undefined) {
//     console.log('[Device Control API][updateDeviceConfig (' + id + ')][Error]: Config Undefined');
//     return res.status(500);
//   }
//   try {
//     await updateDevice(id, config);
//     console.log('[User API][updateDeviceConfig (' + id + ')][Response] ', {
//       message: 'Config updated',
//     });
//     return res.status(200).send({data: config});
//   } catch (error) {
//     console.log('[User][updateDeviceConfig (' + id + ')][Error] ', error);
//     // Send the error
//     return res.status(500).json({error});
//   }
// };
