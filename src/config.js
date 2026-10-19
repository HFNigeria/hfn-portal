const env = import.meta.env;

export const API_BASE_URL = env.VITE_API_BASE_URL;
export const RECAPTCHA_SITE_KEY = env.VITE_RECAPTCHA_SITE_KEY;
export const GTAG_ID = env.VITE_GTAG_ID;
export const APP_TITLE = env.VITE_APP_TITLE;

if (env.DEV) {
  const missing = [
    ['VITE_API_BASE_URL', API_BASE_URL],
    ['VITE_RECAPTCHA_SITE_KEY', RECAPTCHA_SITE_KEY],
    ['VITE_GTAG_ID', GTAG_ID],
    ['VITE_APP_TITLE', APP_TITLE],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    console.warn(
      `[config] Missing environment variable(s): ${missing.join(', ')}. ` +
        'Copy `.env.example` to `.env` and reload the dev server.'
    );
  }
}
