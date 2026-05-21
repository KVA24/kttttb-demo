import { useState, useEffect } from 'react';
import { kttttbApi } from '../services/kttttbApi';
import { generateRequestId } from '../utils/signature';
import type { ErrorResponse, ParamDetail } from '../types/api';
import './VerificationFlow.css';

type Step = 'phone' | 'otp' | 'result';

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
  otpTimeLeft: number;
  otpExpired: boolean;
  fieldErrors: Record<string, string>;
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
    paramDetails: [{ code: 'customer_full_name', value: '' }],
    validationResults: [],
    loading: false,
    error: null,
    otpTimeLeft: 60,
    otpExpired: false,
    fieldErrors: {},
  });

  // OTP Countdown Timer
  useEffect(() => {
    if (state.step !== 'otp' || state.otpExpired) return;

    const timer = setInterval(() => {
      setState((prev) => {
        const newTimeLeft = prev.otpTimeLeft - 1;
        if (newTimeLeft <= 0) {
          return { ...prev, otpTimeLeft: 0, otpExpired: true };
        }
        return { ...prev, otpTimeLeft: newTimeLeft };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.step, state.otpExpired]);



  const handleError = (error: any) => {
    const errorResponse = error as ErrorResponse;
    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorResponse.localizedMessage || errorResponse.message || 'Có lỗi xảy ra',
    }));
  };

  const handleGetOtp = async () => {
    const errors: Record<string, string> = {};

    if (!state.phoneNumber) {
      errors['phoneNumber'] = 'Vui lòng nhập số điện thoại hợp lệ';
    }

    // Validate all fields are filled
    state.paramDetails.forEach((p, index) => {
      if (!p.code) {
        errors[`paramCode_${index}`] = 'Vui lòng chọn loại thông tin';
      }
      if (!p.value.trim()) {
        errors[`paramValue_${index}`] = 'Vui lòng nhập giá trị';
      }
    });

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, fieldErrors: errors }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, fieldErrors: {} }));

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
        otpTimeLeft: 60,
        otpExpired: false,
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

    if (state.otpExpired) {
      setState((prev) => ({ ...prev, error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới' }));
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

      // After OTP verification, immediately get data
      const dataResponse = await kttttbApi.getData({
        requestId: generateRequestId(),
        msisdn: state.phoneNumber,
        consentRef: response.data!.consentRef,
        paramDetail: state.paramDetails,
      });

      setState((prev) => ({
        ...prev,
        consentRef: response.data!.consentRef,
        expireTime: response.data!.expireTime,
        timeToLife: response.data!.timeToLife,
        validationResults: dataResponse.data!.results,
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
      paramDetails: [{ code: 'customer_full_name', value: '' }],
      validationResults: [],
      loading: false,
      error: null,
      otpTimeLeft: 60,
      otpExpired: false,
      fieldErrors: {},
    });
  };

  // Available field options
  const availableFieldOptions = [
    { code: 'customer_full_name', label: 'Họ và tên' },
    { code: 'id_no', label: 'Số CMND/CCCD' },
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
        <div className={`progress-step ${state.step === 'phone' ? 'active' : ''} ${['otp', 'result'].includes(state.step) ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Nhập SĐT</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${state.step === 'otp' ? 'active' : ''} ${state.step === 'result' ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Xác thực OTP</div>
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
                  setState((prev) => ({ 
                    ...prev, 
                    phoneNumber: e.target.value, 
                    error: null,
                    fieldErrors: { ...prev.fieldErrors, phoneNumber: '' }
                  }))
                }
                disabled={state.loading}
                className={state.fieldErrors['phoneNumber'] ? 'input-error' : ''}
              />
              {state.fieldErrors['phoneNumber'] && (
                <span className="field-error-message">{state.fieldErrors['phoneNumber']}</span>
              )}
            </div>

            <div className="form-group">
              <label>Thông tin cần xác thực <span className="required">*</span></label>
              {state.paramDetails.map((param, index) => {
                const availableOptions = getAvailableOptions(index);
                const codeError = state.fieldErrors[`paramCode_${index}`];
                const valueError = state.fieldErrors[`paramValue_${index}`];
                return (
                  <div key={index} className="param-row">
                    <div className="param-field">
                      <select
                        value={param.code}
                        onChange={(e) => {
                          updateParamDetail(index, 'code', e.target.value);
                          setState((prev) => ({
                            ...prev,
                            fieldErrors: { ...prev.fieldErrors, [`paramCode_${index}`]: '' }
                          }));
                        }}
                        disabled={state.loading}
                        required
                        className={codeError ? 'input-error' : ''}
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
                      {codeError && (
                        <span className="field-error-message">{codeError}</span>
                      )}
                    </div>
                    <div className="param-field">
                      <input
                        type={isDateField(param.code) ? 'date' : 'text'}
                        placeholder={isDateField(param.code) ? 'YYYY-MM-DD' : 'Nhập giá trị'}
                        value={param.value}
                        onChange={(e) => {
                          updateParamDetail(index, 'value', e.target.value);
                          setState((prev) => ({
                            ...prev,
                            fieldErrors: { ...prev.fieldErrors, [`paramValue_${index}`]: '' }
                          }));
                        }}
                        disabled={state.loading}
                        required
                        className={valueError ? 'input-error' : ''}
                      />
                      {valueError && (
                        <span className="field-error-message">{valueError}</span>
                      )}
                    </div>
                    <div>
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

            {state.otpExpired && (
              <div className="alert alert-warning">
                <span className="alert-icon">⏰</span>
                Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.
              </div>
            )}

            <div className="info-box">
              <div>Session OTP: <code>{state.sessionOtp}</code></div>
              <div className={`otp-timer ${state.otpTimeLeft <= 10 ? 'warning' : ''} ${state.otpExpired ? 'expired' : ''}`}>
                ⏱ Thời gian còn lại: <strong>{state.otpTimeLeft}s</strong>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="otp">Mã OTP <span className="required">*</span></label>
              <input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={state.otp}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, ''), error: null }))
                }
                disabled={state.loading || state.otpExpired}
                required
              />
            </div>

            <div className="button-group">
              <button
                className="btn-secondary"
                onClick={() => setState((prev) => ({ ...prev, step: 'phone', error: null, otpTimeLeft: 60, otpExpired: false }))}
                disabled={state.loading}
              >
                ← Quay lại
              </button>
              <button
                className="btn-primary"
                onClick={handleVerifyOtp}
                disabled={state.loading || state.otpExpired}
              >
                {state.loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {state.step === 'result' && (
          <div className="step-content">
            <h2>✅ Kết quả xác thực</h2>
            <p className="step-description">
              Dưới đây là kết quả đối chiếu thông tin
            </p>

            <div className="info-box success">
              <div><strong>✓ Consent Reference:</strong> <code>{state.consentRef}</code></div>
              <div><strong>⏱ Thời gian sống:</strong> {state.timeToLife} phút</div>
              <div><strong>📅 Hết hạn:</strong> {new Date(state.expireTime).toLocaleString('vi-VN')}</div>
            </div>

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
                      Trạng thái: <strong>{result.status === 1 ? 'Khớp ✓' : 'Không khớp ✗'}</strong>
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
