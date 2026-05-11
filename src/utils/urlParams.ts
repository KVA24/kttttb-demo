/**
 * Get URL search params
 */
export function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    tenantCode: params.get('tenantCode') || params.get('tenant_code'),
    businessCode: params.get('businessCode') || params.get('business_code'),
  };
}

/**
 * Get tenant code from URL params, env, or default
 */
export function getTenantCode(): string {
  const urlParams = getUrlParams();
  return (
    urlParams.tenantCode ||
    import.meta.env.VITE_TENANT_CODE ||
    'MB'
  );
}

/**
 * Get business code from URL params, env, or default
 */
export function getBusinessCode(): string {
  const urlParams = getUrlParams();
  return (
    urlParams.businessCode ||
    import.meta.env.VITE_BUSINESS_CODE ||
    'PHT'
  );
}

/**
 * Get secret key from env or default
 * Note: Secret key should NEVER be in URL params for security
 */
export function getSecretKey(): string {
  return import.meta.env.VITE_SECRET_KEY || '1e112e3a364fd3a5454f4e98d8e908d1eb14ce32fa659961b1c99969c3e73813';
}
