import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import AdminDashboard from '../pages/AdminDashboard';

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
          surveysAvailability: "No surveys available at the moment.",
          surveyTitle : "Available Surveys",
          start: "Start",
          answer: "View Answsers",
          moduleAvailability: "No modules available at the moment.",
          feedback: "View Feedbacks",
          adminDashboard: "Admin Dashboard",
          manageSurvey: "Manage Surveys",
          listSurvey: "List of Surveys",
          createSurvey: "Create New Survey",
          teacherDashboard: "Welcome to EFREI Feedbacks - Professor!",
          manageSurveyTeacher: "Manage your course feedbacks",
          teacherSurveyTitle: "Your Surveys"
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
          surveysAvailability: "Aucune enquête n'est disponible pour le moment.",
          surveyTitle : "Enquêtes disponibles",
          start: "Démarrer",
          answer: "Voir les réponses",
          moduleAvailability: "Aucun module n'est disponible pour le moment.",
          feedback: "Voir les commentaires",
          adminDashboard: "Tableau de bord de l'Administrateur",
          manageSurvey: "Gérer mes enquêtes",
          listSurvey: "Liste des enquêtes",
          createSurvey: "Créer une nouvelle enquête",
          teacherDashboard: "Bievenue sur EFREI Feedbacks - Professeur!",
          manageSurveyTeacher: "Gérer vos évaluations de cours",
          teacherSurveyTitle: "Vos Enquêtes"
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
  });

export default i18n;