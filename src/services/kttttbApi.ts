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
import { getTenantCode, getBusinessCode, getSecretKey } from '../utils/urlParams';

const BASE_URL = 'https://dev-pubapi-kttttb.wiinvent-tv.com';

// Configuration priority:
// 1. URL params (tenantCode, businessCode)
// 2. Environment variables (.env file)
// 3. Default values
const API_CONFIG = {
  tenantCode: getTenantCode(),
  businessCode: getBusinessCode(),
  secretKey: getSecretKey(),
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
