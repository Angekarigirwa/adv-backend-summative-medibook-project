const { calculateRefund } = require('../src/services/refundService');
const appt = '2026-09-10T10:00:00';

test('exactly 48h → 100%', () => {
  expect(calculateRefund(appt, '2026-09-08T10:00:00', 150).amount).toBe(150);
});
test('just under 48h → 50%', () => {
  expect(calculateRefund(appt, '2026-09-08T10:00:01', 150).amount).toBe(75);
});
test('exactly 24h → 50%', () => {
  expect(calculateRefund(appt, '2026-09-09T10:00:00', 150).amount).toBe(75);
});
test('just under 24h → 0%', () => {
  expect(calculateRefund(appt, '2026-09-09T10:00:01', 150).amount).toBe(0);
});
test('well in advance → 100%', () => {
  expect(calculateRefund(appt, '2026-09-01T10:00:00', 150).amount).toBe(150);
});
