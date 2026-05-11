import { useState } from 'react';
import './ApiDocs.css';

export function ApiDocs() {
  const [activeTab, setActiveTab] = useState<'get-otp' | 'verify-otp' | 'get-data'>('get-otp');

  return (
    <div className="api-docs">
      <div className="docs-header">
        <h2>📚 API Documentation</h2>
        <p>Tài liệu API KTTTTB - Kiểm tra thông tin thuê bao</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'get-otp' ? 'active' : ''}`}
          onClick={() => setActiveTab('get-otp')}
        >
          1. Get OTP
        </button>
        <button
          className={`tab ${activeTab === 'verify-otp' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify-otp')}
        >
          2. Verify OTP
        </button>
        <button
          className={`tab ${activeTab === 'get-data' ? 'active' : ''}`}
          onClick={() => setActiveTab('get-data')}
        >
          3. Get Data
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'get-otp' && (
          <div className="api-section">
            <h3>Get OTP</h3>
            <p className="description">
              Tạo mã OTP để gửi đến user, phục vụ cho việc xác thực đồng ý cung cấp thông tin
            </p>

            <div className="endpoint">
              <span className="method post">POST</span>
              <code>/v1/tenant/get-otp</code>
            </div>

            <h4>Headers</h4>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Header</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>X-Tenant-Code</code></td>
                  <td>Chuỗi code định danh cho tenant</td>
                </tr>
                <tr>
                  <td><code>X-Business-Code</code></td>
                  <td>Chuỗi code định danh cho 1 nghiệp vụ của tenant</td>
                </tr>
                <tr>
                  <td><code>X-Timestamp</code></td>
                  <td>Thời gian hiện tại (Unix Timestamp millisecond)</td>
                </tr>
                <tr>
                  <td><code>X-Signature</code></td>
                  <td>Chữ ký điện tử dùng thuật toán HMAC-SHA256</td>
                </tr>
              </tbody>
            </table>

            <h4>Request Body</h4>
            <pre className="code-block">
{`{
  "requestId": "207cd179-157a-4f14-a23a-7bae06029efb",
  "msisdn": "0389916092",
  "paramDetail": [
    {
      "code": "id_no",
      "value": "025147886677"
    }
  ]
}`}
            </pre>

            <h4>Response (Success)</h4>
            <pre className="code-block">
{`{
  "requestId": "b20fa71e-0036-44b3-a3be-7d5846e015c9",
  "status": 0,
  "errorCode": "SUCCESS",
  "message": "Thành công",
  "data": {
    "sessionOtp": "1774408031166_735134"
  }
}`}
            </pre>
          </div>
        )}

        {activeTab === 'verify-otp' && (
          <div className="api-section">
            <h3>Verify OTP</h3>
            <p className="description">
              Kiểm tra OTP xác thực đồng ý chia sẻ thông tin
            </p>

            <div className="endpoint">
              <span className="method post">POST</span>
              <code>/v1/tenant/verify-otp</code>
            </div>

            <h4>Request Body</h4>
            <pre className="code-block">
{`{
  "requestId": "207cd179-157a-4f14-a23a-7bae06029efb",
  "msisdn": "0389916092",
  "otp": "123456",
  "sessionOtp": "1773224039134_698698"
}`}
            </pre>

            <h4>Response (Success)</h4>
            <pre className="code-block">
{`{
  "requestId": "b20fa71e-0036-44b3-a3be-7d5846e015c9",
  "status": 0,
  "errorCode": "SUCCESS",
  "message": "Thành công",
  "data": {
    "phoneNumber": "389916092",
    "businessCode": "PHT",
    "consentRef": "CONSENT-17744080466092",
    "timeToLife": 50,
    "expireTime": "2026-03-25T10:57:26.241488"
  }
}`}
            </pre>

            <h4>Response (Error - Wrong OTP)</h4>
            <pre className="code-block error">
{`{
  "success": false,
  "errorCode": "CM_0028",
  "message": "OTP verification failed.",
  "localizedMessage": "OTP verification failed.",
  "status": 400
}`}
            </pre>
          </div>
        )}

        {activeTab === 'get-data' && (
          <div className="api-section">
            <h3>Get Data</h3>
            <p className="description">
              Lấy dữ liệu xác thực thông tin thuê bao
            </p>

            <div className="endpoint">
              <span className="method post">POST</span>
              <code>/v1/tenant/get-data</code>
            </div>

            <h4>Request Body</h4>
            <pre className="code-block">
{`{
  "requestId": "207cd179-157a-4f14-a23a-7bae06029efb",
  "msisdn": "0389916092",
  "consentRef": "CONSENT-17744080466092",
  "paramDetail": [
    {
      "code": "id_no",
      "value": "025147886677"
    }
  ]
}`}
            </pre>

            <h4>Response (Success)</h4>
            <pre className="code-block">
{`{
  "requestId": "207cd179-157a-4f14-a23a-7bae06029efb",
  "status": 0,
  "errorCode": null,
  "message": "Thành công",
  "data": {
    "results": [
      {
        "code": "id_no",
        "status": 1,
        "statusMessage": "Khớp thông tin khách hàng"
      }
    ]
  }
}`}
            </pre>

            <h4>Validation Status</h4>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>1</code></td>
                  <td>✅ Khớp (Match)</td>
                </tr>
                <tr>
                  <td><code>0</code></td>
                  <td>❌ Không khớp (Mismatch)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="signature-info">
        <h4>🔐 Signature Generation (HMAC-SHA256)</h4>
        <p>Payload = HTTP_METHOD + REQUEST_URI + TIMESTAMP + REQUEST_BODY</p>
        <pre className="code-block">
{`// Example
const payload = "POST/v1/tenant/get-otp1747440803116" + 
                '{"requestId":"...","msisdn":"..."}';
const signature = HMAC_SHA256(payload, API_SECRET);`}
        </pre>
      </div>
    </div>
  );
}
