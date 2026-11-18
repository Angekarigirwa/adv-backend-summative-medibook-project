const Queue = require('bull');
const redis = require('../config/redis');
const waitlistQueue = new Queue('waitlist', { createClient: () => redis });
const notificationQueue = new Queue('notifications', { createClient: () => redis });
module.exports = { waitlistQueue, notificationQueue };
