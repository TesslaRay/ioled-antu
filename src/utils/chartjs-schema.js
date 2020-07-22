const moment = require('moment');
/**
 * Return ChartJs Schema
 * @description Gets Humidity and temperature in the required form (with different labels for days and hours queries).
 * @param {object} Big Query Rows
 * @returns {object} ChartJs-ready schema
 * Schema:
 * {
 *  "humidity": {
 *    "labels": [
 *      "2/1/2020", // This could be either a date or one hour
 *      "3/1/2020",
 *      ...
 *    ],
 *    "datasets": [
 *      {
 *        "label": "",
 *        "fill": false,
 *        "data": [
 *          38.18841295859169,
 *          35.99579190270165,
 *          ...
 *        ]
 *      }
 *    ]
 *  },
 *  "temperature": {
 *    "labels": [
 *      "2/1/2020",
 *      "3/1/2020",
 *      ...
 *    ],
 *    "datasets": [
 *      {
 *        "label": "",
 *        "fill": false,
 *        "data": [
 *          35.24451528450707,
 *          34.982915593784256,
 *          ...
 *        ]
 *      }
 *    ]
 *  }
 *}
 */
exports.chartJsSchema = (rows) => {
  const response = {
    humidity: {
      labels: [],
      datasets: [],
    },
    temperature: {
      labels: [],
      datasets: [],
    },
  };

  const dataset = {
    humidity: {
      label: '',
      data: [],
    },
    temperature: {
      label: '',
      data: [],
    },
  };

  rows.forEach((row) => {
    let date;
    if (row.time) {
      date = new Date(`${row.date.value} ${row.time} UTC`);
      const timeCorrected = date
        .toLocaleTimeString('es-ES', {timeZone: 'America/Santiago'})
        .split(':');
      response.humidity.labels.push(`${timeCorrected[0]}:${timeCorrected[1]}`);
      response.temperature.labels.push(`${timeCorrected[0]}:${timeCorrected[1]}`);
    } else {
      const momentDate = moment(row.date.value);
      date = new Date(`${row.date.value}`); // Useless
      response.humidity.labels.push(momentDate.locale('es').format('DD-MM'));
      response.temperature.labels.push(momentDate.locale('es').format('DD-MM'));
    }
    dataset.humidity.data.push(row.avg_hum);
    dataset.humidity.label = 'Humedad (%)';
    dataset.temperature.label = 'Temperatura (°C)';
    dataset.temperature.data.push(row.avg_temp);
  });

  response.humidity.datasets.push(dataset.humidity);
  response.temperature.datasets.push(dataset.temperature);

  return response;
};
