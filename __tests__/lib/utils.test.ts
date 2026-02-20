import { cn } from '../../lib/utils';

describe('Utils - cn function', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).not.toContain('active-class');
  });

  it('should handle array of classes', () => {
    const result = cn(['class-1', 'class-2'], 'class-3');
    expect(result).toContain('class-1');
    expect(result).toContain('class-2');
    expect(result).toContain('class-3');
  });

  it('should handle object syntax', () => {
    const result = cn({ 'class-a': true, 'class-b': false, 'class-c': true });
    expect(result).toContain('class-a');
    expect(result).not.toContain('class-b');
    expect(result).toContain('class-c');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle null and undefined', () => {
    const result = cn('class-1', null, undefined, 'class-2');
    expect(result).toContain('class-1');
    expect(result).toContain('class-2');
  });

  it('should resolve conflicting tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toContain('text-blue-500');
    expect(result).not.toContain('text-red-500');
  });

  it('should handle nested arrays', () => {
    const result = cn(['class-1', ['class-2', 'class-3']], 'class-4');
    expect(result).toContain('class-1');
    expect(result).toContain('class-2');
    expect(result).toContain('class-3');
    expect(result).toContain('class-4');
  });
});
