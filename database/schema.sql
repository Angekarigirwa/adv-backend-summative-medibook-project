CREATE DATABASE IF NOT EXISTS medibook;
USE medibook;

CREATE TABLE patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  phone      VARCHAR(20)  NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  doctor_id        INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100)  NOT NULL,
  specialty        VARCHAR(100)  NOT NULL,
  consultation_fee DECIMAL(10,2) NOT NULL CHECK (consultation_fee >= 0),
  room             VARCHAR(10)   NOT NULL UNIQUE
);

CREATE TABLE appointments (
  appointment_id       INT AUTO_INCREMENT PRIMARY KEY,
  patient_id           INT            NOT NULL,
  doctor_id            INT            NOT NULL,
  appointment_datetime DATETIME       NOT NULL,
  amount_paid          DECIMAL(10,2)  NOT NULL,
  status               ENUM('booked','cancelled') NOT NULL DEFAULT 'booked',
  refund_amount        DECIMAL(10,2)  NULL,
  created_at           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active_slot          DATETIME AS (IF(status = 'booked', appointment_datetime, NULL)) STORED,
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  CONSTRAINT fk_appt_doctor  FOREIGN KEY (doctor_id)  REFERENCES doctors(doctor_id),
  CONSTRAINT uq_doctor_active_slot UNIQUE (doctor_id, active_slot)
);
