const express = require('express');
const router = express.Router();
const c = require('../controllers/doctorController');
router.post('/', c.create); router.get('/', c.list);
router.get('/reports/all', c.report); router.get('/reports/busy', c.busy);
router.get('/:id', c.get); router.get('/:id/stats', c.stats);
router.put('/:id', c.update); router.delete('/:id', c.remove);
module.exports = router;
