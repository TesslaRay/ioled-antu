const {dayQuery, weekQuery, monthQuery} = require('../services/big-query');
/**
 * Returns the graph info for one day
 * @description Returns the information that was generated in the Big Query service and got parsed with the Chartjs Schema
 * @param {String} device ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * Response example:
 * {
 *  data:
 *    {
 *      // Chartjs-parsed Data
 *    }
 * }
 */
exports.getDayGraph = async (req, res) => {
  console.log('[getDayGraph][Request] ', req.params);
  const {device} = req.params;
  try {
    const response = await dayQuery(device);
    console.log('[getDayGraph][Response]', response);
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    console.log('[getDayGraph][Error]: There was a problem getting the response', error);
  }
};

/**
 * Returns the graph info for one week
 * @description Returns the information that was generated in the Big Query service and got parsed with the Chartjs Schema
 * @param {String} device ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * Response example:
 * {
 *  data:
 *    {
 *      // Chartjs-parsed Data
 *    }
 * }
 */
exports.getWeekGraph = async (req, res) => {
  console.log('[getWeekGraph][Request] ', req.params);
  const {device} = req.params;
  try {
    const response = await weekQuery(device);
    console.log('[getWeekGraph][Response]', response);
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    console.log('[getWeekGraph][Error]: There was a problem getting the response', error);
    res.status(500).json({error});
  }
};

/**
 * Returns the graph info for one month
 * @description Returns the information that was generated in the Big Query service and got parsed with the Chartjs Schema
 * @param {String} device ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * Response example:
 * {
 *  data:
 *    {
 *      // Chartjs-parsed Data
 *    }
 * }
 */
exports.getMonthGraph = async (req, res) => {
  console.log('[getMonthGraph][Request] ', req.params);
  const {device} = req.params;
  try {
    const response = await monthQuery(device);
    console.log('[getMonthGraph][Response]', response);
    res.status(200).json({
      data: response,
    });
  } catch (error) {
    console.log('[getMonthGraph][Error]: There was a problem getting the response', error);
    res.status(500).json({error});
  }
};
