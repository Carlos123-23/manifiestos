import { registerHttpInterceptors } from '../../../../../../src/app/adapter/http/interceptors/registerHttp.interceptor';

type HookDone = (error: Error | null, payload?: unknown) => void;

describe('registerHttpInterceptors', () => {
  it('wraps successful payload in standard success response', () => {
    let preSerialization: any;

    const app = {
      addHook: jest.fn((name: string, hook: unknown) => {
        if (name === 'preSerialization') {
          preSerialization = hook;
        }
      }),
      setErrorHandler: jest.fn(),
      setNotFoundHandler: jest.fn()
    };

    registerHttpInterceptors(app as any);

    const done = jest.fn() as jest.MockedFunction<HookDone>;
    preSerialization(
      {} as any,
      { statusCode: 200 } as any,
      { naturalPerson: { identification: { number: '1' } } },
      done
    );

    expect(done).toHaveBeenCalledWith(null, {
      success: true,
      statusCode: 200,
      data: { naturalPerson: { identification: { number: '1' } } }
    });
  });

  it('does not wrap payload when response is already standardized', () => {
    let preSerialization: any;

    const app = {
      addHook: jest.fn((name: string, hook: unknown) => {
        if (name === 'preSerialization') {
          preSerialization = hook;
        }
      }),
      setErrorHandler: jest.fn(),
      setNotFoundHandler: jest.fn()
    };

    registerHttpInterceptors(app as any);

    const payload = { success: true, statusCode: 200, data: { ok: true } };
    const done = jest.fn() as jest.MockedFunction<HookDone>;

    preSerialization({} as any, { statusCode: 200 } as any, payload, done);

    expect(done).toHaveBeenCalledWith(null, payload);
  });

  it('maps custom error shape in global error handler', () => {
    let errorHandler: any;

    const app = {
      addHook: jest.fn(),
      setErrorHandler: jest.fn((handler: unknown) => {
        errorHandler = handler;
      }),
      setNotFoundHandler: jest.fn()
    };

    registerHttpInterceptors(app as any);

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const error = {
      message: 'fail',
      statusCode: 502,
      error: 'Bad Gateway',
      externalError: { reason: 'timeout' }
    };

    errorHandler(error, { method: 'POST', url: '/api/find-by-identification' }, reply);

    expect(reply.status).toHaveBeenCalledWith(502);
    expect(reply.send).toHaveBeenCalledWith({
      success: false,
      statusCode: 502,
      error: 'Bad Gateway',
      message: 'fail',
      detail: { reason: 'timeout' }
    });
  });

  it('registers default not found handler with standard error format', () => {
    let notFoundHandler: any;

    const app = {
      addHook: jest.fn(),
      setErrorHandler: jest.fn(),
      setNotFoundHandler: jest.fn((handler: unknown) => {
        notFoundHandler = handler;
      })
    };

    registerHttpInterceptors(app as any);

    const reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    notFoundHandler({ method: 'GET', url: '/missing' }, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      success: false,
      statusCode: 404,
      error: 'Not Found',
      message: 'Route GET /missing not found'
    });
  });
});
