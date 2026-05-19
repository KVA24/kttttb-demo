import { useState } from 'react';
import { kttttbApi } from '../services/kttttbApi';
import { generateRequestId } from '../utils/signature';
import type { ErrorResponse, ParamDetail } from '../types/api';
import './VerificationFlow.css';

type Step = 'phone' | 'otp' | 'data' | 'result';

interface VerificationState {
  step: Step;
  phoneNumber: string;
  sessionOtp: string;
  otp: string;
  consentRef: string;
  expireTime: string;
  timeToLife: number;
  paramDetails: ParamDetail[];
  validationResults: Array<{
    code: string;
    status: number;
    statusMessage: string;
  }>;
  loading: boolean;
  error: string | null;
}

export function VerificationFlow() {
  const [state, setState] = useState<VerificationState>({
    step: 'phone',
    phoneNumber: '',
    sessionOtp: '',
    otp: '',
    consentRef: '',
    expireTime: '',
    timeToLife: 0,
    paramDetails: [{ code: 'id_no', value: '' }],
    validationResults: [],
    loading: false,
    error: null,
  });



  const handleError = (error: any) => {
    const errorResponse = error as ErrorResponse;
    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorResponse.localizedMessage || errorResponse.message || 'Có lỗi xảy ra',
    }));
  };

  const handleGetOtp = async () => {
    if (!state.phoneNumber || state.phoneNumber.length < 10) {
      setState((prev) => ({ ...prev, error: 'Vui lòng nhập số điện thoại hợp lệ' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await kttttbApi.getOtp({
        requestId: generateRequestId(),
        msisdn: state.phoneNumber,
        paramDetail: state.paramDetails,
      });

      setState((prev) => ({
        ...prev,
        sessionOtp: response.data!.sessionOtp,
        step: 'otp',
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!state.otp || state.otp.length !== 6) {
      setState((prev) => ({ ...prev, error: 'Vui lòng nhập mã OTP 6 số' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await kttttbApi.verifyOtp({
        requestId: generateRequestId(),
        msisdn: state.phoneNumber,
        otp: state.otp,
        sessionOtp: state.sessionOtp,
      });

      setState((prev) => ({
        ...prev,
        consentRef: response.data!.consentRef,
        expireTime: response.data!.expireTime,
        timeToLife: response.data!.timeToLife,
        step: 'data',
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleGetData = async () => {
    const hasEmptyValue = state.paramDetails.some((p) => !p.value.trim());
    if (hasEmptyValue) {
      setState((prev) => ({ ...prev, error: 'Vui lòng nhập đầy đủ thông tin' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await kttttbApi.getData({
        requestId: generateRequestId(),
        msisdn: state.phoneNumber,
        consentRef: state.consentRef,
        paramDetail: state.paramDetails,
      });

      setState((prev) => ({
        ...prev,
        validationResults: response.data!.results,
        step: 'result',
        loading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleReset = () => {
    setState({
      step: 'phone',
      phoneNumber: '',
      sessionOtp: '',
      otp: '',
      consentRef: '',
      expireTime: '',
      timeToLife: 0,
      paramDetails: [{ code: 'id_no', value: '' }],
      validationResults: [],
      loading: false,
      error: null,
    });
  };

  // Available field options
  const availableFieldOptions = [
    { code: 'id_no', label: 'Số CMND/CCCD' },
    { code: 'customer_full_name', label: 'Họ và tên đầy đủ' },
    { code: 'birth_day', label: 'Ngày sinh' },
    { code: 'id_issue_date', label: 'Ngày cấp CMND/CCCD' },
    { code: 'gender', label: 'Giới tính' },
    { code: 'nationality', label: 'Quốc tịch' },
    { code: 'permanent_address', label: 'Địa chỉ thường trú' },
    { code: 'id_expiry_date', label: 'Ngày hết hạn CCCD' },
    { code: 'id_issue_place', label: 'Nơi cấp CCCD' },
  ];

  // Get available options for a specific index (exclude already selected)
  const getAvailableOptions = (currentIndex: number) => {
    const selectedCodes = state.paramDetails
      .map((p, i) => (i !== currentIndex ? p.code : null))
      .filter(Boolean);
    return availableFieldOptions.filter((opt) => !selectedCodes.includes(opt.code));
  };

  const addParamDetail = () => {
    const availableOptions = getAvailableOptions(state.paramDetails.length);
    if (availableOptions.length === 0) {
      setState((prev) => ({ ...prev, error: 'Đã chọn hết các trường thông tin' }));
      return;
    }
    setState((prev) => ({
      ...prev,
      paramDetails: [...prev.paramDetails, { code: '', value: '' }],
      error: null,
    }));
  };

  const isDateField = (code: string) => {
    return ['birth_day', 'id_issue_date', 'id_expiry_date'].includes(code);
  };

  const updateParamDetail = (index: number, field: 'code' | 'value', value: string) => {
    setState((prev) => ({
      ...prev,
      paramDetails: prev.paramDetails.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removeParamDetail = (index: number) => {
    setState((prev) => ({
      ...prev,
      paramDetails: prev.paramDetails.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="verification-flow">
      <div className="header">
        <h1>🔐 KTTTTB Verification Demo</h1>
        <p className="subtitle">Kiểm tra thông tin thuê bao - Wiinvent</p>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${state.step === 'phone' ? 'active' : ''} ${['otp', 'data', 'result'].includes(state.step) ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Nhập SĐT</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${state.step === 'otp' ? 'active' : ''} ${['data', 'result'].includes(state.step) ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Xác thực OTP</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${state.step === 'data' ? 'active' : ''} ${state.step === 'result' ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Lấy dữ liệu</div>
        </div>
      </div>

      <div className="card">
        {state.error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {state.error}
          </div>
        )}

        {/* Step 1: Phone Number */}
        {state.step === 'phone' && (
          <div className="step-content">
            <h2>Bước 1: Nhập số điện thoại</h2>
            <p className="step-description">
              Nhập số điện thoại để nhận mã OTP xác thực
            </p>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={state.phoneNumber}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, phoneNumber: e.target.value, error: null }))
                }
                disabled={state.loading}
              />
            </div>

            <div className="form-group">
              <label>Thông tin cần xác thực</label>
              {state.paramDetails.map((param, index) => {
                const availableOptions = getAvailableOptions(index);
                return (
                  <div key={index} className="param-row">
                    <select
                      value={param.code}
                      onChange={(e) => updateParamDetail(index, 'code', e.target.value)}
                      disabled={state.loading}
                    >
                      <option value="">-- Chọn loại thông tin --</option>
                      {availableOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.label}
                        </option>
                      ))}
                      {param.code && !availableOptions.find((o) => o.code === param.code) && (
                        <option value={param.code}>
                          {availableFieldOptions.find((o) => o.code === param.code)?.label}
                        </option>
                      )}
                    </select>
                    <input
                      type={isDateField(param.code) ? 'date' : 'text'}
                      placeholder={isDateField(param.code) ? 'YYYY-MM-DD' : 'Nhập giá trị'}
                      value={param.value}
                      onChange={(e) => updateParamDetail(index, 'value', e.target.value)}
                      disabled={state.loading}
                    />
                    {state.paramDetails.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => removeParamDetail(index)}
                        disabled={state.loading}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={addParamDetail}
                disabled={state.loading || getAvailableOptions(state.paramDetails.length).length === 0}
              >
                + Thêm trường
              </button>
            </div>

            <button
              className="btn-primary"
              onClick={handleGetOtp}
              disabled={state.loading}
            >
              {state.loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {state.step === 'otp' && (
          <div className="step-content">
            <h2>Bước 2: Xác thực OTP</h2>
            <p className="step-description">
              Mã OTP đã được gửi đến số điện thoại <strong>{state.phoneNumber}</strong>
            </p>

            <div className="info-box">
              <div>Session OTP: <code>{state.sessionOtp}</code></div>
            </div>

            <div className="form-group">
              <label htmlFor="otp">Mã OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={state.otp}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, ''), error: null }))
                }
                disabled={state.loading}
              />
            </div>

            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={() => setState((prev) => ({ ...prev, step: 'phone', error: null }))}
                disabled={state.loading}
              >
                ← Quay lại
              </button>
              <button
                className="btn-primary"
                onClick={handleVerifyOtp}
                disabled={state.loading}
              >
                {state.loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Get Data */}
        {state.step === 'data' && (
          <div className="step-content">
            <h2>Bước 3: Lấy dữ liệu xác thực</h2>
            <p className="step-description">
              Xác thực thành công! Bạn có thể lấy dữ liệu xác thực ngay bây giờ.
            </p>

            <div className="info-box success">
              <div><strong>✓ Consent Reference:</strong> <code>{state.consentRef}</code></div>
              <div><strong>⏱ Thời gian sống:</strong> {state.timeToLife} phút</div>
              <div><strong>📅 Hết hạn:</strong> {new Date(state.expireTime).toLocaleString('vi-VN')}</div>
            </div>

            <div className="form-group">
              <label>Thông tin đã đăng ký xác thực</label>
              {state.paramDetails.map((param, index) => (
                <div key={index} className="param-display">
                  <span className="param-code">{param.code}:</span>
                  <span className="param-value">{param.value}</span>
                </div>
              ))}
            </div>

            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={handleReset}
                disabled={state.loading}
              >
                🔄 Bắt đầu lại
              </button>
              <button
                className="btn-primary"
                onClick={handleGetData}
                disabled={state.loading}
              >
                {state.loading ? 'Đang lấy dữ liệu...' : 'Lấy dữ liệu'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {state.step === 'result' && (
          <div className="step-content">
            <h2>✅ Kết quả xác thực</h2>
            <p className="step-description">
              Dưới đây là kết quả đối chiếu thông tin
            </p>

            <div className="results">
              {state.validationResults.map((result, index) => (
                <div
                  key={index}
                  className={`result-item ${result.status === 1 ? 'match' : 'mismatch'}`}
                >
                  <div className="result-icon">
                    {result.status === 1 ? '✓' : '✗'}
                  </div>
                  <div className="result-content">
                    <div className="result-code">{result.code}</div>
                    <div className="result-message">{result.statusMessage}</div>
                    <div className="result-status">
                      Trạng thái: <strong>{result.status === 1 ? 'Khớp' : 'Không khớp'}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={handleReset}>
              🔄 Thực hiện xác thực mới
            </button>
          </div>
        )}
      </div>

      <div className="footer">
        <p>
          <strong>API Endpoints:</strong> dev-pubapi-kttttb.wiinvent-tv.com
        </p>
      </div>
    </div>
  );
}
