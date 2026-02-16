import { defineConfig } from 'i18next-cli';

export default defineConfig({
  "locales": [
    "en",
    "es",
    "ca"
  ],
  "extract": {
    "input": ["src/**/*.{ts,tsx}"],
    "output": "src/i18n/locales/{{language}}.json",
    "defaultNS": "translation",
    "keySeparator": ".",
    "nsSeparator": ":",
    "contextSeparator": "_",
    "defaultValue": "",
    "functions": ["t", "*.t"]
  }
});