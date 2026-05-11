// KTTTTB API Service - Real API implementation

import type {
  ApiResponse,
  GetOtpRequest,
  GetOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  GetDataRequest,
  GetDataResponse,
  ApiHeaders,
} from '../types/api';
import { generateSignature, generateTimestamp } from '../utils/signature';

const BASE_URL = 'https://dev-pubapi-kttttb.wiinvent-tv.com';

// Configuration - Update these with your actual credentials
// You can set these in .env file:
// VITE_TENANT_CODE=your_code
// VITE_BUSINESS_CODE=your_code
// VITE_SECRET_KEY=your_key
const API_CONFIG = {
  tenantCode: import.meta.env.VITE_TENANT_CODE || 'YOUR_TENANT_CODE',
  businessCode: import.meta.env.VITE_BUSINESS_CODE || 'YOUR_BUSINESS_CODE',
  secretKey: import.meta.env.VITE_SECRET_KEY || 'YOUR_SECRET_KEY',
};

class KTTTTBApiService {
  private tenantCode: string;
  private businessCode: string;
  private secretKey: string;

  constructor(tenantCode: string, businessCode: string, secretKey: string) {
    this.tenantCode = tenantCode;
    this.businessCode = businessCode;
    this.secretKey = secretKey;
  }

  private async createHeaders(
    method: string,
    uri: string,
    body: string
  ): Promise<ApiHeaders> {
    const timestamp = generateTimestamp();
    const signature = await generateSignature(
      method,
      uri,
      timestamp,
      body,
      this.secretKey
    );

    return {
      'X-Tenant-Code': this.tenantCode,
      'X-Business-Code': this.businessCode,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Step 1: Get OTP
   */
  async getOtp(request: GetOtpRequest): Promise<ApiResponse<GetOtpResponse>> {
    const uri = '/v1/tenant/get-otp';
    const body = JSON.stringify(request);
    const headers = await this.createHeaders('POST', uri, body);

    const response = await fetch(`${BASE_URL}${uri}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }

  /**
   * Step 2: Verify OTP
   */
  async verifyOtp(
    request: VerifyOtpRequest
  ): Promise<ApiResponse<VerifyOtpResponse>> {
    const uri = '/v1/tenant/verify-otp';
    const body = JSON.stringify(request);
    const headers = await this.createHeaders('POST', uri, body);

    const response = await fetch(`${BASE_URL}${uri}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }

  /**
   * Step 3: Get Data
   */
  async getData(request: GetDataRequest): Promise<ApiResponse<GetDataResponse>> {
    const uri = '/v1/tenant/get-data';
    const body = JSON.stringify(request);
    const headers = await this.createHeaders('POST', uri, body);

    const response = await fetch(`${BASE_URL}${uri}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  }
}

// Export singleton instance
export const kttttbApi = new KTTTTBApiService(
  API_CONFIG.tenantCode,
  API_CONFIG.businessCode,
  API_CONFIG.secretKey
);
