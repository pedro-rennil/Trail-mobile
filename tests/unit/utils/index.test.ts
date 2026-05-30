import { clampProgress, filterTrails, getInitials } from '@/utils';
import { makeTrail, trailsFixture } from '../../fixtures/trails';

describe('getInitials', () => {
  it('returns the first two uppercase initials of a full name', () => {
    expect(getInitials('Matheus Silva')).toBe('MS');
  });

  it('uses a single initial when only one name is given', () => {
    expect(getInitials('madonna')).toBe('M');
  });

  it('falls back to "U" for an empty or blank name', () => {
    expect(getInitials('')).toBe('U');
    expect(getInitials('   ')).toBe('U');
  });
});

describe('clampProgress', () => {
  it('keeps values already inside the 0–100 range', () => {
    expect(clampProgress(62)).toBe(62);
  });

  it('clamps out-of-range values to the nearest bound', () => {
    expect(clampProgress(-10)).toBe(0);
    expect(clampProgress(140)).toBe(100);
  });

  it('treats NaN as zero', () => {
    expect(clampProgress(Number.NaN)).toBe(0);
  });
});

describe('filterTrails', () => {
  it('returns every trail for an empty query', () => {
    expect(filterTrails(trailsFixture, '')).toHaveLength(trailsFixture.length);
    expect(filterTrails(trailsFixture, '   ')).toHaveLength(trailsFixture.length);
  });

  it('matches on the title case-insensitively', () => {
    const result = filterTrails(trailsFixture, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Fundamentals');
  });

  it('ignores accents so "proximo" matches "Próximo"', () => {
    const trail = makeTrail({ title: 'Próximos passos', subtitle: '' });
    expect(filterTrails([trail], 'proximos')).toHaveLength(1);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterTrails(trailsFixture, 'cobol')).toHaveLength(0);
  });
});
