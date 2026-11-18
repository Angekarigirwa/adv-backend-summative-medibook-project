const patientModel = require('../models/patientModel');
async function create(req, res, next) {
  try {
    if (!req.body.name || !req.body.email || !req.body.phone) return res.status(400).json({ error: 'name, email, phone required' });
    const id = await patientModel.create(req.body);
    res.status(201).json({ patient_id: id });
  } catch (e) { next(e); }
}
async function list(req, res, next) { try { res.json(await patientModel.findAll()); } catch (e) { next(e); } }
async function get(req, res, next) {
  try { const p = await patientModel.findById(req.params.id); if (!p) return res.status(404).json({ error: 'Patient not found' }); res.json(p); } catch (e) { next(e); }
}
async function update(req, res, next) {
  try { const rows = await patientModel.update(req.params.id, req.body); if (!rows) return res.status(404).json({ error: 'Patient not found' }); res.json({ ok: true }); } catch (e) { next(e); }
}
async function remove(req, res, next) {
  try { const rows = await patientModel.remove(req.params.id); if (!rows) return res.status(404).json({ error: 'Patient not found' }); res.status(204).send(); } catch (e) { next(e); }
}
module.exports = { create, list, get, update, remove };
