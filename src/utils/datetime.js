/**
 * Get weekStart ISO String
 * @description By substracting 7 days to the current date, it gets the beginning of the week,
 * week defined between the dates: [7 days ago - Today]
 * @returns ISO String Date e.g: "2020-01-24T04:06:16.084Z"
 */
exports.getWeekStart = () => {
  const today = new Date();
  let weekStart = new Date();
  weekStart.setDate(today.getDate() - 7);
  return weekStart.toISOString();
};

/**
 * Get monthStart ISO String
 * @description By substracting 30 days to the current date, it gets the beginning of the month,
 * month defined between the dates: [30 days ago - Today]
 * @returns ISO String Date e.g: "2020-01-24T04:06:16.084Z"
 */
exports.getMonthStart = () => {
  const today = new Date();
  let monthStart = new Date();
  monthStart.setDate(today.getDate() - 30);
  return monthStart.toISOString();
};

/**
 * Get dayStart ISO String
 * @description By substracting 1 day to the current date, it gets the beginning of the day,
 * day defined between the dates: [24 hours ago - Today]
 * @returns ISO String Date e.g: "2020-01-24T04:06:16.084Z"
 */
exports.getDayStart = () => {
  const today = new Date();
  let dayStart = new Date();
  dayStart.setDate(today.getDate() - 1);
  return dayStart.toISOString();
};

exports.getToday = () => {
  const today = new Date();
  return today.toISOString();
};
