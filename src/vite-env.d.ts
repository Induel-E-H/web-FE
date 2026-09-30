/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_WIDGET?: string;
  readonly VITE_SHOW_DOWN_ICON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
