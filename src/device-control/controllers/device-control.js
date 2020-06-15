const googleService = require('../../services/gcp');

const {
  addDevice,
  setUserToDevice,
  getUser,
  getDevices,
  getAllDevicesWithUserInfo,
  getUserByDevice,
  updateDevice,
} = require('../../services/firestore');
/**
 * @DiegoSepulveda
 * Save a new device in the firestore database with default config
 * @description Save new device in the database
 * @param {{body: {user: string, deviceID: string}}} req Request.
 * @param {object} res Response
 */
exports.saveDevice = async (req, res) => {
  console.log('[iOLED-API][device][saveDevice][Request]'.red, req.body);
  const {user, deviceID, power} = req.body;

  const device = {
    alias: deviceID,
    duty: 1,
    state: true,
    timerOn: '00:00',
    timerOff: '00:00',
    timerState: false,
    user,
    deviceID,
    week: 1,
    power,
  };

  try {
    const ref = await addDevice(device);
    console.log('[iOLED-API][device][saveDevice][Response]'.red, {newDevice: deviceID.red});
    res.status(200).send({newDevice: ref.id});
  } catch (err) {
    console.log('[iOLED-API][device][saveDevice][Error]'.red, err);
    res.status(500).json(err);
  }
};

/**
 * Get the state of a IoT Core device.
 * @description List the last 10 states of device
 * @param {String} deviceId ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "deviceState": {
 *   "deviceStates": [
 *     {
 *       "data": {
 *         "hum": 39.917511,
 *         "temp": 30.660281
 *       },
 *       "datetime": "2020-01-30T14:35:39.750Z"
 *     },
 *     ...
 *   ]
 *  }
 * }
 */
exports.getDeviceState = async (req, res) => {
  const {id} = req.params;
  console.log(`[Device Control API][getDeviceState (${id})][Request] `, req.params);
  try {
    // Get device state
    const deviceState = await googleService.getDeviceState(id);
    console.log(`[Device Control API][getDeviceState (${id})][Response]  `, deviceState);
    res.status(200).json({data: deviceState});
  } catch (error) {
    console.log(`[Device Control API][getDeviceState (${id})][Error] `, error);
    // Send the error
    res.status(500).send({error});
  }
};

/**
 * Get the config of a IoT Core device.
 * @description List the last 10 configs of device
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "deviceConfig": [
 *   {
 *     "data": {
 *       "board": {
 *         "led1": {
 *           "duty": 0.35,
 *           "state": true
 *         },
 *         "led2": {
 *           "duty": 0.35,
 *           "state": true
 *         },
 *         "timer": {
 *           "timerOn": "08:00",
 *           "timerOff": "00:00",
 *           "timerState": true
 *         }
 *       }
 *     },
 *     "datetime": "03-01-2020 17:48:47"
 *   ]}
 * }
 */
exports.getDeviceConfig = async (req, res) => {
  const {id} = req.params;
  console.log(`[Device Control API][getDeviceConfig (${id})][Request] `, req.params);
  try {
    // Get the device config
    const deviceConfig = await googleService.getDeviceConfig(id);
    console.log(`[Device Control API][getDeviceConfig (${id})][Response] `, deviceConfig);
    res.status(200).json({data: deviceConfig});
  } catch (err) {
    console.log(`[Device Control API][getDeviceConfig (${id})][Error] `, err);
    // Send the error
    return res.status(500).json({err});
  }
};

/**
 * Update the configuration of a registered device.
 * @description Send the configuration to Google IoT Core.
 * @param {String} id - ID of the device listed in IoT Core
 * @example Request example:
 * {
 *	"device": {
 *		"deviceId": "esp8266_16CB39",
 *		"config": {
 *			"duty": 0.3,
 *			"state": true,
 *			"timerOn": "00:00",
 *			"timeOff": "12:00",
 *			"timerState": true
 *      "timerDuty": 0.5,
 * 			"rampState": true,
 * 			"onTime": 1,
 * 			"offTime": 0
 *		}
 *	}
 * }
 */
exports.updateDeviceConfig = async (req, res) => {
  // Get the deviceId and config from the request body.
  const {id} = req.params;
  console.log(`[Device Control API][updateDeviceConfig (${id})][Request] `, req.params);
  const {device} = req.body;
  const {config} = device;

  if (config === undefined) {
    console.log(`[Device Control API][updateDeviceConfig (${id})][Error]: Config undefined`);
    return res.sendStatus(500);
  }
  // Send the configuration to google IoT core.
  try {
    const status = await googleService.updateDeviceConfig(id, config);
    // If configuration is ok, then update the config in the database.
    // Do not confuse the updateDeviceConfig status with the status of this controller
    if (status !== 200) {
      return res.status(500).send('update IoT Core error');
    }

    try {
      await updateDeviceDB(id, config);
      console.log(`[Device Control API][updateDeviceConfig (${id})][Response] `, {
        message: 'Config updated',
      });
      return res.sendStatus(200);
    } catch (err) {
      console.log(`[Device Control API][updateDeviceConfig][Error] `, {error: err.message});
    }
  } catch (err) {
    console.log('[Device Control API][updateDeviceConfig (${id})][Error] ', err);
    // Send the error
    return res.status(500).send({err});
  }
};

/**
 * Get the last state of the device
 * @description Controller that returns a JSON object with the last state saved in IoT Core
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "data": {
 *    "hum": 43.541473,
 *    "temp": 30.703181
 *  },
 *  "datetime": "2020-01-30T14:42:23.790Z"
 * }
 */
exports.getDeviceLastState = async (req, res) => {
  const {id} = req.params;
  console.log(`[Device Control API][getDeviceLastState (${id})][Request]`, req.params, req.body);

  try {
    const deviceState = await googleService.getDeviceState(id);
    const deviceStateResponse = Object.keys(deviceState).length === 0 ? {} : deviceState[0];
    console.log(`[Device Control API][getDeviceLastState (${id})][Response]`, deviceStateResponse);
    res.status(200).json({data: deviceStateResponse});
  } catch (err) {
    console.log(`[Device Control API][getDeviceLastState (${id})][Error]`, err);
    // Send the error
    res.status(500).send({err});
  }
};

/**
 * Get the last config of the device
 * @description Controller that returns a JSON object with the last config saved in IoT Core
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "data": {
 *    "board": {
 *      "led1": {
 *        "duty": 1,
 *        "state": true
 *      },
 *      "led2": {
 *        "duty": 1,
 *        "state": true
 *       },
 *      "timer": {
 *        "timerOn": "11:00",
 *        "timerOff": "23:00",
 *        "timerState": true
 *      }
 *    }
 *  },
 *  "datetime": "2020-01-28T19:02:32.000Z"
 * }
 */
exports.getDeviceLastConfig = async (req, res) => {
  const {id} = req.params;
  console.log(`[Device Control API][getDeviceLastConfig (${id})][Request] `, req.params, req.body);
  // Using the same logic in the "getDeviceConfig" function
  try {
    const deviceConfig = await googleService.getDeviceConfig(id);
    console.log(`[Device Control API][getDeviceLastConfig (${id})][Response] `, deviceConfig[0]);
    res.status(200).json({data: deviceConfig[0]});
  } catch (err) {
    console.log(`[Device Control API][getDeviceLastConfig (${id})][Error] `, err);
    // Send the error
    return res.status(500).json({err});
  }
};

/**
 * @CristianValdivia
 * Update the configuration of all registered device in group.
 * @description Send the configuration to Google IoT Core.
 * @param {Array} list - Array of deviceId
 * @example Request example:
 * {
 *	"group": {
 *		"list": [
 *			"esp8266_D5AFEF",
 *      "esp8266_D5AFEF
 * 		],
 *		"config": {
 *			"duty": 0.3,
 *			"state": true,
 *			"timerOn": "00:00",
 *			"timeOff": "12:00",
 *			"timerState": true
 *      "timerDuty": 0.5,
 * 			"rampState": true,
 * 			"onTime": 1,
 * 			"offTime": 0
 *		}
 *	}
 * }
 */
exports.updateGroupConfig = async (req, res) => {
  console.log('[Device Control API][updateGroupConfig ][Request] ', req.body);

  // Get the list of deviceId and config from the request body.
  const {group} = req.body;
  const {config} = group;
  const {list} = group;

  if (config === undefined) {
    console.log('[Device Control API][updateDeviceConfig][Error]: Config Undefined');
    return res.status(500);
  }

  const ids = list.reduce((arr, id) => {
    arr.push(promiseUpdateDevice(id, config));
    return arr;
  }, []);

  try {
    await Promise.all(ids);
  } catch (err) {
    console.log('[Device Control API][updateGroupConfig ][error] ', err);
    return res.status(500);
  }

  return res.json({message: 'Config group updated'});
};

const promiseUpdateDevice = (deviceId, config) => {
  return new Promise((resolve, reject) => {
    googleService
      .updateDeviceConfig(deviceId, config)
      .then((status) => {
        if (status !== 200) {
          throw new Error(`invalid status=${status}`);
        }

        return updateDeviceDB(deviceId, config);
      })
      .then(() => {
        console.log(`[Device Control API][updateDeviceConfig (${deviceId})][Response] `, {
          message: 'Config updated',
        });
        resolve();
      })
      .catch((err) => {
        console.log(`[Device Control API][updateDeviceConfig (${deviceId})][Error] `, err);
        reject(err);
      });
  });
};

/**
 * @CristianValdivia
 * Get the last state of all registered device in group.
 * @description Get the last state from Google IoT Core.
 * @param {String} id - ID of group
 * @example Request example:
 * {
 *	"group": {
 *		"list": [
 *			"esp8266_D5AFEF",
 *      "esp8266_D5AFEF
 * 		],
 *		"config": {
 *			"duty": 0.3,
 *			"state": true,
 *			"timerOn": "00:00",
 *			"timeOff": "12:00",
 *			"timerState": true
 *      "timerDuty": 0.5,
 * 			"rampState": true,
 * 			"onTime": 1,
 * 			"offTime": 0
 *		}
 *	}
 * }
 */
exports.getGroupLastState = async (req, res) => {
  console.log('[Device Control API][getGroupLastState ][Request] ', req.body);

  // Get the list of deviceID from body
  const {group} = req.body;
  const {list} = group;

  const ids = list.reduce((arr, id) => {
    arr.push(promiseGetState(id));
    return arr;
  }, []);

  let arrayState = [];
  try {
    arrayState = await Promise.all(ids);
  } catch (err) {
    console.log('[Device Control API][getGroupLastState ][error] ', err);
    return res.status(500);
  }

  const averageHum =
    arrayState.reduce((sum, id) => {
      return sum + parseFloat(id.hum);
    }, 0) / arrayState.length;

  const averageTemp =
    arrayState.reduce((sum, id) => {
      return sum + parseFloat(id.temp);
    }, 0) / arrayState.length;

  console.log('[Device Control API][getGroupLastState ][Response] ', averageHum, averageTemp);
  res.status(200).json({data: {averageHum, averageTemp}});
};

const promiseGetState = (deviceId) => {
  return new Promise((resolve, reject) => {
    googleService
      .getDeviceState(deviceId)
      .then((deviceState) => {
        const deviceStateResponse = Object.keys(deviceState).length === 0 ? {} : deviceState[0];
        resolve(deviceStateResponse);
      })
      .catch((err) => {
        console.log(`[Device Control API][promiseGetState (${deviceId})][Error] `, err);
        reject(err);
      });
  });
};
