'use strict';

/**
 * Unit tests for the pure date/offset logic in MMM-Advent.js.
 *
 * Inline copy of `resolveDates` and `computeOffset`, kept in sync with the
 * real implementation, to avoid pulling in the MagicMirror front-end
 * runtime/DOM dependency in CI.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Mirrors MMM-Advent.js `resolveDates`
function resolveDates(config, now) {
  const year = now.getFullYear();
  const start = config.start ? new Date(config.start) : new Date(year, 11, 1, 0, 0, 0);
  const end = config.end ? new Date(config.end) : new Date(year, 11, 24, 23, 59, 59);
  return { start, end };
}

// Mirrors MMM-Advent.js `computeOffset`
function computeOffset(now, start, end) {
  const total = end.getTime() - start.getTime();
  let offset = (now.getTime() - start.getTime()) / total;
  if (offset >= 1.0) {
    offset = 1.0;
  }
  if (offset <= -0.01) {
    offset = -0.01;
  }
  return offset;
}

describe('resolveDates', () => {
  it('defaults to Dec 1 - Dec 24 of the current year when start/end are unset', () => {
    const now = new Date(2026, 5, 15); // June 2026, arbitrary "today"
    const { start, end } = resolveDates({ start: null, end: null }, now);

    assert.equal(start.getFullYear(), 2026);
    assert.equal(start.getMonth(), 11); // December
    assert.equal(start.getDate(), 1);
    assert.equal(start.getHours(), 0);

    assert.equal(end.getFullYear(), 2026);
    assert.equal(end.getMonth(), 11);
    assert.equal(end.getDate(), 24);
    assert.equal(end.getHours(), 23);
  });

  it('uses explicit start/end when provided, ignoring "now"', () => {
    const now = new Date(2026, 5, 15);
    const { start, end } = resolveDates(
      { start: '2020-01-01 00:00:00', end: '2020-01-02 00:00:00' },
      now
    );

    assert.equal(start.getFullYear(), 2020);
    assert.equal(start.getMonth(), 0);
    assert.equal(end.getDate(), 2);
  });
});

describe('computeOffset', () => {
  it('clamps to -0.01 before the start date', () => {
    const start = new Date(2026, 11, 1);
    const end = new Date(2026, 11, 24);
    const now = new Date(2026, 10, 1); // a month before start

    assert.equal(computeOffset(now, start, end), -0.01);
  });

  it('returns 0.5 at the midpoint', () => {
    const start = new Date(2026, 11, 1, 0, 0, 0);
    const end = new Date(2026, 11, 25, 0, 0, 0); // 24 days later
    const now = new Date(2026, 11, 13, 0, 0, 0); // 12 days in

    assert.equal(computeOffset(now, start, end), 0.5);
  });

  it('clamps to 1.0 after the end date', () => {
    const start = new Date(2026, 11, 1);
    const end = new Date(2026, 11, 24);
    const now = new Date(2027, 0, 5); // well after end

    assert.equal(computeOffset(now, start, end), 1.0);
  });
});
