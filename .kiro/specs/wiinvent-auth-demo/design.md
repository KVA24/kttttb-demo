# Design Document: Wiinvent Authentication Demo

## Overview

This design document specifies the architecture and implementation approach for a React web application that demonstrates the Wiinvent subscriber information verification authentication flow. The application is a single-page application (SPA) that simulates a three-step authentication process with mock API responses.

### Key Design Goals

1. **Educational Demonstration**: Provide a clear, interactive demonstration of the Wiinvent authentication flow
2. **Type Safety**: Leverage TypeScript for compile-time type checking and better developer experience
3. **Maintainability**: Use modern React patterns (hooks, functional components) for clean, maintainable code
4. **User Experience**: Provide immediate feedback, clear error messages, and intuitive navigation
5. **Security Simulation**: Accurately implement HMAC-SHA256 signature generation to demonstrate API security

### Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development and build)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Fetch API (native browser API)
- **Crypto**: Web Crypto API for HMAC-SHA256 signature generation

## Architecture

### High-Level Architecture

The application follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + Tailwind CSS)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Business Logic + State Management)    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  (API Client + Signature Generation)    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Mock API Layer                  │
│  (Simulated Backend Responses)          │
└─────────────────────────────────────────┘
```

### Component Architecture

```
App
├── AuthFlowContainer
│   ├── StepIndicator
│   ├── Step1_GetOTP
│   │   ├── OTPRequestForm
│   │   └── ResponseDisplay
│   ├── Step2_VerifyOTP
│   │   ├── OTPVerificationForm
│   │   └── ResponseDisplay
│   ├── Step3_GetData
│   │   └── DataResultsDisplay
│   └── RequestHistoryPanel
└── ResetButton
```

## Components and Interfaces

### Core Components

#### 1. AuthFlowContainer

**Purpose**: Main container component that manages the authentication flow state and orchestrates the three steps.

**State**:
```typescript
interface AuthFlowState {
  currentStep: 1 | 2 | 3;
  sessionOtp: string | null;
  consentRef: string | null;
  timeToLife: number | null;
  expireTime: string | null;
  requestHistory: RequestHistoryItem[];
  isLoading: boolean;
  error: string | null;
}
```

**Responsibilities**:
- Manage overall workflow state
- Control step progression
- Store session data (session_otp, consent_ref)
- Maintain request/response history
- Handle reset functionality

#### 2. StepIndicator

**Purpose**: Visual indicator showing the current step and completion status.

**Props**:
```typescript
interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  completedSteps: number[];
}
```

**Responsibilities**:
- Display step numbers and labels
- Highlight current step
- Show completion status for each step

#### 3. Step1_GetOTP

**Purpose**: Component for the OTP request step.

**Props**:
```typescript
interface Step1Props {
  onSuccess: (sessionOtp: string, response: GetOTPResponse) => void;
  onError: (error: string) => void;
  isActive: boolean;
}
```

**Responsibilities**:
- Render MSISDN and param_detail input fields
- Validate form inputs
- Call get-otp API endpoint
- Display request/response details
- Handle loading and error states

#### 4. Step2_VerifyOTP

**Purpose**: Component for the OTP verification step.

**Props**:
```typescript
interface Step2Props {
  sessionOtp: string;
  onSuccess: (consentRef: string, timeToLife: number, expireTime: string, response: VerifyOTPResponse) => void;
  onError: (error: string) => void;
  isActive: boolean;
}
```

**Responsibilities**:
- Render OTP input field
- Validate OTP input
- Call verify-otp API endpoint
- Display request/response details
- Handle loading and error states

#### 5. Step3_GetData

**Purpose**: Component for the data retrieval step.

**Props**:
```typescript
interface Step3Props {
  consentRef: string;
  onSuccess: (response: GetDataResponse) => void;
  onError: (error: string) => void;
  isActive: boolean;
  autoTrigger: boolean;
}
```

**Responsibilities**:
- Automatically trigger get-data API call when activated
- Display verification results
- Display request/response details
- Handle loading and error states

#### 6. ResponseDisplay

**Purpose**: Reusable component for displaying API request/response details.

**Props**:
```typescript
interface ResponseDisplayProps {
  requestPayload: object;
  responseData: object | null;
  headers: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}
```

**Responsibilities**:
- Display formatted JSON for request payload
- Display formatted JSON for response data
- Display security headers (X-Signature, X-Timestamp)
- Show loading spinner
- Display error messages

#### 7. RequestHistoryPanel

**Purpose**: Display a history of all API requests made during the session.

**Props**:
```typescript
interface RequestHistoryPanelProps {
  history: RequestHistoryItem[];
}
```

**Responsibilities**:
- Display chronological list of requests
- Show request method, endpoint, timestamp
- Allow expanding to see full request/response details

## Data Models

### TypeScript Interfaces

```typescript
// Request Types
interface GetOTPRequest {
  request_id: string;
  msisdn: string;
  param_detail: {
    id_no: string;
  };
}

interface VerifyOTPRequest {
  request_id: string;
  session_otp: string;
  otp: string;
}

interface GetDataRequest {
  request_id: string;
  consent_ref: string;
}

// Response Types
interface GetOTPResponse {
  code: string;
  message: string;
  data: {
    session_otp: string;
  };
}

interface VerifyOTPResponse {
  code: string;
  message: string;
  data: {
    consent_ref: string;
    time_to_life: number;
    expire_time: string;
  };
}

interface GetDataResponse {
  code: string;
  message: string;
  data: {
    results: Array<{
      code: string;
      status: string;
      status_message: string;
    }>;
  };
}

// Error Response Type
interface ErrorResponse {
  code: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Request History Item
interface RequestHistoryItem {
  id: string;
  timestamp: number;
  method: string;
  endpoint: string;
  requestPayload: object;
  responseData: object | null;
  headers: Record<string, string>;
  status: 'success' | 'error';
  error?: string;
}
```

## State Management

### State Management Strategy

The application uses React hooks for state management:

1. **Local Component State**: Each step component manages its own form state using `useState`
2. **Shared Application State**: The `AuthFlowContainer` manages shared state (session_otp, consent_ref, etc.)
3. **Prop Drilling**: State is passed down through props (acceptable for this small application)

### State Flow

```
User Input → Form State → Validation → API Call → Response → Update Shared State → Enable Next Step
```

### State Transitions

```
Initial State:
  currentStep: 1
  sessionOtp: null
  consentRef: null

After Get-OTP Success:
  currentStep: 2
  sessionOtp: "abc123"
  consentRef: null

After Verify-OTP Success:
  currentStep: 3
  sessionOtp: "abc123"
  consentRef: "xyz789"

After Get-Data Success:
  currentStep: 3 (complete)
  sessionOtp: "abc123"
  consentRef: "xyz789"
  dataResults: [...]

After Reset:
  → Return to Initial State
```

## API Integration Approach

### API Client Service

Create a dedicated `apiClient.ts` service module:

```typescript
// src/services/apiClient.ts

interface ApiClientConfig {
  baseUrl: string;
  tenantCode: string;
  businessCode: string;
  secretKey: string;
}

class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  async getOTP(request: GetOTPRequest): Promise<GetOTPResponse> {
    return this.makeRequest('/get-otp', 'POST', request);
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return this.makeRequest('/verify-otp', 'POST', request);
  }

  async getData(request: GetDataRequest): Promise<GetDataResponse> {
    return this.makeRequest('/get-data', 'POST', request);
  }

  private async makeRequest<T>(
    endpoint: string,
    method: string,
    body: object
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const requestBody = JSON.stringify(body);
    const signature = await this.generateSignature(method, endpoint, timestamp, requestBody);

    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-Code': this.config.tenantCode,
      'X-Business-Code': this.config.businessCode,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
    };

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method,
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData);
    }

    return response.json();
  }

  private async generateSignature(
    method: string,
    uri: string,
    timestamp: number,
    body: string
  ): Promise<string> {
    // Implementation in next section
  }
}
```

### Mock API Service

Create a `mockApiService.ts` that intercepts requests and returns mock responses:

```typescript
// src/services/mockApiService.ts

class MockApiService {
  private delay: number = 1000; // Simulate network delay

  async getOTP(request: GetOTPRequest): Promise<GetOTPResponse> {
    await this.simulateDelay();
    
    // Simulate success response
    return {
      code: '200',
      message: 'OTP sent successfully',
      data: {
        session_otp: this.generateSessionOtp(),
      },
    };
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    await this.simulateDelay();
    
    // Simulate success response
    const now = new Date();
    const expireTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    
    return {
      code: '200',
      message: 'OTP verified successfully',
      data: {
        consent_ref: this.generateConsentRef(),
        time_to_life: 300, // 5 minutes in seconds
        expire_time: expireTime.toISOString(),
      },
    };
  }

  async getData(request: GetDataRequest): Promise<GetDataResponse> {
    await this.simulateDelay();
    
    // Simulate success response
    return {
      code: '200',
      message: 'Data retrieved successfully',
      data: {
        results: [
          {
            code: '200',
            status: 'verified',
            status_message: 'Subscriber information verified successfully',
          },
        ],
      },
    };
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  private generateSessionOtp(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConsentRef(): string {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### API Service Factory

Create a factory that returns either the real API client or mock service:

```typescript
// src/services/apiServiceFactory.ts

const USE_MOCK_API = true; // Toggle for demo purposes

export function createApiService() {
  if (USE_MOCK_API) {
    return new MockApiService();
  } else {
    return new ApiClient({
      baseUrl: 'https://api.wiinvent.tv',
      tenantCode: 'DEMO_TENANT',
      businessCode: 'DEMO_BUSINESS',
      secretKey: 'demo_secret_key_12345',
    });
  }
}
```

## HMAC-SHA256 Signature Implementation

### Signature Generation Algorithm

The signature is generated using the following steps:

1. **Construct Payload**: Concatenate HTTP method, request URI, timestamp, and minified request body
2. **Compute HMAC**: Use HMAC-SHA256 with the secret key
3. **Convert to Hex**: Convert the binary hash to hexadecimal string

### Implementation

```typescript
// src/utils/signatureGenerator.ts

export async function generateSignature(
  method: string,
  uri: string,
  timestamp: number,
  requestBody: string,
  secretKey: string
): Promise<string> {
  // Step 1: Construct the payload
  const payload = `${method}${uri}${timestamp}${requestBody}`;
  
  // Step 2: Convert secret key and payload to Uint8Array
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(payload);
  
  // Step 3: Import the key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Step 4: Generate HMAC signature
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  
  // Step 5: Convert to hexadecimal string
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// Helper function to minify JSON (remove whitespace)
export function minifyJson(obj: object): string {
  return JSON.stringify(obj);
}
```

### Signature Verification (for testing)

```typescript
// src/utils/signatureGenerator.ts

export async function verifySignature(
  method: string,
  uri: string,
  timestamp: number,
  requestBody: string,
  secretKey: string,
  providedSignature: string
): Promise<boolean> {
  const computedSignature = await generateSignature(
    method,
    uri,
    timestamp,
    requestBody,
    secretKey
  );
  
  return computedSignature === providedSignature;
}
```

## UI/UX Flow

### User Journey

```
1. Landing Page
   ↓
2. Step 1: Get OTP
   - User enters MSISDN (phone number)
   - User enters ID number (param_detail.id_no)
   - User clicks "Request OTP"
   - System shows loading spinner
   - System displays response with session_otp
   ↓
3. Step 2: Verify OTP
   - Form becomes enabled
   - User enters OTP code
   - User clicks "Verify OTP"
   - System shows loading spinner
   - System displays response with consent_ref
   ↓
4. Step 3: Get Data
   - System automatically triggers data retrieval
   - System shows loading spinner
   - System displays verification results
   ↓
5. Complete
   - User can view all request/response history
   - User can click "Reset" to start over
```

### Visual Design Principles

1. **Progressive Disclosure**: Show only the current step's form, with completed steps collapsed but visible
2. **Clear Feedback**: Use color coding (green for success, red for error, blue for info)
3. **Loading States**: Show spinners during API calls to indicate progress
4. **Error Handling**: Display errors inline near the relevant form field or action
5. **Responsive Design**: Ensure the application works on desktop and tablet devices

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Header                               │
│  "Wiinvent Authentication Flow Demo"                    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              Step Indicator                             │
│  [1. Get OTP] → [2. Verify OTP] → [3. Get Data]       │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              Current Step Form                          │
│  (Input fields, buttons, validation messages)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              Response Display                           │
│  - Request Details (payload, headers)                   │
│  - Response Details (JSON formatted)                    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              Request History (Collapsible)              │
│  - List of all requests made in session                 │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    Footer                               │
│  [Reset Flow Button]                                    │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme

- **Primary**: Blue (#3B82F6) - for buttons and active states
- **Success**: Green (#10B981) - for successful operations
- **Error**: Red (#EF4444) - for error messages
- **Warning**: Yellow (#F59E0B) - for warnings
- **Neutral**: Gray (#6B7280) - for text and borders
- **Background**: White (#FFFFFF) and Light Gray (#F9FAFB)

## Error Handling

### Error Categories

1. **Validation Errors**: Client-side validation failures (empty fields, invalid format)
2. **Network Errors**: Failed to connect to API (timeout, no internet)
3. **4xx Errors**: Client errors (bad request, unauthorized, not found)
4. **5xx Errors**: Server errors (internal server error, service unavailable)

### Error Handling Strategy

```typescript
// src/utils/errorHandler.ts

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public response: ErrorResponse
  ) {
    super(response.message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode >= 400 && error.statusCode < 500) {
      // 4xx errors - show specific error message
      return error.response.message;
    } else if (error.statusCode >= 500) {
      // 5xx errors - show generic server error
      return 'Server error occurred. Please try again later.';
    }
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    // Network error
    return 'Network error. Please check your internet connection.';
  }
  
  // Unknown error
  return 'An unexpected error occurred. Please try again.';
}
```

### Error Display

- **Inline Errors**: Display validation errors below the relevant form field
- **Alert Banners**: Display API errors in a prominent banner above the form
- **Console Logging**: Log all errors to console for debugging

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This application is primarily a UI demonstration tool, so most testing will be example-based integration tests. However, the signature generation and request ID generation utilities are pure functions suitable for property-based testing.

### Property 1: Signature Determinism

*For any* given input tuple (HTTP method, request URI, timestamp, request body, secret key), the signature generation function SHALL always produce the same HMAC-SHA256 signature output when called multiple times.

**Validates: Requirements 4.2, 4.4**

### Property 2: Signature Format Validity

*For any* valid input tuple (HTTP method, request URI, timestamp, request body, secret key), the generated signature SHALL be a valid hexadecimal string of exactly 64 characters.

**Validates: Requirements 4.2, 4.4**

### Property 3: Signature Uniqueness

*For any* two different input tuples (where at least one component differs), the generated signatures SHALL be different, demonstrating the cryptographic property of HMAC-SHA256.

**Validates: Requirements 4.2, 4.4**

### Property 4: Payload Construction Order

*For any* valid HTTP method, request URI, timestamp, and request body, the signature payload SHALL be constructed in the exact order: METHOD + URI + TIMESTAMP + BODY (minified JSON).

**Validates: Requirements 4.3**

### Property 5: Request ID Uniqueness

*For any* sequence of generated request IDs (regardless of sequence length), all request IDs SHALL be unique with no duplicates.

**Validates: Requirements 11.1, 11.5**

### Property 6: Request ID Format

*For any* generated request ID, it SHALL match the format pattern `req_{timestamp}_{random}` where timestamp is a valid Unix timestamp and random is an alphanumeric string.

**Validates: Requirements 11.2**

## Testing Strategy

### Testing Approach

This application is primarily a UI demonstration tool with mock API responses. The testing strategy focuses on:

1. **Unit Tests**: Test individual utility functions and components
2. **Property-Based Tests**: Test universal properties of pure functions (signature generation, request ID generation)
3. **Integration Tests**: Test component interactions and API service integration
4. **Manual Testing**: Test the complete user flow end-to-end

### Property-Based Testing

**PBT Library**: Use `fast-check` for JavaScript/TypeScript property-based testing

**Test Configuration**:
- Minimum 100 iterations per property test
- Each property test must reference its design document property using a comment tag
- Tag format: `// Feature: wiinvent-auth-demo, Property {number}: {property_text}`

**Property Test Coverage**:

```typescript
// src/utils/__tests__/signatureGenerator.property.test.ts

import fc from 'fast-check';
import { generateSignature, constructPayload } from '../signatureGenerator';

describe('Signature Generation Properties', () => {
  // Feature: wiinvent-auth-demo, Property 1: Signature Determinism
  it('should generate the same signature for the same inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        fc.webUrl(),
        fc.integer({ min: 1000000000, max: 9999999999 }),
        fc.jsonValue(),
        fc.string({ minLength: 10, maxLength: 50 }),
        async (method, uri, timestamp, body, secret) => {
          const bodyStr = JSON.stringify(body);
          const sig1 = await generateSignature(method, uri, timestamp, bodyStr, secret);
          const sig2 = await generateSignature(method, uri, timestamp, bodyStr, secret);
          expect(sig1).toBe(sig2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: wiinvent-auth-demo, Property 2: Signature Format Validity
  it('should always generate a valid 64-character hex string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        fc.webUrl(),
        fc.integer({ min: 1000000000, max: 9999999999 }),
        fc.jsonValue(),
        fc.string({ minLength: 10, maxLength: 50 }),
        async (method, uri, timestamp, body, secret) => {
          const bodyStr = JSON.stringify(body);
          const signature = await generateSignature(method, uri, timestamp, bodyStr, secret);
          expect(signature).toMatch(/^[a-f0-9]{64}$/);
          expect(signature.length).toBe(64);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: wiinvent-auth-demo, Property 3: Signature Uniqueness
  it('should generate different signatures for different inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        fc.webUrl(),
        fc.integer({ min: 1000000000, max: 9999999999 }),
        fc.jsonValue(),
        fc.string({ minLength: 10, maxLength: 50 }),
        fc.integer({ min: 1, max: 100 }), // variation factor
        async (method, uri, timestamp, body, secret, variation) => {
          const bodyStr = JSON.stringify(body);
          const sig1 = await generateSignature(method, uri, timestamp, bodyStr, secret);
          // Change one input parameter
          const sig2 = await generateSignature(method, uri, timestamp + variation, bodyStr, secret);
          expect(sig1).not.toBe(sig2);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: wiinvent-auth-demo, Property 4: Payload Construction Order
  it('should construct payload in correct order: METHOD + URI + TIMESTAMP + BODY', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('GET', 'POST', 'PUT', 'DELETE'),
        fc.webUrl(),
        fc.integer({ min: 1000000000, max: 9999999999 }),
        fc.jsonValue(),
        (method, uri, timestamp, body) => {
          const bodyStr = JSON.stringify(body);
          const payload = constructPayload(method, uri, timestamp, bodyStr);
          const expected = `${method}${uri}${timestamp}${bodyStr}`;
          expect(payload).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// src/utils/__tests__/requestIdGenerator.property.test.ts

import fc from 'fast-check';
import { generateRequestId } from '../requestIdGenerator';

describe('Request ID Generation Properties', () => {
  // Feature: wiinvent-auth-demo, Property 5: Request ID Uniqueness
  it('should generate unique request IDs in a sequence', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        (count) => {
          const ids = Array.from({ length: count }, () => generateRequestId());
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: wiinvent-auth-demo, Property 6: Request ID Format
  it('should generate request IDs matching the expected format', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // No input needed, just generate IDs
        () => {
          const id = generateRequestId();
          expect(id).toMatch(/^req_\d+_[a-z0-9]+$/);
          
          // Verify timestamp part is valid
          const parts = id.split('_');
          expect(parts[0]).toBe('req');
          expect(parseInt(parts[1])).toBeGreaterThan(1000000000000); // Valid timestamp
          expect(parts[2]).toMatch(/^[a-z0-9]+$/); // Valid random part
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

**Test Coverage**:
- JSON minification utility
- Error handling utility
- Form validation logic
- Mock API service responses

**Example Unit Tests**:

```typescript
// src/utils/__tests__/errorHandler.test.ts

describe('handleApiError', () => {
  it('should return specific message for 4xx errors', () => {
    const error = new ApiError(400, { code: '400', message: 'Invalid request' });
    const message = handleApiError(error);
    expect(message).toBe('Invalid request');
  });
  
  it('should return generic message for 5xx errors', () => {
    const error = new ApiError(500, { code: '500', message: 'Internal error' });
    const message = handleApiError(error);
    expect(message).toBe('Server error occurred. Please try again later.');
  });
  
  it('should return network error message for fetch errors', () => {
    const error = new TypeError('Failed to fetch');
    const message = handleApiError(error);
    expect(message).toBe('Network error. Please check your internet connection.');
  });
});

describe('minifyJson', () => {
  it('should remove whitespace from JSON', () => {
    const obj = { key: 'value', nested: { prop: 123 } };
    const result = minifyJson(obj);
    
    expect(result).toBe('{"key":"value","nested":{"prop":123}}');
    expect(result).not.toContain(' ');
    expect(result).not.toContain('\n');
  });
});
```

### Integration Testing

**Test Coverage**:
- Form submission triggers API call
- Successful API response updates state
- Error response displays error message
- Step progression after successful completion
- Reset functionality clears all state

**Example Integration Tests**:

```typescript
// src/components/__tests__/AuthFlowContainer.test.tsx

describe('AuthFlowContainer', () => {
  it('should progress to step 2 after successful OTP request', async () => {
    render(<AuthFlowContainer />);
    
    // Fill in step 1 form
    fireEvent.change(screen.getByLabelText('MSISDN'), {
      target: { value: '0123456789' }
    });
    fireEvent.change(screen.getByLabelText('ID Number'), {
      target: { value: 'ID123456' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Request OTP'));
    
    // Wait for API call and state update
    await waitFor(() => {
      expect(screen.getByText('Step 2: Verify OTP')).toBeInTheDocument();
    });
  });
  
  it('should display error message on API failure', async () => {
    // Mock API to return error
    mockApiService.getOTP.mockRejectedValue(
      new ApiError(400, { code: '400', message: 'Invalid MSISDN' })
    );
    
    render(<AuthFlowContainer />);
    
    // Submit form
    fireEvent.click(screen.getByText('Request OTP'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid MSISDN')).toBeInTheDocument();
    });
  });
});
```

### Manual Testing Checklist

- [ ] Step 1: Enter valid MSISDN and ID, verify OTP request succeeds
- [ ] Step 1: Enter invalid data, verify validation errors appear
- [ ] Step 2: Enter valid OTP, verify verification succeeds
- [ ] Step 2: Enter invalid OTP, verify error message appears
- [ ] Step 3: Verify data retrieval happens automatically
- [ ] Step 3: Verify results are displayed correctly
- [ ] Verify request history shows all requests
- [ ] Verify reset button clears all state and returns to step 1
- [ ] Verify loading spinners appear during API calls
- [ ] Verify signature generation produces valid hex strings
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test responsive design on tablet size

### Mock API Testing Scenarios

The mock API service should support these test scenarios:

1. **Success Path**: All requests succeed with valid responses
2. **Invalid MSISDN**: get-otp returns 400 error
3. **Invalid OTP**: verify-otp returns 400 error
4. **Expired Session**: verify-otp returns 400 error for expired session_otp
5. **Invalid Consent**: get-data returns 400 error for invalid consent_ref
6. **Server Error**: Any endpoint returns 500 error

## Implementation Notes

### Project Structure

```
src/
├── components/
│   ├── AuthFlowContainer.tsx
│   ├── StepIndicator.tsx
│   ├── Step1_GetOTP.tsx
│   ├── Step2_VerifyOTP.tsx
│   ├── Step3_GetData.tsx
│   ├── ResponseDisplay.tsx
│   └── RequestHistoryPanel.tsx
├── services/
│   ├── apiClient.ts
│   ├── mockApiService.ts
│   └── apiServiceFactory.ts
├── utils/
│   ├── signatureGenerator.ts
│   ├── errorHandler.ts
│   └── requestIdGenerator.ts
├── types/
│   ├── api.types.ts
│   └── state.types.ts
├── App.tsx
└── main.tsx
```

### Configuration Management

Store configuration in a separate file:

```typescript
// src/config/apiConfig.ts

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.wiinvent.tv',
  tenantCode: import.meta.env.VITE_TENANT_CODE || 'DEMO_TENANT',
  businessCode: import.meta.env.VITE_BUSINESS_CODE || 'DEMO_BUSINESS',
  secretKey: import.meta.env.VITE_SECRET_KEY || 'demo_secret_key_12345',
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true' || true,
};
```

### Request ID Generation

```typescript
// src/utils/requestIdGenerator.ts

export function generateRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `req_${timestamp}_${random}`;
}
```

### Performance Considerations

1. **Lazy Loading**: Not needed for this small application
2. **Memoization**: Use `useMemo` for expensive computations (signature generation)
3. **Debouncing**: Not needed as there are no real-time search/filter features
4. **Code Splitting**: Not needed for this small application

### Accessibility Considerations

1. **Semantic HTML**: Use proper HTML elements (form, button, input)
2. **Labels**: Associate labels with form inputs using `htmlFor`
3. **ARIA Attributes**: Add `aria-label` for icon buttons, `aria-live` for dynamic content
4. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
5. **Focus Management**: Move focus to next step after successful completion

### Browser Compatibility

- **Target Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge) - last 2 versions
- **Web Crypto API**: Supported in all modern browsers
- **Fetch API**: Supported in all modern browsers
- **ES6+ Features**: Transpiled by Vite for broader compatibility

## Deployment Considerations

### Build Configuration

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
```

### Environment Variables

```bash
# .env.example

VITE_API_BASE_URL=https://api.wiinvent.tv
VITE_TENANT_CODE=DEMO_TENANT
VITE_BUSINESS_CODE=DEMO_BUSINESS
VITE_SECRET_KEY=demo_secret_key_12345
VITE_USE_MOCK_API=true
```

### Static Hosting

The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Build command: `npm run build`
Output directory: `dist`

## Future Enhancements

Potential improvements for future iterations:

1. **Real API Integration**: Connect to actual Wiinvent API endpoints
2. **Error Scenario Selector**: UI to select different mock error scenarios
3. **Request Replay**: Ability to replay previous requests
4. **Export Functionality**: Export request/response history as JSON or CSV
5. **Dark Mode**: Add dark mode theme support
6. **Internationalization**: Support multiple languages (Vietnamese, English)
7. **Advanced Validation**: More sophisticated input validation (phone number format, ID format)
8. **Session Persistence**: Save session state to localStorage for page refresh recovery
9. **API Documentation**: Embedded API documentation viewer
10. **Performance Metrics**: Display API response times and performance metrics
