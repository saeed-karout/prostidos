import './index.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import en from './locales/en.json';
import ar from './locales/ar.json';

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);


library.add(fas, far, fab);
// تحميل اللغة من localStorage أو استخدام اللغة الافتراضية 'en'
const savedLanguage = localStorage.getItem('language') || 'en';
if (!['en', 'ar'].includes(savedLanguage)) {
  localStorage.setItem('language', 'en');
}

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage, // تحميل اللغة المحفوظة
  fallbackLocale: 'en',
  messages: { en, ar },

  missingWarn: false,          // جديد
  fallbackWarn: false,         // جديد
  warnHtmlMessage: false,
  // هذا مهم جدًا:
  globalInjection: true,
  // وهذا يجبره يرجع القيمة من fallback لو مفقودة
  fallbackOnMissing: true
});

const app = createApp(App)

app.use(i18n);
// app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.config.globalProperties.$gsap = gsap
app.config.globalProperties.$ScrollTrigger = ScrollTrigger
app.mount('#app')