const pool = require('../config/db');
const appointmentModel = require('../models/appointmentModel');
const patientModel = require('../models/patientModel');
const doctorModel = require('../models/doctorModel');
const { validateSlot } = require('../services/validationService');
const { calculateRefund } = require('../services/refundService');
const { DAILY_CAP } = require('../config/constants');
const { logEvent } = require('../services/auditLogger');
const { waitlistQueue, notificationQueue } = require('../queue/queueConfig');

async function book(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const { patient_id, doctor_id, appointment_datetime } = req.body;
    if (!patient_id || !doctor_id || !appointment_datetime) return res.status(400).json({ error: 'patient_id, doctor_id, appointment_datetime required' });
    const slot = validateSlot(appointment_datetime);
    if (!slot.ok) return res.status(422).json({ error: slot.message });
    const patient = await patientModel.findById(patient_id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const doctor = await doctorModel.findById(doctor_id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    const dateStr = appointment_datetime.slice(0, 10);
    await conn.beginTransaction();
    const [[{ c }]] = await conn.query(`SELECT COUNT(*) AS c FROM appointments WHERE doctor_id=? AND status='booked' AND DATE(appointment_datetime)=? FOR UPDATE`, [doctor_id, dateStr]);
    if (c >= DAILY_CAP) {
      await conn.rollback();
      await waitlistQueue.add({ patient_id, doctor_id, appointment_datetime });
      return res.status(409).json({ error: 'Day full — added to waitlist' });
    }
    try {
      const id = await appointmentModel.create({ patient_id, doctor_id, appointment_datetime, amount_paid: doctor.consultation_fee }, conn);
      await conn.commit();
      await logEvent({ event: 'booking', appointment_id: id, patient_id, doctor_id, appointment_datetime });
      await notificationQueue.add({ appointment_id: id, patient_id });
      return res.status(201).json({ appointment_id: id });
    } catch (err) {
      await conn.rollback();
      if (err.code === 'ER_DUP_ENTRY') {
        await waitlistQueue.add({ patient_id, doctor_id, appointment_datetime });
        return res.status(409).json({ error: 'Slot taken — added to waitlist' });
      }
      throw err;
    }
  } catch (err) { try { await conn.rollback(); } catch {} next(err); } finally { conn.release(); }
}

async function cancel(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    await conn.beginTransaction();
    const [[appt]] = await conn.query('SELECT * FROM appointments WHERE appointment_id=? FOR UPDATE', [id]);
    if (!appt) { await conn.rollback(); return res.status(404).json({ error: 'Not found' }); }
    if (appt.status === 'cancelled') { await conn.rollback(); return res.status(409).json({ error: 'Already cancelled' }); }
    const { percent, amount } = calculateRefund(appt.appointment_datetime, new Date(), appt.amount_paid);
    await appointmentModel.cancel(id, amount, conn);
    await conn.commit();
    await logEvent({ event: 'cancellation', appointment_id: id, refund_percent: percent, refund_amount: amount });
    await waitlistQueue.add({ doctor_id: appt.doctor_id, appointment_datetime: appt.appointment_datetime });
    res.json({ refund_percent: percent, refund_amount: amount });
  } catch (e) { try { await conn.rollback(); } catch {} next(e); } finally { conn.release(); }
}
module.exports = { book, cancel };
