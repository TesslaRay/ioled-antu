const _ = require("lodash");

const iot = require("@google-cloud/iot");
// const client = new iot.DeviceManagerClient();
const { google } = require("googleapis");
const googleConf = require("../config/google.js");

if (
  googleConf.iotCore.PROJECT_ID === undefined ||
  googleConf.iotCore.cloudRegion === undefined ||
  googleConf.iotCore.registryId === undefined
) {
  console.log(
    "[iOLED-API][Env Vars][Error]: The Google IoT Core config is not set"
  );
  process.exit(1);
}

const getClient = async () => {
  const authClient = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const discoveryUrl = `${googleConf.api.discovery}?version=${googleConf.api.version}`;

  google.options({
    auth: authClient,
  });

  try {
    return google.discoverAPI(discoveryUrl);
  } catch (err) {
    throw err;
  }
};

// exports.getRegistries = async () => {
//   const parent = client.locationPath(googleConf.iotCore.PROJECT_ID, googleConf.iotCore.cloudRegion);
//   try {
//     const [registries] = await client.listDeviceRegistries({
//       parent,
//     });
//     return registries.map((registry) => {
//       return registry.id;
//     });
//   } catch (err) {
//     throw err;
//   }
// };

exports.getDevices = async () => {
  const parentName = `projects/${googleConf.iotCore.PROJECT_ID}/locations/${googleConf.iotCore.cloudRegion}`;
  const registryName = `${parentName}/registries/${googleConf.iotCore.registryId}`;

  const request = {
    parent: registryName,
  };

  const google_api_client = await getClient();

  try {
    const {
      data,
    } = await google_api_client.projects.locations.registries.devices.list(
      request
    );
    return data.devices;
  } catch (err) {
    throw err;
  }
};

exports.getDeviceState = async (deviceId) => {
  const parentName = `projects/${googleConf.iotCore.PROJECT_ID}/locations/${googleConf.iotCore.cloudRegion}`;
  const registryName = `${parentName}/registries/${googleConf.iotCore.registryId}`;
  const request = {
    name: `${registryName}/devices/${deviceId}`,
  };

  const google_api_client = await getClient();

  try {
    const {
      data,
    } = await google_api_client.projects.locations.registries.devices.states.list(
      request
    );
    if (data.deviceStates) {
      return data.deviceStates.map((deviceState) => {
        const base64_text = deviceState.binaryData.toString("utf8");
        const buff = Buffer.from(base64_text, "base64");
        const data = JSON.parse(buff.toString("utf-8"));
        // Show the date and time corresponding to the timezone
        const datetime = new Date(deviceState.updateTime);
        data.datetime = datetime;
        return data;
      });
    } else {
      return {};
    }
  } catch (err) {
    throw err;
  }
};

/**
 * @CristianValdivia
 * Send the configuration to a IoT Core device.
 * @param {String} deviceId The id or name of the devices registered.
 * @param {string} config The configuration blob send to the device.
 * @example Configuration example
 * {
 *  "device": {
 *      "deviceId": "esp8266_16CB39",
 *      "config": {
 *        "board": {
 *          "led1": {
 *            "duty": 1,
 *            "state": true
 *          },
 *          "led2": {
 *            "duty": 1,
 *            "state": true
 *          },
 *          "timer": {
 *            "timerOn": "22:00",
 *            "timerOff": "10:00",
 *            "timerState": false
 *          }
 *        }
 *      }
 *    }
 *  }
 * @returns {Promise<number>} HTTP status code - 200, 429.
 */
exports.updateDeviceConfig = async (deviceId, config) => {
  const _config = _.pick(config, ["duty", "state"]);

  const _configTimer = _.pick(config, [
    "timerOn",
    "timerOff",
    "timerState",
    "timerDuty",
  ]);

  const _configRamp = _.pick(config, ["onTime", "offTime", "rampState"]);

  // Generate the board format for the device.
  const board = {
    board: {
      led1: _config,
      led2: _config,
      timer: _configTimer,
      ramp: _configRamp,
    },
  };
  // Convert config object to JSON.
  const data = JSON.stringify(board);

  // Convert data to base64
  const binaryData = Buffer.from(data).toString("base64");

  // Create request object
  const request = {
    name: `${googleConf.iotCore.registryName}/devices/${deviceId}`,
    versionToUpdate: googleConf.iotCore.version,
    binaryData: binaryData,
  };

  const google_api_client = await getClient();

  try {
    // Send the request to IoT core
    const data = await google_api_client.projects.locations.registries.devices.modifyCloudToDeviceConfig(
      request
    );
    // Return 200 on success update
    return data.status;
  } catch (err) {
    // return error
    throw err;
  }
};
