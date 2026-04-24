/**
 * Standard result type for all use cases
 * Provides a unified response structure for success and error scenarios
 */
export class UseCaseResult<T = unknown> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly data?: T,
    public readonly error?: Error
  ) {}

  /**
   * Creates a successful result
   */
  static success<T>(data: T): UseCaseResult<T> {
    return new UseCaseResult<T>(true, data);
  }

  /**
   * Creates a failed result
   */
  static failure<T>(error: Error): UseCaseResult<T> {
    return new UseCaseResult<T>(false, undefined, error);
  }

  /**
   * Shorthand getter for success check
   */
  get ok(): boolean {
    return this.isSuccess;
  }

  /**
   * Gets data or throws if failed
   */
  getOrThrow(): T {
    if (!this.isSuccess) {
      throw this.error;
    }
    return this.data as T;
  }
}
