// Security utilities and validation helpers

/**
 * Validates image data URL format and type
 */
export function validateImageDataUrl(dataUrl: string): {
  valid: boolean;
  error?: string;
  mimeType?: string;
  size?: number;
} {
  // Check if it's a data URL
  if (!dataUrl.startsWith('data:image/')) {
    return { valid: false, error: 'Format d\'image invalide' };
  }

  // Extract MIME type
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches) {
    return { valid: false, error: 'Format de données invalide' };
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  // Allow only specific image types (no SVG to prevent XSS)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: 'Type d\'image non autorisé. Utilisez JPG, PNG ou WebP',
    };
  }

  // Calculate size in bytes (base64 is ~1.37x larger than original)
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

  if (sizeInBytes > maxSizeInBytes) {
    return {
      valid: false,
      error: 'Image trop grande. Maximum 2MB',
    };
  }

  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(base64Data)) {
    return { valid: false, error: 'Données base64 invalides' };
  }

  return {
    valid: true,
    mimeType,
    size: sizeInBytes,
  };
}

/**
 * Validates file upload
 */
export function validateFileUpload(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
}): {
  valid: boolean;
  error?: string;
} {
  const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
  const allowedTypes = options.allowedTypes || [];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop grand. Maximum ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes string input to prevent XSS
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

/**
 * Validates JSON string safely
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

/**
 * Generate security headers for Next.js
 */
export const SECURITY_HEADERS = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

/**
 * Content Security Policy
 */
export const CSP_HEADER = {
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://*.clerk.accounts.dev https://clerk.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev https://clerk.com wss://*.clerk.accounts.dev",
    "frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com https://*.clerk.accounts.dev",
  ].join('; '),
};
