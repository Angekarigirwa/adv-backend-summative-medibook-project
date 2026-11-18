const { validateSlot } = require('../src/services/validationService');
const now = new Date('2026-09-01T08:00:00');

test('17:00 exactly is rejected', () => {
  expect(validateSlot('2026-09-10T17:00:00', now).ok).toBe(false);
});
test('09:15 is rejected (not 30-min boundary)', () => {
  expect(validateSlot('2026-09-10T09:15:00', now).ok).toBe(false);
});
test('valid future slot accepted', () => {
  expect(validateSlot('2026-09-10T09:30:00', now).ok).toBe(true);
});
test('malformed date rejected', () => {
  expect(validateSlot('not-a-date', now).ok).toBe(false);
});
