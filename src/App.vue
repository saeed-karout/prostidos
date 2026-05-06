<template class="font-league">
  <div :data-lang="$i18n.locale">
    <SplashScreen v-if="showSplash" @finished="handleSplashFinished" />
    <div v-else class="min-h-screen bg-[#100E0E] relative">
      <LastNavbar />
      <RouterView />
      <FooterComp />
      <!-- إضافة مكون WhatsApp Float هنا -->
      <WhatsAppFloat
        :phone-number="whatsappConfig.phoneNumber"
        :settings="whatsappConfig.settings"
        :messages="whatsappConfig.messages"
        :tooltips="whatsappConfig.tooltips"
        position="bottom-right"
        @click="handleWhatsAppClick"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';

import FooterComp from './components/master/LatestFooter.vue';
import SplashScreen from './components/StartedCom.vue';
import WhatsAppFloat from './components/WhatsAppFloat.vue'; // المسار الصحيح
import { manageVideoPlayback, optimizeMemoryUsage } from '@/utils/performance-optimizations';

// استيراد بيانات واتساب
import whatsappData from '@/assets/data/whatsapp.json'; // تأكد من المسار الصحيح

// Import CSS
import 'tailwindcss/tailwind.css';
import LastNavbar from './components/master/LastNavbar.vue';

const { locale } = useI18n();
const showSplash = ref(true);
const whatsappConfig = ref(whatsappData.whatsapp);

const handleSplashFinished = () => {
  showSplash.value = false;
};

const handleWhatsAppClick = () => {
  // يمكنك إضافة أي منطق إضافي هنا عند النقر على واتساب
  console.log('WhatsApp clicked');
  // يمكنك إضافة تحليلات مثلاً
  // trackEvent('whatsapp_click', { phone: whatsappConfig.value.phoneNumber });
};

// تحديث document dir عند تغيير اللغة
watch(locale, (newLocale) => {
  // تحديث سمة dir في document
  // document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', newLocale);
  
  // إضافة data-lang attribute للـ body
  document.body.setAttribute('data-lang', newLocale);
  
  // حفظ اللغة في localStorage
  localStorage.setItem('language', newLocale);
});

onMounted(() => {
  // تعيين الـ dir الأولي عند تحميل التطبيق
  const savedLanguage = localStorage.getItem('language') || 'en';
  document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', savedLanguage);
  document.body.setAttribute('data-lang', savedLanguage);
  
  manageVideoPlayback();
  optimizeMemoryUsage();
  
  // تحميل بيانات واتساب بشكل ديناميكي إذا لزم الأمر
  // fetchWhatsAppConfig();
});

// دالة لجلب الإعدادات ديناميكياً (اختياري)
// async function fetchWhatsAppConfig() {
//   try {
//     const response = await fetch('/api/whatsapp-config');
//     const data = await response.json();
//     whatsappConfig.value = data.whatsapp;
//   } catch (error) {
//     console.error('Error fetching WhatsApp config:', error);
//   }
// }
</script>

<style scoped>
.warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.warning-message {
  color: white;
  font-family: 'NeoSansArabic', 'League', sans-serif;
  font-size: 24px;
  text-align: center;
  background: #1a1616;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.min-h-screen {
  min-height: 100vh;
  background: #100E0E;
  position: relative;
}

body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* تطبيق الخط العربي على جميع العناصر عند اللغة العربية */
[data-lang="ar"] .warning-message {
  font-family: 'NeoSansArabic', sans-serif !important;
  letter-spacing: normal !important;
}


</style>