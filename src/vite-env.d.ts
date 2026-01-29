/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_DEFAULT_PAGE_SIZE: string;
  readonly VITE_UPLOAD_FOLDER_URL: string;
  readonly VITE_PUBLIC_FOLDER_URL: string;
  readonly VITE_CITIES_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

