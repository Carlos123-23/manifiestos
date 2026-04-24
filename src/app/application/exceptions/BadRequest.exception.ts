export class BadRequestException extends Error {
  public readonly statusCode = 400;
  public readonly error = 'Bad Request';
  public readonly detail?: unknown;

  constructor(message: string, detail?: unknown) {
    super(message);
    this.name = 'BadRequestException';
    this.detail = detail;
  }
}
