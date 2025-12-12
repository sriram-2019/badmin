// Optimized API utility with caching and error handling

interface CacheEntry {
  data: any;
  timestamp: number;
}

// API Response Types
export interface CompletedEvent {
  id: number;
  event_name: string;
  event_conducted_date: string;
  poster: string | null;
  created_at: string;
}

export interface EventResult {
  id: number;
  event_name: string;
  event_date: string;
  winner: string;
  images: Array<{
    id: number;
    image: string;
    image_order: number;
  }>;
  created_at: string;
}

export interface UpcomingEvent {
  id: number | string;
  event_name: string;
  registration_from: string;
  registration_to: string;
  registration_deadline_time?: string | null;
  event_from: string;
  event_to?: string | null;
  event_time?: string | null;
  event_place: string;
  age_limit?: string;
  categories?: string;
  category_times?: string;
  entry_fee?: string | number | null;
  winner_prize?: string;
  runner_prize?: string;
  semifinalist_prize?: string;
  other_awards?: string;
  rules?: string;
  poster?: string | null;
  description?: string;
  created_at?: string;
}

// Simple in-memory cache with 15 minute TTL (optimized for performance)
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Request deduplication - prevent duplicate concurrent requests
const pendingRequests = new Map<string, Promise<any>>();

// Base API URL
const BASE_URL = 'https://backendbadminton.pythonanywhere.com/api';

/**
 * Optimized fetch with caching, deduplication, and retry logic
 */
export async function fetchWithCache<T>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = true,
  retries: number = 2
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}:${url}`;

  // Check cache first (stale-while-revalidate pattern)
  if (useCache && (options.method === undefined || options.method === 'GET')) {
    const cached = cache.get(cacheKey);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      // Return cached data if fresh (< 15 min)
      if (age < CACHE_TTL) {
        return cached.data as T;
      }
      // If stale but exists, return it and refresh in background
      if (age < CACHE_TTL * 2) {
        // Refresh in background without blocking
        fetchWithCache<T>(endpoint, options, false, 0).catch(() => {});
        return cached.data as T;
      }
    }
  }

  // Check for pending request (deduplication)
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  // Create the request promise
  const requestPromise = (async () => {
    try {
      const startTime = performance.now();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // Optimize caching
        cache: 'default',
        // Keep connection alive for faster subsequent requests
        keepalive: true,
      });

      const fetchTime = performance.now() - startTime;
      
      if (fetchTime > 1000) {
        console.warn(`Slow API fetch ${endpoint}: ${fetchTime.toFixed(2)}ms`);
      }

      if (!response.ok) {
        // Retry on 5xx errors
        if (response.status >= 500 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          return fetchWithCache<T>(endpoint, options, useCache, retries - 1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache GET requests
      if (useCache && (options.method === undefined || options.method === 'GET')) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      return data as T;
    } catch (error) {
      // Retry on network errors
      if (retries > 0 && error instanceof TypeError) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithCache<T>(endpoint, options, useCache, retries - 1);
      }
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  })();

  // Store pending request for deduplication
  pendingRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

/**
 * Clear cache for a specific endpoint or all cache
 */
export function clearCache(endpoint?: string) {
  if (endpoint) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    // Remove all cache entries for this endpoint
    for (const key of cache.keys()) {
      if (key.includes(url)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

/**
 * Fetch completed events with caching
 */
export async function fetchCompletedEvents(): Promise<CompletedEvent[]> {
  return fetchWithCache<CompletedEvent[]>('/completed-events/');
}

/**
 * Fetch upcoming events with caching
 */
export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
  return fetchWithCache<UpcomingEvent[]>('/events/?upcoming=true');
}

/**
 * Fetch event results with caching
 */
export async function fetchEventResults(): Promise<EventResult[]> {
  return fetchWithCache<EventResult[]>('/event-results/');
}

/**
 * Fetch single completed event
 */
export async function fetchCompletedEvent(id: number): Promise<CompletedEvent> {
  return fetchWithCache<CompletedEvent>(`/completed-events/${id}/`);
}

/**
 * Fetch all events (upcoming + completed) - optimized for parallel requests
 */
export async function fetchAllEvents() {
  const [upcoming, completed] = await Promise.all([
    fetchUpcomingEvents().catch(() => []),
    fetchCompletedEvents().catch(() => []),
  ]);
  return { upcoming, completed };
}

/**
 * Fetch events list
 */
export async function fetchEvents(): Promise<UpcomingEvent[]> {
  return fetchWithCache<UpcomingEvent[]>('/events/');
}

/**
 * POST request helper with optimized caching
 */
export async function postRequest<T>(endpoint: string, data: any): Promise<T> {
  // Clear cache for related GET endpoints after POST
  clearCache(endpoint);
  
  return fetchWithCache<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }, false);
}

/**
 * PUT request helper
 */
export async function putRequest<T>(endpoint: string, data: any): Promise<T> {
  clearCache(endpoint);
  
  return fetchWithCache<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, false);
}

/**
 * DELETE request helper
 */
export async function deleteRequest<T>(endpoint: string): Promise<T> {
  clearCache(endpoint);
  
  return fetchWithCache<T>(endpoint, {
    method: 'DELETE',
  }, false);
}

