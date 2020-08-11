const googleService = require('../services/iot_core');

const {updateDeviceDB} = require('../services/firestore');

/**
 * @author DiegoSepulveda
 * Get the state of a IoT Core device
 * @description List the last 10 states of device
 * @param {String} deviceId ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 */
exports.getDeviceState = async (req, res) => {
  const {id} = req.params;
  console.log(`[Device Control API][getDeviceState (${id})][Request] `, req.params);
  try {
    // Get device state
    const deviceState = await googleService.getDeviceState(id);
    console.log(`[Device Control API][getDeviceState (${id})][Response]  `, deviceState);
    res.status(200).json({data: deviceState});
  } catch (err) {
    console.log(`[Device Control API][getDeviceState (${id})][Error] `, err);
    // Send the error
    res.status(500).send({err});
  }
};

/**
 * @author DiegoSepulveda
 * Get the last state of the device
 * @description Controller that returns a JSON object with the last state saved in IoT Core
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 */
exports.getDeviceLastState = async (req, res) => {
  const {id} = req.params;
  console.log(`[Device Control API][getDeviceLastState (${id})][Request]`, req.params, req.body);

  try {
    const deviceState = await googleService.getDeviceState(id);
    const deviceStateResponse = Object.keys(deviceState).length === 0 ? {} : deviceState[0];
    console.log(`[Device Control API][getDeviceLastState (${id})][Response]`, deviceStateResponse);
    res.status(200).json({deviceState: deviceStateResponse});
  } catch (err) {
    console.log(`[Device Control API][getDeviceLastState (${id})][Error]`, err);
    // Send the error
    res.status(500).send({err});
  }
};

/**
 * @author CristianValdivia
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
      console.log(`[Device Control API][updateDeviceConfig][Error] `, {
        error: err.message,
      });
    }
  } catch (err) {
    console.log('[Device Control API][updateDeviceConfig (${id})][Error] ', err);
    // Send the error
    return res.status(500).send({err});
  }
};

// TODO: Add Group control
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
