const pool = require('../config/db');
async function create(a, conn = pool) {
  const [r] = await conn.query('INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, amount_paid) VALUES (?,?,?,?)', [a.patient_id, a.doctor_id, a.appointment_datetime, a.amount_paid]);
  return r.insertId;
}
async function findById(id) { const [[row]] = await pool.query('SELECT * FROM appointments WHERE appointment_id=?', [id]); return row; }
async function cancel(id, refundAmount, conn = pool) {
  await conn.query(`UPDATE appointments SET status='cancelled', refund_amount=? WHERE appointment_id=?`, [refundAmount, id]);
}
module.exports = { create, findById, cancel };
