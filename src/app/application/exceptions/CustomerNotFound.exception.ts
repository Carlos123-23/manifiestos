export class CustomerNotFoundException extends Error {
  public readonly statusCode = 404;
  public readonly error = 'Not Found';

  constructor(identificationNumber: string, identificationType: string) {
    super(`Customer with identification '${identificationType}:${identificationNumber}' not found`);
    this.name = 'CustomerNotFoundException';
  }
}
