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

// Simple in-memory cache with 5 minute TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Base API URL
const BASE_URL = 'https://backendbadminton.pythonanywhere.com/api';

/**
 * Optimized fetch with caching
 */
export async function fetchWithCache<T>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = true
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}:${url}`;

  // Check cache first
  if (useCache && options.method === undefined || options.method === 'GET') {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
  }

  try {
    // Add performance timing
    const startTime = performance.now();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Add cache control for browser caching
      cache: 'default',
    });

    const fetchTime = performance.now() - startTime;
    console.log(`API fetch ${endpoint} took ${fetchTime.toFixed(2)}ms`);

    if (!response.ok) {
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
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
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

