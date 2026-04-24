import { CobisException } from './CobisException';

/**
 * Exception thrown when user lacks required permissions
 */
export class CobisForbiddenError extends CobisException {
  constructor(message: string = 'Access forbidden', detail?: unknown) {
    super(message, 403, 'Forbidden', detail);
    this.name = 'CobisForbiddenError';

    Object.setPrototypeOf(this, CobisForbiddenError.prototype);
  }
}
