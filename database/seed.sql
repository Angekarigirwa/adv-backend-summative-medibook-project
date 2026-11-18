USE medibook;

INSERT INTO patients (name, email, phone) VALUES
  ('Ama Mensah', 'ama@mail.com',   '0244-111-222'),
  ('Kojo Owusu', 'kojo@mail.com',  '0555-333-444'),
  ('Efua Danso', 'efua@mail.com',  '0277-999-888');

INSERT INTO doctors (name, specialty, consultation_fee, room) VALUES
  ('Dr. Boateng', 'Dermatology', 150.00, 'R-12'),
  ('Dr. Owusu',   'Cardiology',  200.00, 'R-07'),
  ('Dr. Adjei',   'Paediatrics', 100.00, 'R-03');

INSERT INTO appointments (patient_id, doctor_id, appointment_datetime, amount_paid) VALUES
  (1, 1, '2027-08-10 09:00:00', 150.00),
  (2, 1, '2027-08-10 09:30:00', 150.00),
  (3, 1, '2027-08-10 10:00:00', 150.00),
  (1, 1, '2027-08-10 10:30:00', 150.00),
  (2, 1, '2027-08-10 11:00:00', 150.00),
  (3, 1, '2027-08-10 11:30:00', 150.00),
  (1, 1, '2027-08-10 12:00:00', 150.00),
  (2, 2, '2027-08-11 10:00:00', 200.00);
