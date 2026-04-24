import { UseCaseResult } from '../../../../../src/app/application/dto/useCaseResult';

describe('UseCaseResult', () => {
  describe('success()', () => {
    it('creates a successful result with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = UseCaseResult.success(data);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBe(data);
      expect(result.error).toBeUndefined();
    });

    it('ok getter returns true', () => {
      const result = UseCaseResult.success('value');
      expect(result.ok).toBe(true);
    });

    it('getOrThrow returns data when successful', () => {
      const data = { value: 42 };
      const result = UseCaseResult.success(data);
      expect(result.getOrThrow()).toBe(data);
    });

    it('creates successful result with null data', () => {
      const result = UseCaseResult.success(null);
      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('failure()', () => {
    it('creates a failed result with an error', () => {
      const error = new Error('something went wrong');
      const result = UseCaseResult.failure<string>(error);

      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe(error);
      expect(result.data).toBeUndefined();
    });

    it('ok getter returns false', () => {
      const result = UseCaseResult.failure(new Error('fail'));
      expect(result.ok).toBe(false);
    });

    it('getOrThrow throws the stored error when failed', () => {
      const error = new Error('operation failed');
      const result = UseCaseResult.failure<string>(error);

      expect(() => result.getOrThrow()).toThrow(error);
      expect(() => result.getOrThrow()).toThrow('operation failed');
    });
  });

  describe('getOrThrow()', () => {
    it('returns data when result is successful', () => {
      const data = [1, 2, 3];
      const result = UseCaseResult.success(data);
      expect(result.getOrThrow()).toEqual([1, 2, 3]);
    });

    it('throws stored error when result is failed', () => {
      const customError = new TypeError('type mismatch');
      const result = UseCaseResult.failure<number>(customError);

      expect(() => result.getOrThrow()).toThrow(TypeError);
      expect(() => result.getOrThrow()).toThrow('type mismatch');
    });
  });
});
