import fetch from 'node-fetch';
import { techLog } from '@darwin-node/logger';

export class CobisHttpClient {
  static async readErrorBody(response: any): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return response.text().catch(() => '');
    }
  }

  static serializeResponse(data: any): any {
    // Asegurar que el objeto sea serializable
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data !== 'object') {
      return data;
    }

    // Si es un array, serializar cada elemento
    if (Array.isArray(data)) {
      return data.map(item => this.serializeResponse(item));
    }

    // Crear un objeto plano nuevo
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (value === null || value === undefined) {
          serialized[key] = value;
        } else if (typeof value === 'object') {
          serialized[key] = this.serializeResponse(value);
        } else {
          serialized[key] = value;
        }
      }
    }
    return serialized;
  }

  static async post(
    url: string,
    headers: Record<string, string>,
    body: Record<string, any>,
    serviceName: string
  ): Promise<any> {
    if (!url) {
      throw new Error(`Cobis URL is not configured for ${serviceName}`);
    }

    console.log(`[CobisHttpClient] Calling ${serviceName}`, {
      url,
      headers,
      body,
    });

    let response: any;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error(`[CobisHttpClient] Fetch error from ${serviceName}:`, errorMsg);
      throw new Error(`Failed to call ${serviceName}: ${errorMsg}`);
    }

    console.log(`[CobisHttpClient] Received response from ${serviceName}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    if (!response.ok) {
      const errorBody = await this.readErrorBody(response);
      console.error(
        `[CobisHttpClient] Error from ${serviceName} ${response.status}:`,
        JSON.stringify(errorBody, null, 2)
      );
      techLog.error(
        `[CobisHttpClient] Error from ${serviceName} ${response.status}: ${JSON.stringify(errorBody)}`
      );
      throw new Error(`${serviceName} responded with status ${response.status}: ${JSON.stringify(errorBody)}`);
    }

    let responseBody: any;
    try {
      responseBody = await response.json();
    } catch (jsonError) {
      const errorMsg = jsonError instanceof Error ? jsonError.message : String(jsonError);
      console.error(`[CobisHttpClient] JSON parsing error from ${serviceName}:`, errorMsg);
      const text = await response.text();
      console.log(`[CobisHttpClient] Response text:`, text);
      throw new Error(`Failed to parse JSON from ${serviceName}: ${errorMsg}`);
    }

    console.log(`[CobisHttpClient] Response body from ${serviceName}:`, responseBody);
    console.log(`[CobisHttpClient] Response body type:`, typeof responseBody);
    console.log(`[CobisHttpClient] Response body constructor:`, responseBody?.constructor?.name);

    // Serializar recursivamente para asegurar que sea un objeto plano
    const plainResponse = this.serializeResponse(responseBody);
    console.log(`[CobisHttpClient] Serialized response from ${serviceName}:`, plainResponse);

    return plainResponse;
  }
}
