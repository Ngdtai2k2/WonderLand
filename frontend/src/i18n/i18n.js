import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Import translations for English
import HOME_EN from '../locales/en/home.json';
import SIDEBAR_EN from '../locales/en/sidebar.json';
import MESSAGE_EN from '../locales/en/message.json';
import NAVIGATION_EN from '../locales/en/navigation.json';
import USER_EN from '../locales/en/user.json';
import POST_EN from '../locales/en/post.json';
import VALIDATE_EN from '../locales/en/validate.json';
import FIELD_EN from '../locales/en/field.json';
import AUTH_EN from '../locales/en/auth.json';
import SETTINGS_EN from '../locales/en/settings.json';
import FRIENDS_EN from '../locales/en/friends.json';
import ADMIN_EN from '../locales/en/admin.json';
// Import translations for Vietnamese
import HOME_VI from '../locales/vi/home.json';
import SIDEBAR_VI from '../locales/vi/sidebar.json';
import MESSAGE_VI from '../locales/vi/message.json';
import NAVIGATION_VI from '../locales/vi/navigation.json';
import USER_VI from '../locales/vi/user.json';
import POST_VI from '../locales/vi/post.json';
import VALIDATE_VI from '../locales/vi/validate.json';
import FIELD_VI from '../locales/vi/field.json';
import AUTH_VI from '../locales/vi/auth.json';
import SETTINGS_VI from '../locales/vi/settings.json';
import FRIENDS_VI from '../locales/vi/friends.json';
import ADMIN_VI from '../locales/vi/admin.json';

const resources = {
  en: {
    home: HOME_EN,
    sidebar: SIDEBAR_EN,
    message: MESSAGE_EN,
    navigation: NAVIGATION_EN,
    user: USER_EN,
    post: POST_EN,
    validate: VALIDATE_EN,
    field: FIELD_EN,
    auth: AUTH_EN,
    settings: SETTINGS_EN,
    friends: FRIENDS_EN,
    admin: ADMIN_EN,
  },
  vi: {
    home: HOME_VI,
    sidebar: SIDEBAR_VI,
    message: MESSAGE_VI,
    navigation: NAVIGATION_VI,
    user: USER_VI,
    post: POST_VI,
    validate: VALIDATE_VI,
    field: FIELD_VI,
    auth: AUTH_VI,
    settings: SETTINGS_VI,
    friends: FRIENDS_VI,
    admin: ADMIN_VI,
  },
};

const defaultLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  ns: [
    'home',
    'sidebar',
    'message',
    'navigation',
    'user',
    'validate',
    'field',
    'auth',
    'settings',
    'friends',
    'admin',
  ],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
