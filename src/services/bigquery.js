const {BigQuery} = require('@google-cloud/bigquery');
const {chartJsSchema} = require('../utils/chartjs-schema');
const {getDayStart, getWeekStart, getMonthStart, getToday} = require('../utils/datetime');
const bigquery = new BigQuery();

const tableName = 'state_devices_data.tabla1';

exports.dayQuery = async (device) => {
  const today = getToday();
  const yesterday = getDayStart();

  console.log(
    `[iOLED-API][BIGQUERY][dayQuery][Datetimes] Today: ${today}, Yesterday: ${yesterday}`
  );

  const query = `
    SELECT ROUND(AVG(humidity), 3) as avg_hum, ROUND(AVG(temp), 3) as avg_temp, CAST(timestamp as date) as date, CONCAT(FORMAT_TIMESTAMP("%H", timestamp), ':00') as time
    FROM ${tableName}
    WHERE deviceId='${device}' AND timestamp BETWEEN TIMESTAMP("${yesterday}") AND TIMESTAMP("${today}")
    GROUP BY time, date
    ORDER BY date, time asc;
  `;

  try {
    const [job] = await bigquery.createQueryJob({query});

    try {
      const [rows] = await job.getQueryResults();
      const response = chartJsSchema(rows);
      return response;
    } catch (errorRows) {
      console.log(
        '[iOLED-API][BIGQUERY][dayQuery][Error]: There was a problem getting the rows',
        errorRows
      );
      return null;
    }
  } catch (errorJob) {
    console.log(
      '[iOLED-API][BIGQUERY][dayQuery][Error]: There was a problem getting the query job',
      errorJob
    );
    return null;
  }
};

exports.weekQuery = async (device) => {
  const today = getToday();
  const lastWeek = getWeekStart();

  console.log(
    `[iOLED-API][BIGQUERY][weekQuery][Datetimes] Today: ${today}, Last Week: ${lastWeek}`
  );

  const query = `
    SELECT ROUND(AVG(humidity), 3) as avg_hum, ROUND(AVG(temp), 3) as avg_temp, CAST(timestamp as date) as date
    FROM ${tableName}
    WHERE deviceId="${device}" AND timestamp BETWEEN TIMESTAMP("${lastWeek}") AND TIMESTAMP("${today}")
    GROUP BY date
    ORDER BY date asc;
  `;

  try {
    const [job] = await bigquery.createQueryJob({query});

    try {
      const [rows] = await job.getQueryResults();
      const response = chartJsSchema(rows);
      return response;
    } catch (errorRows) {
      console.log(
        '[iOLED-API][BIGQUERY][weekQuery][Error]: There was a problem getting the rows',
        errorRows
      );
      return null;
    }
  } catch (errorJob) {
    console.log(
      '[iOLED-API][BIGQUERY][weekQuery][Error]: There was a problem getting the query job',
      errorJob
    );
    return null;
  }
};

exports.monthQuery = async (device) => {
  const today = getToday();
  const lastMonth = getMonthStart();

  console.log(
    `[iOLED-API][BIGQUERY][monthQuery][Datetimes] Today: ${today}, Last Month: ${lastMonth}`
  );

  const query = `
    SELECT ROUND(AVG(humidity), 3) as avg_hum, ROUND(AVG(temp), 3) as avg_temp, CAST(timestamp as date) as date
    FROM ${tableName}
    WHERE deviceId="${device}" AND timestamp BETWEEN TIMESTAMP("${lastMonth}") AND TIMESTAMP("${today}")
    GROUP BY date
    ORDER BY date asc;
  `;

  try {
    const [job] = await bigquery.createQueryJob({query});

    try {
      const [rows] = await job.getQueryResults();
      const response = chartJsSchema(rows);
      return response;
    } catch (errorRows) {
      console.log(
        '[iOLED-API][BIGQUERY][monthQuery][Error]: There was a problem getting the rows',
        errorRows
      );
      return null;
    }
  } catch (errorJob) {
    console.log(
      '[iOLED-API][BIGQUERY][monthQuery][Error]: There was a problem getting the query job',
      errorJob
    );
    return null;
  }
};
