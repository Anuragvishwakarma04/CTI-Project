import { NextRequest, NextResponse } from 'next/server';
import { getSession, checkRateLimit } from './auth';

// API Response wrapper
export function apiResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// Authentication middleware
export async function requireAuth(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return { error: apiError('Unauthorized', 401), user: null };
  }
  return { error: null, user: session };
}

// Role-based access
export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const { error, user } = await requireAuth(request);
  if (error) return { error, user: null };
  
  if (!allowedRoles.includes(user.role as string)) {
    return { error: apiError('Forbidden', 403), user: null };
  }
  return { error: null, user };
}

// Rate limiting middleware
export function withRateLimit(handler: Function, limit: number = 10) {
  return async (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip, limit)) {
      return apiError('Too many requests', 429);
    }
    
    return handler(request);
  };
}

// Input validation schemas
export const validators = {
  mobile: (value: string) => /^[6-9]\d{9}$/.test(value),
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  price: (value: number) => value > 0 && value < 100000000,
  year: (value: number) => value >= 2000 && value <= new Date().getFullYear(),
  mileage: (value: number) => value >= 0 && value < 1000000,
  otp: (value: string) => /^\d{6}$/.test(value),
};

// Sanitize object
export function sanitizeObject(obj: any, allowedFields: string[]) {
  const sanitized: any = {};
  allowedFields.forEach(field => {
    if (obj[field] !== undefined) {
      sanitized[field] = typeof obj[field] === 'string' 
        ? obj[field].trim().slice(0, 1000) 
        : obj[field];
    }
  });
  return sanitized;
}

// CORS headers
export function corsHeaders(origin?: string) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const isAllowed = origin && allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// SQL Injection prevention
export function escapeSql(value: string): string {
  return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0';
      case '\x08': return '\\b';
      case '\x09': return '\\t';
      case '\x1a': return '\\z';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default: return char;
    }
  });
}

// XSS prevention
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
