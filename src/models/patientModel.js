const pool = require('../config/db');
async function create(p) {
  const [r] = await pool.query('INSERT INTO patients (name, email, phone) VALUES (?, ?, ?)', [p.name, p.email, p.phone]);
  return r.insertId;
}
async function findAll() { const [rows] = await pool.query('SELECT * FROM patients'); return rows; }
async function findById(id) { const [[row]] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [id]); return row; }
async function update(id, p) {
  const [r] = await pool.query('UPDATE patients SET name=?, email=?, phone=? WHERE patient_id=?', [p.name, p.email, p.phone, id]);
  return r.affectedRows;
}
async function remove(id) { const [r] = await pool.query('DELETE FROM patients WHERE patient_id=?', [id]); return r.affectedRows; }
module.exports = { create, findAll, findById, update, remove };
