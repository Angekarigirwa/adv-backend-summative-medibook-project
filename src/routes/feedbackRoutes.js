const express = require('express');
const router = express.Router();
const c = require('../controllers/feedbackController');
router.get('/', c.feedback);
module.exports = router;
