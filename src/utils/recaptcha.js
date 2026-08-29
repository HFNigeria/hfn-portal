const RECAPTCHA_SITE_KEY = "6Lc9L58tAAAAAKrC55NoSzXfMDlsFg7sgFwDijkF";

export const getRecaptchaToken = async (action = "register") => {
  return new Promise((resolve, reject) => {
    if (typeof window.grecaptcha === "undefined" || !window.grecaptcha?.ready) {
      console.warn("reCAPTCHA not loaded");
      resolve(null);
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(6Lc9L58tAAAAAKrC55NoSzXfMDlsFg7sgFwDijkF, { action })
        .then((token) => resolve(token))
        .catch((err) => {
          console.error("reCAPTCHA error:", err);
          resolve(null);
        });
    });
  });
};
