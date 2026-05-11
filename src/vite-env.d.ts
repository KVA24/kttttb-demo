/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TENANT_CODE?: string;
  readonly VITE_BUSINESS_CODE?: string;
  readonly VITE_SECRET_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
