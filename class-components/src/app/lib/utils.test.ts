import { describe, it, expect } from 'vitest';
import { checkPasswordStrength } from './utils';

describe('checkPasswordStrength', () => {
  it('should return 0 for an empty string', () => {
    expect(checkPasswordStrength('')).toBe(0);
  });

  it('should return 1 for a password with only one criterion (e.g., only lowercase)', () => {
    expect(checkPasswordStrength('password')).toBe(1);
  });

  it('should return 2 for a password with two criteria (e.g., lowercase and uppercase)', () => {
    expect(checkPasswordStrength('Password')).toBe(2);
  });

  it('should return 3 for a password with three criteria (e.g., lowercase, uppercase, and a number)', () => {
    expect(checkPasswordStrength('Password123')).toBe(3);
  });

  it('should return 4 for a password with all four criteria', () => {
    expect(checkPasswordStrength('Password123!')).toBe(4);
  });

  it('should correctly score a password missing one criterion (e.g., no number)', () => {
    expect(checkPasswordStrength('Password!')).toBe(3);
  });

  it('should correctly score a password with only special characters', () => {
    expect(checkPasswordStrength('!@#$%^&*')).toBe(1);
  });
});
