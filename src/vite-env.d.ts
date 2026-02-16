/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production'
  readonly VITE_API_KEY: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_API_HOST?: string
  readonly VITE_PRIMARY_COLOR?: string
  readonly VITE_FONT_FAMILY?: string
  readonly VITE_BACKGROUND_IMAGE?: string
  readonly VITE_LOGO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
