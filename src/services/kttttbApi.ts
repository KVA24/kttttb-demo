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

class KTTTTBApiService {
  private tenantCode: string;
  private businessCode: string;
  private secretKey: string;

  constructor(tenantCode: string, businessCode: string, secretKey: string) {
    this.tenantCode = tenantCode;
    this.businessCode = businessCode;
    this.secretKey = secretKey;
  }

  // Update configuration
  updateConfig(tenantCode: string, businessCode: string, secretKey: string) {
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

// Default configuration from env or defaults
const DEFAULT_CONFIG = {
  tenantCode: import.meta.env.VITE_TENANT_CODE || 'MB',
  businessCode: import.meta.env.VITE_BUSINESS_CODE || 'PHT',
  secretKey: import.meta.env.VITE_SECRET_KEY || '1e112e3a364fd3a5454f4e98d8e908d1eb14ce32fa659961b1c99969c3e73813',
};

// Export singleton instance with default config
export const kttttbApi = new KTTTTBApiService(
  DEFAULT_CONFIG.tenantCode,
  DEFAULT_CONFIG.businessCode,
  DEFAULT_CONFIG.secretKey
);

export { DEFAULT_CONFIG };
