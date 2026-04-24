/**
 * Authentication models for internal use
 */

export interface User {
  id: string;
  username: string;
  email: string;
  active: boolean;
}

export interface AuthenticationToken {
  token: string;
  type: string;
  expiresAt: Date;
}

export interface AuthenticationContext {
  user: User;
  token: AuthenticationToken;
  requestId: string;
}
