import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            welcome: "Welcome!",
        },
    },
    ja: {
        translation: {
            welcome: "ようこそ!",
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;