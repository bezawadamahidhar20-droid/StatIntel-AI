/**
 * Cache utility for API responses with TTL (Time To Live) support.
 * Defaults to localStorage in browser environments, with in-memory map fallback.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
  timestamp: string;
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private defaultTTLMs = 15 * 60 * 1000; // 15 minutes default

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public get<T>(key: string): { data: T; cachedAt: number } | null {
    const now = Date.now();

    // 1. Check in-memory cache
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      if (entry.expiry > now) {
        return { data: entry.data, cachedAt: entry.expiry - this.defaultTTLMs };
      }
      this.memoryCache.delete(key);
    }

    // 2. Check localStorage
    if (this.isBrowser()) {
      try {
        const stored = window.localStorage.getItem(`statintel_cache_${key}`);
        if (stored) {
          const parsed: CacheEntry<T> = JSON.parse(stored);
          if (parsed.expiry > now) {
            // Re-populate memory cache
            this.memoryCache.set(key, parsed);
            return { data: parsed.data, cachedAt: parsed.expiry - this.defaultTTLMs };
          }
          window.localStorage.removeItem(`statintel_cache_${key}`);
        }
      } catch (err) {
        console.warn(`[CacheManager] Failed to read from localStorage:`, err);
      }
    }

    return null;
  }

  public set<T>(key: string, data: T, ttlMs: number = this.defaultTTLMs): void {
    const expiry = Date.now() + ttlMs;
    const entry: CacheEntry<T> = {
      data,
      expiry,
      timestamp: new Date().toISOString(),
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store in localStorage
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(`statintel_cache_${key}`, JSON.stringify(entry));
      } catch (err) {
        console.warn(`[CacheManager] Failed to write to localStorage:`, err);
      }
    }
  }

  public invalidate(key: string): void {
    this.memoryCache.delete(key);
    if (this.isBrowser()) {
      try {
        window.localStorage.removeItem(`statintel_cache_${key}`);
      } catch (err) {
        // silent
      }
    }
  }

  public clearAll(): void {
    this.memoryCache.clear();
    if (this.isBrowser()) {
      try {
        const keys = Object.keys(window.localStorage);
        for (const k of keys) {
          if (k.startsWith('statintel_cache_')) {
            window.localStorage.removeItem(k);
          }
        }
      } catch (err) {
        // silent
      }
    }
  }
}

export const cache = new CacheManager();
export default cache;
