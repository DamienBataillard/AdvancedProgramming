import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n
i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to EFREI Feedbacks!",
          subtitle: "Give your thoughts",
          messages: "Messages",
          notifications: "Notifications",
          profile: "Profile",
          logout: "Log out",
          surveysAvailability: "No surveys available at the moment."
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue sur EFREI Feedbacks !",
          subtitle: "Donnez votre avis",
          messages: "Messages",
          notifications: "Notifications",
          profile: "Profil",
          logout: "Se déconnecter",
          surveysAvailability: "Aucune enquête n'est disponible pour le moment."
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
  });

export default i18n;