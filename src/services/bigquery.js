const {BigQuery} = require('@google-cloud/bigquery');
const {chartJsSchema} = require('../utils/chartjs-schema');
const {getDayStart, getWeekStart, getMonthStart, getToday} = require('../utils/datetime');
const bigquery = new BigQuery();

const tableName = process.env.tableName;

if (tableName === undefined) {
  console.log('[Big Query][Env Vars][Error]: There is no tableName in ENV vars');
  process.exit(1);
}

exports.dayQuery = async (device) => {
  const today = getToday();
  const yesterday = getDayStart();

  console.log(`[dayQuery][Datetimes] Today: ${today}, Yesterday: ${yesterday}`);

  const query = `
    SELECT ROUND(AVG(humidity), 3) as avg_hum, ROUND(AVG(temp), 3) as avg_temp, CAST(timestamp as date) as date, CONCAT(FORMAT_TIMESTAMP("%H", timestamp), ':00') as time
    FROM \`${tableName}\`
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
      console.log('[dayQuery][Error]: There was a problem getting the rows', errorRows);
      return null;
    }
  } catch (errorJob) {
    console.log('[dayQuery][Error]: There was a problem getting the query job', errorJob);
    return null;
  }
};

exports.weekQuery = async (device) => {
  const today = getToday();
  const lastWeek = getWeekStart();

  console.log(`[weekQuery][Datetimes] Today: ${today}, Last Week: ${lastWeek}`);

  const query = `
    SELECT ROUND(AVG(humidity), 3) as avg_hum, ROUND(AVG(temp), 3) as avg_temp, CAST(timestamp as date) as date
    FROM \`${tableName}\`
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
      console.log('[weekQuery][Error]: There was a problem getting the rows', errorRows);
      return null;
    }
  } catch (errorJob) {
    console.log('[weekQuery][Error]: There was a problem getting the query job', errorJob);
    return null;
  }
};

exports.monthQuery = async (device) => {
  const today = getToday();
  const lastMonth = getMonthStart();

  console.log(`[monthQuery][Datetimes] Today: ${today}, Last Month: ${lastMonth}`);

  const query = `
    SELECT ROUND(AVG(humidity), 3) as avg_hum, ROUND(AVG(temp), 3) as avg_temp, CAST(timestamp as date) as date
    FROM \`${tableName}\`
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
      console.log('[monthQuery][Error]: There was a problem getting the rows', errorRows);
      return null;
    }
  } catch (errorJob) {
    console.log('[monthQuery][Error]: There was a problem getting the query job', errorJob);
    return null;
  }
};
