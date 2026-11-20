const { REFUND } = require('../config/constants');
function calculateRefund(appointmentDatetime, now, amountPaid) {
  const hours = (new Date(appointmentDatetime) - new Date(now)) / 36e5;
  let percent = 0;
  if (hours >= REFUND.FULL_HOURS) percent = 100;
  else if (hours >= REFUND.HALF_HOURS) percent = 50;
  return { percent, amount: +(amountPaid * percent / 100).toFixed(2) };
}
module.exports = { calculateRefund };
