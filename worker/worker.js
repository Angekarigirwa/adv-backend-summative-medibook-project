require('dotenv').config();
const { waitlistQueue, notificationQueue } = require('../src/queue/queueConfig');
const { logEvent } = require('../src/services/auditLogger');
waitlistQueue.process(async (job) => {
  await logEvent({ event: 'waitlist_slot_freed', ...job.data });
});
notificationQueue.process(async (job) => {
  await logEvent({ event: 'confirmation_sms', ...job.data });
});
