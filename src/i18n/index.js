import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";

const idiomaActual = localStorage.getItem("idioma") || "es";

i18next.use(initReactI18next).init({
    resources: {
        en: {
            translation: en
        },
        es: {
            translation: es
        }
    },
    lng: idiomaActual,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

i18next.on("languageChanged", (lng) => {
    localStorage.setItem("idioma", lng);
});

export default i18next;