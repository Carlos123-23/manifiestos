export interface CobisRequestHeaders {
  authorization: string;
  requestId: string;
  endUserLogin: string;
  endUserRequestDateTime: string;
  endUserTerminal: string;
  endUserLastLoggedDateTime: string;
  apiKey?: string;
  reverse?: string;
  requestIdToReverse?: string;
  acceptLanguage?: string;
}
