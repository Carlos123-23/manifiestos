import { techLog } from '@darwin-node/logger';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type HttpErrorLike = Error & {
  statusCode?: number;
  error?: string;
  externalError?: unknown;
  detail?: unknown;
  validation?: unknown;
};

type StandardSuccessResponse = {
  success: true;
  statusCode: number;
  data: unknown;
};

type StandardErrorResponse = {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  detail?: unknown;
};

type InterceptableApp = Pick<FastifyInstance, 'addHook' | 'setErrorHandler' | 'setNotFoundHandler'>;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isStandardResponse = (payload: unknown): boolean => {
  return (
    isObject(payload) &&
    typeof payload.success === 'boolean' &&
    typeof payload.statusCode === 'number'
  );
};

const buildErrorResponse = (
  statusCode: number,
  error: string,
  message: string,
  detail?: unknown
): StandardErrorResponse => {
  const response: StandardErrorResponse = {
    success: false,
    statusCode,
    error,
    message
  };

  if (detail !== undefined) {
    response.detail = detail;
  }

  return response;
};

const resolveErrorResponse = (error: HttpErrorLike): StandardErrorResponse => {
  if (Array.isArray(error.validation)) {
    return buildErrorResponse(400, 'Bad Request', error.message);
  }

  if (typeof error.statusCode === 'number' && typeof error.error === 'string') {
    return buildErrorResponse(
      error.statusCode,
      error.error,
      error.message,
      error.externalError ?? error.detail
    );
  }

  return buildErrorResponse(500, 'Internal Server Error', 'An unexpected error occurred');
};

export const registerHttpInterceptors = (app: Partial<InterceptableApp>): void => {
  app.addHook?.(
    'preSerialization',
    (
      _request: FastifyRequest,
      reply: FastifyReply,
      payload: unknown,
      done: (error: Error | null, result?: unknown) => void
    ) => {
      if (reply.statusCode < 200 || reply.statusCode >= 300 || isStandardResponse(payload)) {
        done(null, payload);
        return;
      }

      if (payload && typeof payload === 'object') {
        const response: StandardSuccessResponse = {
          success: true,
          statusCode: reply.statusCode,
          data: payload
        };

        done(null, response);
        return;
      }

      done(null, payload);
    }
  );

  app.setErrorHandler?.((error, request, reply) => {
    const httpError = error as HttpErrorLike;
    const response = resolveErrorResponse(httpError);

    techLog.error(
      `[HttpErrorInterceptor] ${request.method} ${request.url} -> ${response.statusCode}: ${response.message}`,
      {
        errorName: httpError.name,
        originalMessage: httpError.message,
        statusCode: httpError.statusCode,
        errorType: httpError.error,
        detail: httpError.detail,
        externalError: httpError.externalError,
        stack: httpError.stack
      }
    );

    reply.status(response.statusCode).send(response);
  });

  app.setNotFoundHandler?.((request, reply) => {
    reply.status(404).send(
      buildErrorResponse(404, 'Not Found', `Route ${request.method} ${request.url} not found`)
    );
  });
};
