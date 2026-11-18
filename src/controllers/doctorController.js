const doctorModel = require('../models/doctorModel');
async function create(req, res, next) {
  try {
    const { name, specialty, consultation_fee, room } = req.body;
    if (!name || !specialty || !consultation_fee || !room) return res.status(400).json({ error: 'name, specialty, consultation_fee, room required' });
    const id = await doctorModel.create(req.body);
    res.status(201).json({ doctor_id: id });
  } catch (e) { next(e); }
}
async function list(req, res, next) { try { res.json(await doctorModel.findAll()); } catch (e) { next(e); } }
async function get(req, res, next) {
  try { const d = await doctorModel.findById(req.params.id); if (!d) return res.status(404).json({ error: 'Doctor not found' }); res.json(d); } catch (e) { next(e); }
}
async function update(req, res, next) {
  try { const rows = await doctorModel.update(req.params.id, req.body); if (!rows) return res.status(404).json({ error: 'Doctor not found' }); res.json({ ok: true }); } catch (e) { next(e); }
}
async function remove(req, res, next) {
  try { const rows = await doctorModel.remove(req.params.id); if (!rows) return res.status(404).json({ error: 'Doctor not found' }); res.status(204).send(); } catch (e) { next(e); }
}
async function stats(req, res, next) {
  try { const d = await doctorModel.findById(req.params.id); if (!d) return res.status(404).json({ error: 'Doctor not found' }); res.json(await doctorModel.stats(req.params.id)); } catch (e) { next(e); }
}
async function report(req, res, next) { try { res.json(await doctorModel.doctorsReport()); } catch (e) { next(e); } }
async function busy(req, res, next) { try { res.json(await doctorModel.busyDays()); } catch (e) { next(e); } }
module.exports = { create, list, get, update, remove, stats, report, busy };
