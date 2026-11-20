const Queue = require('bull');
require('dotenv').config();

const redisOpts = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const waitlistQueue = new Queue('waitlist', { redis: redisOpts });
const notificationQueue = new Queue('notifications', { redis: redisOpts });

module.exports = { waitlistQueue, notificationQueue };
