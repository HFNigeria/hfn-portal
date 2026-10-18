import { RECAPTCHA_SITE_KEY } from '@/config';

export const getRecaptchaToken = async (action = 'register') => {
  return new Promise((resolve) => {
    if (typeof window.grecaptcha === 'undefined' || !window.grecaptcha?.ready) {
      console.warn('reCAPTCHA not loaded');
      resolve(null);
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then((token) => resolve(token))
        .catch((err) => {
          console.error('reCAPTCHA error:', err);
          resolve(null);
        });
    });
  });
};
