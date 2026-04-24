export class ExternalServiceException extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly externalError?: unknown;

  constructor(message: string, statusCode = 502, externalError?: unknown) {
    super(message);
    this.name = 'ExternalServiceException';
    this.statusCode = statusCode;
    this.error = statusCode >= 500 ? 'Bad Gateway' : 'External Service Error';
    this.externalError = externalError;
  }
}
