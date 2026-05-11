// Signature generation utilities based on KTTTTB documentation

/**
 * Generate HMAC-SHA256 signature for API requests
 * Payload = HTTP_METHOD + REQUEST_URI + TIMESTAMP + REQUEST_BODY
 */
export async function generateSignature(
  method: string,
  uri: string,
  timestamp: string,
  body: string,
  secretKey: string
): Promise<string> {
  // Remove all whitespace, tabs, and newlines from body
  const cleanBody = body.replace(/\s+/g, '');
  
  // Create payload
  const payload = `${method.toUpperCase()}${uri}${timestamp}${cleanBody}`;
  
  // Convert secret key to bytes
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  
  // Import key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign the payload
  const payloadData = encoder.encode(payload);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, payloadData);
  
  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate Unix timestamp in milliseconds
 */
export function generateTimestamp(): string {
  return Date.now().toString();
}

/**
 * Generate UUID v4 for requestId
 */
export function generateRequestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
