// API Types based on KTTTTB documentation

export interface ApiResponse<T = any> {
  requestId: string;
  status: number;
  errorCode: string | null;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: boolean;
  errorCode: string;
  message: string;
  localizedMessage: string;
  status: number;
}

// Get OTP Request/Response
export interface GetOtpRequest {
  requestId: string;
  msisdn: string;
  paramDetail: ParamDetail[];
}

export interface ParamDetail {
  code: string;
  value: string;
}

export interface GetOtpResponse {
  sessionOtp: string;
}

// Verify OTP Request/Response
export interface VerifyOtpRequest {
  requestId: string;
  msisdn: string;
  otp: string;
  sessionOtp: string;
}

export interface VerifyOtpResponse {
  phoneNumber: string;
  businessCode: string;
  consentRef: string;
  timeToLife: number;
  expireTime: string;
}

// Get Data Request/Response
export interface GetDataRequest {
  requestId: string;
  msisdn: string;
  consentRef: string;
  paramDetail: ParamDetail[];
}

export interface GetDataResponse {
  results: ValidationResult[];
}

export interface ValidationResult {
  code: string;
  status: number;
  statusMessage: string;
}

// API Headers
export interface ApiHeaders extends Record<string, string> {
  'X-Tenant-Code': string;
  'X-Business-Code': string;
  'X-Timestamp': string;
  'X-Signature': string;
  'Content-Type': string;
}
