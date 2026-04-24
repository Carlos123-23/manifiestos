
export interface AdapterContract {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

export interface ControllerResponse {
  statusCode: number;
  body: unknown;
}

export interface AdapterError {
  statusCode: number;
  error: string;
  message: string;
  detail?: unknown;
}
