/* i18 configuartion (used for allowing different languages on NoteSwap) */

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en", // Default language
    locales: ["en", "fr", "es", "de", "it", "pt", "hi", "zh", "ru", "kr", "ar"], // Supported languages
  },
  fallbackLng: {
    default: ["en"], // Fallback language in case their is an error
  },
};
