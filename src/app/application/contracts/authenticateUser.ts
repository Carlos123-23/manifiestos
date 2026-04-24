/**
 * Authentication use case contract
 */

export interface AuthenticationInput {
  authentication: {
    login: string;
    password: string;
  };
}

export interface AuthenticationResult {
  token: string;
  userId: string;
  expiresIn: number;
}
