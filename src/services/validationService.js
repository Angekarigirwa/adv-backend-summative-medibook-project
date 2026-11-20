const { WORK_START_MIN, WORK_END_MIN, SLOT_MINUTES } = require('../config/constants');
function validateSlot(datetime, now = new Date()) {
  const d = new Date(datetime);
  if (isNaN(d)) return { ok: false, message: 'Invalid datetime' };
  if (d <= now) return { ok: false, message: 'Appointment must be in the future' };
  const mins = d.getHours() * 60 + d.getMinutes();
  if (mins < WORK_START_MIN || mins >= WORK_END_MIN)
    return { ok: false, message: 'Outside working hours (09:00–17:00)' };
  if (mins % SLOT_MINUTES !== 0)
    return { ok: false, message: 'Must align to a 30-minute slot' };
  return { ok: true };
}
module.exports = { validateSlot };
