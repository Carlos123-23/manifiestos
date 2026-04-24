import 'reflect-metadata';
import { CobisHttpClient } from '../../../../../src/app/infrastructure/cobis-customer/http-client';

jest.mock('node-fetch');
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const makeMockResponse = (
  ok: boolean,
  status: number,
  jsonData?: unknown,
  jsonError?: boolean,
  textData?: string
) => {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: {},
    json: jsonError
      ? jest.fn().mockRejectedValue(new Error('JSON parse error'))
      : jest.fn().mockResolvedValue(jsonData),
    text: jest.fn().mockResolvedValue(textData ?? '')
  };
};

const TEST_URL = 'http://cobis.example.com/api/test';
const TEST_HEADERS = { 'x-api-key': 'key123' };
const TEST_BODY = { data: 'value' };

describe('CobisHttpClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('post()', () => {
    it('throws when URL is empty', async () => {
      await expect(
        CobisHttpClient.post('', TEST_HEADERS, TEST_BODY, 'TestService')
      ).rejects.toThrow('Cobis URL is not configured for TestService');
    });

    it('returns serialized response on success', async () => {
      const responseData = { result: 'ok', nested: { value: 42 } };
      mockFetch.mockResolvedValue(makeMockResponse(true, 200, responseData) as any);

      const result = await CobisHttpClient.post(TEST_URL, TEST_HEADERS, TEST_BODY, 'TestService');

      expect(result).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        TEST_URL,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'content-type': 'application/json' }),
          body: JSON.stringify(TEST_BODY)
        })
      );
    });

    it('throws when fetch fails (network error)', async () => {
      mockFetch.mockRejectedValue(new Error('Network failure'));

      await expect(
        CobisHttpClient.post(TEST_URL, TEST_HEADERS, TEST_BODY, 'TestService')
      ).rejects.toThrow('Failed to call TestService: Network failure');
    });

    it('throws when response is not ok, with JSON error body', async () => {
      const errorBody = { code: 'ERR001', message: 'Bad input' };
      mockFetch.mockResolvedValue(makeMockResponse(false, 400, errorBody) as any);

      await expect(
        CobisHttpClient.post(TEST_URL, TEST_HEADERS, TEST_BODY, 'TestService')
      ).rejects.toThrow('TestService responded with status 400');
    });

    it('throws when response is not ok and JSON parsing of error body fails', async () => {
      const mock = {
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        headers: {},
        json: jest.fn().mockRejectedValue(new Error('not json')),
        text: jest.fn().mockResolvedValue('Service Unavailable text')
      };
      mockFetch.mockResolvedValue(mock as any);

      await expect(
        CobisHttpClient.post(TEST_URL, TEST_HEADERS, TEST_BODY, 'TestService')
      ).rejects.toThrow('TestService responded with status 503');
    });

    it('throws when JSON parsing of success response fails', async () => {
      const mock = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        json: jest.fn().mockRejectedValue(new Error('invalid json')),
        text: jest.fn().mockResolvedValue('<html>error</html>')
      };
      mockFetch.mockResolvedValue(mock as any);

      await expect(
        CobisHttpClient.post(TEST_URL, TEST_HEADERS, TEST_BODY, 'TestService')
      ).rejects.toThrow('Failed to parse JSON from TestService');
    });

    it('handles non-Error fetch rejection', async () => {
      mockFetch.mockRejectedValue('string error');

      await expect(
        CobisHttpClient.post(TEST_URL, TEST_HEADERS, TEST_BODY, 'TestService')
      ).rejects.toThrow('Failed to call TestService: string error');
    });
  });

  describe('serializeResponse()', () => {
    it('returns null as-is', () => {
      expect(CobisHttpClient.serializeResponse(null)).toBeNull();
    });

    it('returns undefined as-is', () => {
      expect(CobisHttpClient.serializeResponse(undefined)).toBeUndefined();
    });

    it('returns primitive values as-is', () => {
      expect(CobisHttpClient.serializeResponse(42)).toBe(42);
      expect(CobisHttpClient.serializeResponse('string')).toBe('string');
      expect(CobisHttpClient.serializeResponse(true)).toBe(true);
    });

    it('serializes plain objects recursively', () => {
      const input = { a: 1, b: { c: 2, d: null } };
      expect(CobisHttpClient.serializeResponse(input)).toEqual({ a: 1, b: { c: 2, d: null } });
    });

    it('serializes arrays by mapping each element', () => {
      const input = [1, { a: 2 }, null];
      expect(CobisHttpClient.serializeResponse(input)).toEqual([1, { a: 2 }, null]);
    });

    it('handles objects with undefined values', () => {
      const input = { a: 1, b: undefined };
      const result = CobisHttpClient.serializeResponse(input);
      expect(result.a).toBe(1);
      expect(result.b).toBeUndefined();
    });
  });

  describe('readErrorBody()', () => {
    it('returns parsed JSON when successful', async () => {
      const errorData = { error: 'bad request' };
      const response = { json: jest.fn().mockResolvedValue(errorData) };

      const result = await CobisHttpClient.readErrorBody(response);
      expect(result).toEqual(errorData);
    });

    it('falls back to text when JSON parsing fails', async () => {
      const response = {
        json: jest.fn().mockRejectedValue(new Error('not json')),
        text: jest.fn().mockResolvedValue('error text')
      };

      const result = await CobisHttpClient.readErrorBody(response);
      expect(result).toBe('error text');
    });

    it('returns empty string when both JSON and text fail', async () => {
      const response = {
        json: jest.fn().mockRejectedValue(new Error('not json')),
        text: jest.fn().mockRejectedValue(new Error('text failed'))
      };

      const result = await CobisHttpClient.readErrorBody(response);
      expect(result).toBe('');
    });
  });
});
