function badRequest(message) {
  const e = new Error(message);
  e.status = 400;
  return e;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isInteger(v) {
  return Number.isInteger(Number(v));
}

function isPositiveInteger(v) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
}

function isNonNegativeNumber(v) {
  const n = Number(v);
  return !Number.isNaN(n) && n >= 0;
}

function isValidDateString(v) {
  if (!v) return false;
  const d = new Date(v);
  return d.toString() !== 'Invalid Date';
}

module.exports = { badRequest, isNonEmptyString, isInteger, isPositiveInteger, isNonNegativeNumber, isValidDateString };
