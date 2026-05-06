<template>
  <section class="pricing-section">
    <!-- خلفية سينمائية -->
    <div class="pricing-bg"></div>
    <div class="pricing-glow"></div>

    <div class="container">
      <!-- Header بتصميم سينمائي -->
      <div class="section-header">
        <div class="header-badge">
          <span class="badge-dot"></span>
          <span class="badge-text">{{ $t('pricing.badge_text') }}</span>
        </div>

        <div class="header-content">
          <h2 class="section-title">
            <span class="title-gradient">{{ $t('pricing.title_part1') }}</span>
            <span class="title-highlight">{{ $t('pricing.title_part2') }}</span>
          </h2>
          <p class="section-subtitle">{{ $t('pricing.subtitle') }}</p>
        </div>
      </div>

      <!-- Tabs بتصميم مميز -->
      <div class="tabs-wrapper">
        <div class="tabs-container">
          <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            <span class="tab-name">{{ $t(`pricing.tabs.${tab.id}`) }}</span>
            <span class="tab-active-indicator"></span>
          </button>
        </div>
      </div>

      
      <div class="packages-grid">
        <div v-for="(pkg, idx) in currentPackages" :key="pkg.name" class="package-card" :class="{
          featured: pkg.featured,
          'card-reveal': true
        }" :style="{ animationDelay: `${idx * 0.1}s` }">
          <!-- Card Glow Effect -->
          <div class="card-glow"></div>

          <!-- Featured Ribbon -->
          <div v-if="pkg.featured" class="featured-ribbon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" fill="#E9480E" stroke="white"
                stroke-width="1.5" />
              <path d="M12 6L13.5 10H18L14.5 13L16 17.5L12 15L8 17.5L9.5 13L6 10H10.5L12 6Z" fill="white" />
            </svg>
            <span>{{ $t('pricing.featured_label') }}</span>
          </div>

          <!-- Card Header -->
          <div class="card-header">
            <h3 class="package-name">{{ $t(`pricing.packages.${activeTab}.${pkg.key}.name`) }}</h3>
            <div class="package-price">
              <span class="price-currency">{{ $t('pricing.currency') }}</span>
              <span class="price-amount">{{ pkg.price }}</span>
              <span class="price-period">{{ getPeriodText(pkg.period, activeTab) }}</span>
            </div>
            <p v-if="pkg.description" class="package-description">{{
              $t(`pricing.packages.${activeTab}.${pkg.key}.description`) }}</p>
          </div>

          <!-- Features List -->
          <div class="package-features">
            <div v-for="(feature, featureKey) in pkg.features" :key="featureKey" class="feature-item"
              :class="{ 'feature-excluded': !feature.included }">
              <div class="feature-check">
                <svg v-if="feature.included" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#1D9E75" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#555" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <span class="feature-text">{{ getFeatureText(activeTab, pkg.key, featureKey, feature.text) }}</span>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="card-footer">
            <button class="cta-btn" :class="{ 'btn-primary': pkg.featured }" @click="handleGetStarted(pkg, activeTab)">
              <span>{{ $t('pricing.cta_button') }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Hover Border Effect -->
          <div class="card-border-hover"></div>
        </div>
      </div>

      <!-- Note Bar بتصميم مميز -->
      <div class="note-bar">
        <div class="note-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="#E9480E" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <p class="note-text">{{ $t('pricing.note.text') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const emit = defineEmits(['select']);

const activeTab = ref('social');

// رقم الواتساب المستهدف
const WHATSAPP_NUMBER = '966581670316'; // بدون + وبدون مسافات

const tabs = [
  { id: 'social', name: 'Social Media' },
  { id: 'events', name: 'Events' },
  { id: 'podcast', name: 'Podcast' },
  { id: 'realestate', name: 'Real Estate' },
  { id: 'commercial', name: 'Commercial & Corporate' }
];

// دالة للحصول على نص الفترة
const getPeriodText = (period, tabId) => {
  if (period === '/month') return t('pricing.period_month');
  if (period === '/event') return t('pricing.period_event');
  if (period === '/episode') return t('pricing.period_episode');
  if (period === '/property') return t('pricing.period_property');
  if (period === '') return '';
  return period;
};

// دالة للحصول على نص الميزة
const getFeatureText = (tabId, packageKey, featureKey, defaultText) => {
  const translationKey = `pricing.packages.${tabId}.${packageKey}.features.${featureKey}`;
  const translated = t(translationKey);

  if (translated !== translationKey) {
    return translated;
  }

  return defaultText;
};

// دالة لتجهيز رسالة واتساب حسب اللغة
const prepareWhatsAppMessage = (packageData, tabId) => {
  const isArabic = locale.value === 'ar';
  const packageName = t(`pricing.packages.${tabId}.${packageData.key}.name`);
  const packagePrice = packageData.price;
  const periodText = getPeriodText(packageData.period, tabId);
  const tabName = t(`pricing.tabs.${tabId}`);

  if (isArabic) {
    // رسالة بالعربية
    return `مرحباً، أنا مهتم بـ ${packageName} من قسم ${tabName}

تفاصيل الباقة:
• السعر: ${packagePrice} ر.س ${periodText}
• الوصف: ${t(`pricing.packages.${tabId}.${packageData.key}.description`)}

الميزات:
${Object.entries(packageData.features)
        .filter(([_, feature]) => feature.included)
        .map(([key, feature]) => `✓ ${getFeatureText(tabId, packageData.key, key, feature.text)}`)
        .join('\n')}

أرجو التواصل معي لمزيد من المعلومات.
شكراً!`;
  } else {
    // رسالة بالإنجليزية
    return `Hello, I'm interested in the ${packageName} package from ${tabName}

Package Details:
• Price: ${packagePrice} SAR ${periodText}
• Description: ${t(`pricing.packages.${tabId}.${packageData.key}.description`)}

Features:
${Object.entries(packageData.features)
        .filter(([_, feature]) => feature.included)
        .map(([key, feature]) => `✓ ${getFeatureText(tabId, packageData.key, key, feature.text)}`)
        .join('\n')}

Please contact me for more information.
Thank you!`;
  }
};

// دالة لفتح رابط واتساب
const openWhatsApp = (message) => {
  // ترميز الرسالة لاستخدامها في الرابط
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // فتح الرابط في تبويب جديد
  window.open(whatsappUrl, '_blank');
};

// دالة معالجة النقر على زر البدء
const handleGetStarted = (packageData, tabId) => {
  // تجهيز الرسالة
  const message = prepareWhatsAppMessage(packageData, tabId);

  // فتح واتساب مع الرسالة المجهزة
  openWhatsApp(message);

  // إرسال الحدث للوالد إذا كان هناك حاجة
  emit('select', {
    package: packageData.name,
    tab: tabId,
    whatsappMessage: message
  });


};

const packagesData = {
  social: [
    {
      key: 'essential',
      name: 'Essential',
      price: '3,500',
      period: '/month',
      featured: false,
      description: 'Essential social media content package for consistent brand presence.',
      features: {
        reels: { text: '4 filmed & edited reels/month', included: true },
        posts: { text: '8 designed posts', included: true },
        captions: { text: 'Arabic + English captions', included: true },
        platforms: { text: 'Instagram + TikTok', included: true },
        filming: { text: '1 filming visit/month', included: true },
        ads: { text: 'Ads management', included: false },
        report: { text: 'Monthly report', included: false }
      }
    },
    {
      key: 'growth',
      name: 'Growth',
      price: '7,000',
      period: '/month',
      featured: true,
      description: 'Accelerate your growth with advanced content and ad management.',
      features: {
        reels: { text: '8 filmed & edited reels/month', included: true },
        posts: { text: '12 designed posts + 8 stories', included: true },
        captions: { text: 'Arabic + English captions', included: true },
        platforms: { text: 'Instagram + TikTok + Snapchat', included: true },
        filming: { text: '2 filming visits/month', included: true },
        ads: { text: 'Meta + TikTok ads (up to SAR 2,000 managed)', included: true },
        report: { text: 'Monthly performance report', included: true }
      }
    },
    {
      key: 'brand',
      name: 'Brand',
      price: '12,000',
      period: '/month',
      featured: false,
      description: 'Complete brand dominance with premium content across all platforms.',
      features: {
        reels: { text: '12 reels + 1 branded video/month', included: true },
        posts: { text: '16 designed posts + 12 stories', included: true },
        captions: { text: 'Arabic + English captions', included: true },
        platforms: { text: 'Instagram + TikTok + Snapchat + LinkedIn', included: true },
        filming: { text: '3 filming visits/month', included: true },
        ads: { text: 'Meta + TikTok + Google ads (up to SAR 5,000 managed)', included: true },
        report: { text: 'Monthly strategy call + report', included: true }
      }
    }
  ],
  events: [
    {
      key: 'highlight',
      name: 'Event Highlight',
      price: '3,500',
      period: '/event',
      featured: false,
      description: 'Perfect for small gatherings and intimate events.',
      features: {
        cameraman: { text: '1 cameraman on-site', included: true },
        reel: { text: '1–2 min edited highlight reel', included: true },
        clips: { text: '3 short clips for stories/reels', included: true },
        delivery: { text: 'Delivery within 5 working days', included: true },
        drone: { text: 'Drone shot', included: false },
        teaser: { text: 'Same-day teaser', included: false }
      }
    },
    {
      key: 'full_coverage',
      name: 'Full Coverage',
      price: '7,500',
      period: '/event',
      featured: true,
      description: 'Complete event coverage for conferences, weddings, and corporate events.',
      features: {
        cameramen: { text: '2 cameramen on-site', included: true },
        edit: { text: '3–5 min full edit', included: true },
        clips: { text: '6 short clips for social media', included: true },
        drone: { text: 'Drone shot included', included: true },
        delivery: { text: 'Delivery within 5 working days', included: true },
        teaser: { text: 'Same-day teaser', included: false }
      }
    },
    {
      key: 'premium',
      name: 'Premium Production',
      price: '15,000+',
      period: '/event',
      featured: false,
      description: 'High-end commercial production with full crew.',
      features: {
        crew: { text: 'Full professional crew', included: true },
        cameras: { text: 'Multi-camera setup', included: true },
        drone: { text: 'Drone coverage', included: true },
        teaser: { text: 'Same-day teaser delivered', included: true },
        edit: { text: 'Full cinematic edit', included: true },
        cutdowns: { text: 'Social media cut-downs included', included: true }
      }
    }
  ],
  podcast: [
    {
      key: 'starter',
      name: 'Starter',
      price: '2,500',
      period: '/episode',
      featured: false,
      description: 'Perfect for getting started with your podcast.',
      features: {
        camera: { text: '1-camera setup', included: true },
        lighting: { text: 'Basic lighting rig', included: true },
        edit: { text: 'Full episode edited', included: true },
        clips: { text: '2 short clips for social media', included: true },
        graphics: { text: 'Intro/outro motion graphics', included: false },
        thumbnail: { text: 'Thumbnail design', included: false }
      }
    },
    {
      key: 'pro',
      name: 'Pro',
      price: '5,000',
      period: '/episode',
      featured: true,
      description: 'Professional podcast production with multi-camera setup.',
      features: {
        cameras: { text: 'Multi-camera setup (2–3 angles)', included: true },
        lighting: { text: 'Professional lighting', included: true },
        edit: { text: 'Full episode edited with graphics', included: true },
        clips: { text: '5 short clips for social media', included: true },
        graphics: { text: 'Intro/outro motion graphics', included: true },
        thumbnail: { text: 'Thumbnail design', included: true }
      }
    },
    {
      key: 'monthly',
      name: 'Monthly Retainer',
      price: '12,000',
      period: '/month',
      featured: false,
      description: 'Consistent podcast production with dedicated team.',
      features: {
        episodes: { text: '4 episodes filmed & edited', included: true },
        cameras: { text: 'Multi-camera setup', included: true },
        clips: { text: '20 short clips for social media', included: true },
        graphics: { text: 'Motion graphics & thumbnails', included: true },
        calendar: { text: 'Content calendar management', included: true },
        publishing: { text: 'Publishing & scheduling', included: true }
      }
    }
  ],
  realestate: [
    {
      key: 'showcase',
      name: 'Property Showcase',
      price: '1,500',
      period: '/property',
      featured: false,
      description: 'Quick and professional property tours.',
      features: {
        filming: { text: 'Interior & exterior filming', included: true },
        video: { text: '1–2 min edited video', included: true },
        delivery: { text: 'Delivery within 3 working days', included: true },
        reel: { text: '1 short reel for social media', included: true },
        drone: { text: 'Drone shot', included: false },
        voiceover: { text: 'Voiceover', included: false }
      }
    },
    {
      key: 'premium',
      name: 'Premium Listing',
      price: '3,500',
      period: '/property',
      featured: true,
      description: 'Cinematic property tours that sell.',
      features: {
        filming: { text: 'Interior & exterior filming', included: true },
        drone: { text: 'Drone shot included', included: true },
        edit: { text: '2–3 min cinematic edit', included: true },
        reels: { text: '3 short reels for social media', included: true },
        voiceover: { text: 'Arabic + English voiceover', included: true },
        delivery: { text: 'Delivery within 4 working days', included: true }
      }
    },
    {
      key: 'developer',
      name: 'Developer Package',
      price: 'Custom',
      period: '',
      featured: false,
      description: 'Volume production for real estate developers.',
      features: {
        days: { text: 'Dedicated filming days/month', included: true },
        drone: { text: 'Drone for all properties', included: true },
        edits: { text: 'Full edits + social reels', included: true },
        delivery: { text: 'Priority delivery', included: true },
        rate: { text: 'Discounted per-unit rate', included: true },
        manager: { text: 'Dedicated account manager', included: true }
      }
    }
  ],
  commercial: [
    {
      key: 'brand_film',
      name: 'Brand Film',
      price: '8,000+',
      period: '',
      featured: false,
      description: 'Compelling brand storytelling that connects with your audience.',
      features: {
        preproduction: { text: 'Pre-production & storyboard', included: true },
        filming: { text: '1 day filming at your location', included: true },
        edit: { text: 'Professional edit with music', included: true },
        film: { text: '60–90 sec final film', included: true },
        cutdowns: { text: '2 social media cut-downs', included: true },
        drone: { text: 'Drone', included: false }
      }
    },
    {
      key: 'company_profile',
      name: 'Company Profile',
      price: '15,000+',
      period: '',
      featured: true,
      description: 'A full documentary-style profile of your company.',
      features: {
        preproduction: { text: 'Pre-production & script', included: true },
        filming: { text: 'Team & office filming', included: true },
        drone: { text: 'Drone shot', included: true },
        interviews: { text: 'Interviews & testimonials', included: true },
        edit: { text: '3–5 min cinematic edit', included: true },
        versions: { text: 'Arabic + English versions', included: true }
      }
    },
    {
      key: 'premium',
      name: 'Premium Production',
      price: '30,000+',
      period: '',
      featured: false,
      description: 'High-end commercial production with full crew.',
      features: {
        preproduction: { text: 'Full pre-production & concept', included: true },
        crew: { text: 'Professional crew & equipment', included: true },
        filming: { text: 'Multi-location filming', included: true },
        drone: { text: 'Drone & gimbal coverage', included: true },
        grading: { text: 'Color grading & sound design', included: true },
        deliverables: { text: 'Full deliverables suite', included: true }
      }
    }
  ]
};

const currentPackages = computed(() => {
  const packages = packagesData[activeTab.value];
  return packages.map(pkg => ({
    ...pkg,
    price: pkg.price === 'Custom' ? t('pricing.custom_price') : pkg.price
  }));
});
</script>

<style scoped>
/* جميع الأنماط تبقى كما هي مع إضافة دعم RTL */
.pricing-section {
  position: relative;
  padding: 100px 24px;
  background: linear-gradient(135deg, #0a0a0a 0%, #100E0E 100%);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Background Effects */
.pricing-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(233, 72, 14, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(233, 72, 14, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.pricing-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(233, 72, 14, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 2;
}

/* Header Styles */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.badge-text {
  font-size: 40px;
  font-family: "Bebas Neue";
  background: linear-gradient(135deg, #E9480E 0%, #FF6B35 50%, #FF8E53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(22px, 6vw, 56px);
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.2;
}

.title-gradient {
  background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title-highlight {
  background: linear-gradient(135deg, #E9480E 0%, #FF6B35 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-subtitle {
  font-size: 18px;
  color: #9CA3AF;
  line-height: 1.6;
}

/* Tabs Styles */
.tabs-wrapper {
  margin-bottom: 60px;
  scrollbar-width: none;
}

.tabs-wrapper::-webkit-scrollbar {
  display: none;
}

.tabs-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: rgba(26, 24, 24, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  color: #9CA3AF;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.tab-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #E9480E, #FF6B35);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.tab-btn:hover {
  border-color: rgba(233, 72, 14, 0.5);
  transform: translateY(-2px);
}

.tab-btn.active {
  border-color: #E9480E;
  color: #FFFFFF;
}

.tab-btn.active::before {
  opacity: 0.15;
}

.tab-name {
  position: relative;
  z-index: 1;
}

.tab-active-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #E9480E;
  transition: all 0.3s ease;
}

.tab-btn.active .tab-active-indicator {
  width: 80%;
  left: 10%;
}

/* Packages Grid */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

/* Package Card */
.package-card {
  position: relative;
  background: linear-gradient(135deg, rgba(26, 24, 24, 0.9) 0%, rgba(20, 18, 18, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: cardReveal 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes cardReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.package-card:hover {
  transform: translateY(-8px);
  border-color: rgba(233, 72, 14, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(233, 72, 14, 0.1);
}

.package-card.featured {
  border: 2px solid #E9480E;
  background: linear-gradient(135deg, rgba(30, 28, 28, 0.95) 0%, rgba(20, 18, 18, 0.95) 100%);
  box-shadow: 0 10px 30px rgba(233, 72, 14, 0.2);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(233, 72, 14, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.package-card:hover .card-glow {
  opacity: 1;
}

.card-border-hover {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg, #E9480E, transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.package-card:hover .card-border-hover {
  opacity: 0.3;
}

.featured-ribbon {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #E9480E, #FF6B35);
  padding: 4px 10px;
  border-radius: 100px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(233, 72, 14, 0.3);
}

/* Card Header */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.package-name {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.package-price {
  margin-bottom: 12px;
}

.price-currency {
  font-size: 16px;
  color: #9CA3AF;
  margin-right: 4px;
}

.price-amount {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #FFFFFF, #E5E7EB);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.price-period {
  font-size: 14px;
  color: #9CA3AF;
  margin-left: 4px;
}

.package-description {
  font-size: 15px;
  color: #E9480E;
  line-height: 1.5;
  max-width: 90%;
  margin: 0 auto;
}

/* Features List */
.package-features {
  margin-bottom: 32px;
  min-height: 300px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 14px;
  color: #D1D5DB;
  transition: all 0.3s ease;
}

.feature-item.feature-excluded {
  opacity: 0.4;
}

.feature-check {
  flex-shrink: 0;
  width: 20px;
  display: flex;
  justify-content: center;
}

.feature-text {
  line-height: 1.4;
}

/* CTA Button */
.card-footer {
  margin-top: auto;
}

.cta-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 24px;
  background: transparent;
  border: 2px solid rgba(233, 72, 14, 0.5);
  border-radius: 12px;
  color: #E9480E;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(233, 72, 14, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.cta-btn:hover::before {
  width: 300px;
  height: 300px;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(233, 72, 14, 0.3);
}

.cta-btn.btn-primary {
  background: linear-gradient(135deg, #E9480E, #FF6B35);
  border-color: transparent;
  color: white;
}

.cta-btn.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(233, 72, 14, 0.5);
}

.cta-btn svg {
  transition: transform 0.3s ease;
}

.cta-btn:hover svg {
  transform: translateX(4px);
}

/* Note Bar */
.note-bar {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: rgba(26, 24, 24, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px 28px;
}

.note-icon {
  flex-shrink: 0;
}

.note-text {
  font-size: 14px;
  color: #9CA3AF;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .packages-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .pricing-section {
    padding: 60px 20px;
  }

  .package-card {
    padding: 32px 24px;
  }

  .package-name {
    font-size: 24px;
  }

  .price-amount {
    font-size: 36px;
  }

  .package-description {
    font-size: 14px;
  }

  .note-bar {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }

  .tab-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .feature-item {
    font-size: 13px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {

  .pricing-glow,
  .package-card,
  .cta-btn::before {
    animation: none;
    transition: none;
  }
}

/* RTL Support */
[dir="rtl"] .feature-check {
  margin-left: 12px;
  margin-right: 0;
}

[dir="rtl"] .price-currency {
  margin-right: 0;
  margin-left: 4px;
}

[dir="rtl"] .price-period {
  margin-left: 0;
  margin-right: 4px;
}

[dir="rtl"] .featured-ribbon {
  right: auto;
  left: 12px;
}

[dir="rtl"] .cta-btn:hover svg {
  transform: translateX(-4px);
}
</style>