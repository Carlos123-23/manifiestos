export class InvalidIdentificationException extends Error {
  public readonly statusCode = 400;
  public readonly error = 'Bad Request';

  constructor(message: string) {
    super(message);
    this.name = 'InvalidIdentificationException';
  }
}
