/**
 * Production-grade HTTP client with 3-attempt exponential backoff,
 * rate limit handling (HTTP 429), timeouts, and response caching.
 */

import { cache } from './cache';
import { ApiResponse } from './types';

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  useCache?: boolean;
  cacheTTLMs?: number;
  cacheKey?: string;
  fallbackData?: any;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeoutMs = 8000,
    retries = 3,
    retryDelayMs = 600,
    useCache = true,
    cacheTTLMs = 15 * 60 * 1000,
    cacheKey = url,
    fallbackData = null,
    ...fetchOptions
  } = options;

  // 1. Check Cache
  if (useCache) {
    const cached = cache.get<T>(cacheKey);
    if (cached) {
      return {
        success: true,
        data: cached.data,
        source: 'cache',
        timestamp: new Date().toISOString(),
        metadata: { cachedAt: cached.cachedAt },
      };
    }
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < retries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP 429 (Too Many Requests / Rate Limiting)
      if (response.status === 429) {
        const retryAfterSec = parseInt(response.headers.get('Retry-After') || '2', 10);
        const backoffMs = Math.max(retryAfterSec * 1000, retryDelayMs * Math.pow(2, attempt));
        console.warn(`[HTTP 429 Rate Limit] Retrying ${url} in ${backoffMs}ms (Attempt ${attempt}/${retries})`);
        await sleep(backoffMs);
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      // Cache successful response
      if (useCache) {
        cache.set(cacheKey, json, cacheTTLMs);
      }

      return {
        success: true,
        data: json as T,
        source: 'live',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;

      // Do not retry if aborted explicitly or if it's the last attempt
      if (attempt < retries) {
        const backoff = retryDelayMs * Math.pow(2, attempt - 1) + Math.random() * 200;
        console.warn(`[HTTP Request Failed] ${url} - Error: ${err.message}. Retrying in ${Math.round(backoff)}ms (Attempt ${attempt}/${retries})`);
        await sleep(backoff);
      }
    }
  }

  // Graceful degradation fallback
  if (fallbackData !== null && fallbackData !== undefined) {
    console.warn(`[HTTP Fallback Active] All ${retries} attempts failed for ${url}. Serving curated fallback.`);
    return {
      success: true,
      data: fallbackData,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      error: lastError?.message || 'Network request failed',
    };
  }

  return {
    success: false,
    data: null as any,
    source: 'live',
    timestamp: new Date().toISOString(),
    error: lastError?.message || 'Network request failed after maximum retries',
  };
}
