const pool = require('../config/db');
async function create(d) {
  const [r] = await pool.query('INSERT INTO doctors (name, specialty, consultation_fee, room) VALUES (?, ?, ?, ?)', [d.name, d.specialty, d.consultation_fee, d.room]);
  return r.insertId;
}
async function findAll() { const [rows] = await pool.query('SELECT * FROM doctors'); return rows; }
async function findById(id) { const [[row]] = await pool.query('SELECT * FROM doctors WHERE doctor_id = ?', [id]); return row; }
async function update(id, d) {
  const [r] = await pool.query('UPDATE doctors SET name=?, specialty=?, consultation_fee=?, room=? WHERE doctor_id=?', [d.name, d.specialty, d.consultation_fee, d.room, id]);
  return r.affectedRows;
}
async function remove(id) { const [r] = await pool.query('DELETE FROM doctors WHERE doctor_id=?', [id]); return r.affectedRows; }
async function stats(doctorId) {
  const [[rev]] = await pool.query(`SELECT COALESCE(SUM(amount_paid - COALESCE(refund_amount,0)),0) AS revenue FROM appointments WHERE doctor_id=? AND status='booked'`, [doctorId]);
  const [[upcoming]] = await pool.query(`SELECT COUNT(*) AS c FROM appointments WHERE doctor_id=? AND status='booked' AND appointment_datetime > NOW()`, [doctorId]);
  const [perDay] = await pool.query(`SELECT DATE(appointment_datetime) AS day, COUNT(*) AS count FROM appointments WHERE doctor_id=? AND status='booked' AND appointment_datetime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY) GROUP BY DATE(appointment_datetime) ORDER BY day`, [doctorId]);
  const [util] = await pool.query(`SELECT DATE(appointment_datetime) AS day, ROUND(COUNT(*)/12*100,1) AS utilization_pct FROM appointments WHERE doctor_id=? AND status='booked' AND appointment_datetime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY) GROUP BY DATE(appointment_datetime)`, [doctorId]);
  return { revenue: rev.revenue, upcoming: upcoming.c, perDay, utilization: util };
}
async function doctorsReport() {
  const [rows] = await pool.query(`SELECT d.doctor_id, d.name, COUNT(a.appointment_id) AS total_appointments, COALESCE(SUM(a.amount_paid - COALESCE(a.refund_amount,0)),0) AS revenue FROM doctors d LEFT JOIN appointments a ON a.doctor_id = d.doctor_id AND a.status='booked' GROUP BY d.doctor_id, d.name`);
  return rows;
}
async function busyDays() {
  const [rows] = await pool.query(`SELECT d.doctor_id, d.name, DATE(a.appointment_datetime) AS day, COUNT(*) AS booked, ROUND(COUNT(*)/12*100,1) AS pct FROM appointments a JOIN doctors d ON d.doctor_id=a.doctor_id WHERE a.status='booked' GROUP BY d.doctor_id, d.name, DATE(a.appointment_datetime) HAVING COUNT(*) > 0.8*12 ORDER BY pct DESC`);
  return rows;
}
module.exports = { create, findAll, findById, update, remove, stats, doctorsReport, busyDays };
