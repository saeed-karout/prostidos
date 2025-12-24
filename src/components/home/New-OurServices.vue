<template>
  <!-- Desktop Section -->
  <div class="main-our-services" id="services" ref="mainSection">
    <div class="header">
      <div class="title" ref="titleRef">
        {{ $t('OurServices.title') }}
      </div>
      <div class="subtitle" ref="subtitleRef">
        {{ $t('OurServices.span_title') }}
      </div>
    </div>

    <div class="content">
      <div class="service-items">
        <div 
          v-for="(service, index) in newServices" 
          :key="index"
          :class="['service', index % 2 === 0 ? 'service-top' : 'service-bottom']"
          ref="serviceCardsRef"
          @mouseenter="onCardHover(index)"
          @mouseleave="onCardLeave(index)"
        >
          <div class="card">
            <div class="card-icon" :class="service.iconClass">
              <span class="icon-emoji">{{ service.icon }}</span>
            </div>
            <div class="card-content">
              <div class="card-title">{{ service.title }}</div>
              <div class="card-subtitle">{{ service.description }}</div>
            </div>
            <div class="card-hover-effect"></div>
            <div class="card-glow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Section -->
  <div class="main-mobile" ref="mobileSection">
    <div class="header-mobile">
      <div class="title-mobile" ref="mobileTitleRef">
        {{ $t('OurServices.title') }}
      </div>
      <div class="subtitle-mobile" ref="mobileSubtitleRef">
        {{ $t('OurServices.span_title') }}
      </div>
    </div>

    <div class="service-container">
      <div 
        class="service-items-mobile"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div 
          v-for="(service, index) in newServices" 
          :key="index"
          :class="['service-item-mobile', index % 2 === 0 ? 'mobile-top' : 'mobile-bottom']"
          ref="mobileCardsRef"
        >
          <div class="card-mobile">
            <div class="card-icon" :class="service.iconClass">
              <span class="icon-emoji">{{ service.icon }}</span>
            </div>
            <div class="card-content">
              <div class="card-title">{{ service.title }}</div>
              <div class="card-subtitle">{{ service.description }}</div>
            </div>
            <div class="card-hover-effect"></div>
            <div class="card-glow"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <div 
        v-for="(_, index) in newServices" 
        :key="index"
        :class="['point', currentSlide === index ? 'active' : '']"
        @click="goToSlide(index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const currentSlide = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

// Refs للعناصر التي نريد إضافة أنيميشن لها
const mainSection = ref(null);
const mobileSection = ref(null);
const titleRef = ref(null);
const subtitleRef = ref(null);
const serviceCardsRef = ref([]);
const mobileTitleRef = ref(null);
const mobileSubtitleRef = ref(null);
const mobileCardsRef = ref([]);

// حالة لتتبع ما إذا كانت الأنيميشن قد تم تشغيلها
const hasAnimated = ref(false);
const mobileHasAnimated = ref(false);

// البيانات مع أيقونات مخصصة لكل خدمة
const newServices = ref([
  {
    "title": "Video Production",
    "description": "We produce cinematic visuals that communicate brand stories with clarity and impact.",
    "icon": "🎥",
    "iconClass": "icon-camera"
  },
  {
    "title": "Company Films",
    "description": "Professional corporate films that highlight your organization's values, culture, and achievements.",
    "icon": "🏢",
    "iconClass": "icon-company"
  },
  {
    "title": "Promotional & Commercial Films",
    "description": "Strategic productions designed to enhance brand visibility and drive audience engagement.",
    "icon": "📈",
    "iconClass": "icon-promo"
  },
  {
    "title": "Podcast Filming & Production",
    "description": "Comprehensive production for professional podcasts, including setup, recording, and post-production.",
    "icon": "🎙️",
    "iconClass": "icon-podcast"
  },
  {
    "title": "Branding & Content Creation",
    "description": "Developing cohesive visual identities and content strategies that strengthen brand presence.",
    "icon": "🎨",
    "iconClass": "icon-branding"
  },
  {
    "title": "Events Filming & Production",
    "description": "High-quality event coverage capturing key moments with precision and storytelling focus.",
    "icon": "🎪",
    "iconClass": "icon-events"
  },
  {
    "title": "Ads Management",
    "description": "Managing performance-driven campaigns across Google, Meta, Snapchat, and TikTok platforms.",
    "icon": "📱",
    "iconClass": "icon-ads"
  }
]);

const goToSlide = (index) => {
  currentSlide.value = index;
};

// Swipe للجوال
const onTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const onTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const diff = touchStartX.value - touchEndX.value;
  const minSwipeDistance = 50;

  if (Math.abs(diff) > minSwipeDistance) {
    if (diff > 0) {
      currentSlide.value = (currentSlide.value + 1) % newServices.value.length;
    } else {
      currentSlide.value = currentSlide.value === 0 ? newServices.value.length - 1 : currentSlide.value - 1;
    }
  }
};

// أنيميشن الهوفر للكروت
const onCardHover = (index) => {
  const card = serviceCardsRef.value[index];
  if (card) {
    card.style.transform = 'translateY(-12px) scale(1.03)';
    card.style.zIndex = '10';
  }
};

const onCardLeave = (index) => {
  const card = serviceCardsRef.value[index];
  if (card) {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.zIndex = '1';
  }
};

// Auto-slide for mobile
let slideInterval;

// دالة لإعداد الأنيميشن للنسخة المكتبية
const setupDesktopAnimations = () => {
  if (hasAnimated.value) return;
  hasAnimated.value = true;

  const animateTitle = (element) => {
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(40px) scale(0.9)';
      element.style.filter = 'blur(5px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        element.style.filter = 'blur(0)';
      }, 100);
    }
  };

  const animateCards = () => {
    serviceCardsRef.value.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.7) translateY(80px) rotateX(10deg)';
        card.style.filter = 'blur(8px)';
        
        setTimeout(() => {
          card.style.transition = `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`;
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0) rotateX(0)';
          card.style.filter = 'blur(0)';
        }, 300);
      }
    });
  };

  setTimeout(() => {
    animateTitle(titleRef.value);
    animateTitle(subtitleRef.value);
    animateCards();
  }, 500);
};

// دالة لإعداد الأنيميشن للنسخة الموبايل
const setupMobileAnimations = () => {
  if (mobileHasAnimated.value) return;
  mobileHasAnimated.value = true;

  const animateTitle = (element) => {
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(40px) scale(0.9)';
      element.style.filter = 'blur(5px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        element.style.filter = 'blur(0)';
      }, 100);
    }
  };

  const animateMobileCards = () => {
    mobileCardsRef.value.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(50px)';
        card.style.filter = 'blur(5px)';
        
        setTimeout(() => {
          card.style.transition = `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`;
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
          card.style.filter = 'blur(0)';
        }, 300);
      }
    });
  };

  setTimeout(() => {
    animateTitle(mobileTitleRef.value);
    animateTitle(mobileSubtitleRef.value);
    animateMobileCards();
  }, 500);
};

// إعادة تعيين الأنيميشن
const resetAnimations = () => {
  // إعادة تعيين العناصر المكتبية
  if (titleRef.value) {
    titleRef.value.style.opacity = '0';
    titleRef.value.style.transform = 'translateY(40px) scale(0.9)';
    titleRef.value.style.filter = 'blur(5px)';
    titleRef.value.style.transition = 'none';
  }
  
  if (subtitleRef.value) {
    subtitleRef.value.style.opacity = '0';
    subtitleRef.value.style.transform = 'translateY(40px) scale(0.9)';
    subtitleRef.value.style.filter = 'blur(5px)';
    subtitleRef.value.style.transition = 'none';
  }

  serviceCardsRef.value.forEach(card => {
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.7) translateY(80px) rotateX(10deg)';
      card.style.filter = 'blur(8px)';
      card.style.transition = 'none';
    }
  });

  // إعادة تعيين العناصر الموبايل
  if (mobileTitleRef.value) {
    mobileTitleRef.value.style.opacity = '0';
    mobileTitleRef.value.style.transform = 'translateY(40px) scale(0.9)';
    mobileTitleRef.value.style.filter = 'blur(5px)';
    mobileTitleRef.value.style.transition = 'none';
  }
  
  if (mobileSubtitleRef.value) {
    mobileSubtitleRef.value.style.opacity = '0';
    mobileSubtitleRef.value.style.transform = 'translateY(40px) scale(0.9)';
    mobileSubtitleRef.value.style.filter = 'blur(5px)';
    mobileSubtitleRef.value.style.transition = 'none';
  }

  mobileCardsRef.value.forEach(card => {
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8) translateY(50px)';
      card.style.filter = 'blur(5px)';
      card.style.transition = 'none';
    }
  });
};

// Intersection Observers
let desktopObserver;
let mobileObserver;

onMounted(() => {
  // إعادة تعيين الأنيميشن أولاً
  resetAnimations();

  // إعداد الـ Observer للنسخة المكتبية
  desktopObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated.value) {
        entry.target.classList.add('in-view');
        setupDesktopAnimations();
      } else if (entry.isIntersecting && hasAnimated.value) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  // إعداد الـ Observer للنسخة الموبايل
  mobileObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !mobileHasAnimated.value) {
        entry.target.classList.add('in-view');
        setupMobileAnimations();
      } else if (entry.isIntersecting && mobileHasAnimated.value) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  // بدء المراقبة
  if (mainSection.value) {
    desktopObserver.observe(mainSection.value);
  }
  
  if (mobileSection.value) {
    mobileObserver.observe(mobileSection.value);
  }

  // Auto-slide for mobile
  if (newServices.value.length > 0) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % newServices.value.length;
    }, 5000);
  }
});

onUnmounted(() => {
  if (desktopObserver) {
    desktopObserver.disconnect();
  }
  if (mobileObserver) {
    mobileObserver.disconnect();
  }
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
/* Common Styles */
.main-our-services,
.main-mobile {
  background: #100E0E;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.header,
.header-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

/* الحالة الأولية للعناصر */
.title,
.title-mobile {
  color: #FFF;
  font-family: "Bebas Neue", sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  opacity: 0;
  transform: translateY(40px) scale(0.9);
  filter: blur(5px);
}

.subtitle,
.subtitle-mobile {
  color: #FFF;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  text-align: center;
  opacity: 0;
  transform: translateY(40px) scale(0.9);
  filter: blur(5px);
}

.card,
.card-mobile {
  background-image: url('/images/border-service.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  border-radius: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.card-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

/* أنماط الأيقونات المخصصة */
.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.9;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
}

.icon-emoji {
  display: block;
  transition: all 0.4s ease;
}

/* تأثيرات خاصة لكل أيقونة */
.icon-camera {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  transform: perspective(500px) rotateY(0deg);
}

.icon-company {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  transform: perspective(500px) rotateX(0deg);
}

.icon-promo {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 15px 50px;
  transform: perspective(500px) rotateZ(0deg);
}

.icon-podcast {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  transform: perspective(500px) scale(1);
}

.icon-branding {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 25px;
  transform: perspective(500px) rotateY(0deg);
}

.icon-events {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
  transform: perspective(500px) rotateX(0deg);
}

.icon-ads {
  background: linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%);
  border-radius: 20px 50px;
  transform: perspective(500px) rotateZ(0deg);
}

.card-title {
  color: #FFF;
  font-family: "Bebas Neue", sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.1;
  margin: 0 0 12px 0;
  transition: all 0.4s ease;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.card-subtitle {
  color: #FDFDFD;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  margin: 0;
  transition: all 0.4s ease;
  opacity: 0.9;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(233, 72, 14, 0.15), 
    rgba(233, 72, 14, 0.3), 
    rgba(233, 72, 14, 0.15), 
    transparent
  );
  transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(233, 72, 14, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

/* أنيميشن الهوفر للكروت مع تأثيرات الأيقونات */
.card:hover .card-hover-effect,
.card-mobile:active .card-hover-effect {
  left: 100%;
}

.card:hover .card-glow,
.card-mobile:active .card-glow {
  opacity: 1;
}

.card:hover,
.card-mobile:active {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 
    0 25px 50px rgba(233, 72, 14, 0.25),
    0 0 80px rgba(233, 72, 14, 0.1),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
}

/* تأثيرات خاصة لكل أيقونة عند الهوفر */
.card:hover .card-icon,
.card-mobile:active .card-icon {
  transform: scale(1.15);
  opacity: 1;
  filter: 
    drop-shadow(0 8px 16px rgba(233, 72, 14, 0.4))
    brightness(1.2);
}

.card:hover .icon-camera,
.card-mobile:active .icon-camera {
  transform: perspective(500px) rotateY(15deg) scale(1.15);
  animation: cameraFlash 0.5s ease-in-out;
}

.card:hover .icon-company,
.card-mobile:active .icon-company {
  transform: perspective(500px) rotateX(15deg) scale(1.15);
  animation: buildingPulse 0.6s ease-in-out;
}

.card:hover .icon-promo,
.card-mobile:active .icon-promo {
  transform: perspective(500px) rotateZ(-10deg) scale(1.15);
  animation: chartGrow 0.5s ease-in-out;
}

.card:hover .icon-podcast,
.card-mobile:active .icon-podcast {
  transform: perspective(500px) scale(1.2);
  animation: microphoneWave 0.8s ease-in-out;
}

.card:hover .icon-branding,
.card-mobile:active .icon-branding {
  transform: perspective(500px) rotateY(-15deg) scale(1.15);
  animation: paintSplash 0.6s ease-in-out;
}

.card:hover .icon-events,
.card-mobile:active .icon-events {
  transform: perspective(500px) rotateX(-15deg) scale(1.15);
  animation: eventSpotlight 0.7s ease-in-out;
}

.card:hover .icon-ads,
.card-mobile:active .icon-ads {
  transform: perspective(500px) rotateZ(10deg) scale(1.15);
  animation: phoneVibrate 0.4s ease-in-out;
}

.card:hover .card-title,
.card-mobile:active .card-title {
  color: #E9480E;
  transform: translateY(-2px);
  text-shadow: 0 4px 8px rgba(233, 72, 14, 0.3);
}

.card:hover .card-subtitle,
.card-mobile:active .card-subtitle {
  transform: translateY(-1px);
  opacity: 1;
}

/* أنيميشنات مخصصة لكل أيقونة */
@keyframes cameraFlash {
  0%, 100% { filter: brightness(1) drop-shadow(0 8px 16px rgba(233, 72, 14, 0.4)); }
  50% { filter: brightness(1.5) drop-shadow(0 12px 24px rgba(255, 255, 255, 0.6)); }
}

@keyframes buildingPulse {
  0%, 100% { transform: perspective(500px) rotateX(15deg) scale(1.15); }
  50% { transform: perspective(500px) rotateX(15deg) scale(1.25); }
}

@keyframes chartGrow {
  0% { transform: perspective(500px) rotateZ(-10deg) scale(1.1); }
  50% { transform: perspective(500px) rotateZ(-10deg) scale(1.2); }
  100% { transform: perspective(500px) rotateZ(-10deg) scale(1.15); }
}

@keyframes microphoneWave {
  0% { transform: perspective(500px) scale(1.15); }
  25% { transform: perspective(500px) scale(1.25) rotate(5deg); }
  50% { transform: perspective(500px) scale(1.2) rotate(-5deg); }
  75% { transform: perspective(500px) scale(1.25) rotate(5deg); }
  100% { transform: perspective(500px) scale(1.15); }
}

@keyframes paintSplash {
  0%, 100% { border-radius: 25px; }
  50% { border-radius: 35% 65% 65% 35% / 35% 35% 65% 65%; }
}

@keyframes eventSpotlight {
  0%, 100% { filter: brightness(1) drop-shadow(0 8px 16px rgba(233, 72, 14, 0.4)); }
  50% { filter: brightness(1.3) drop-shadow(0 15px 30px rgba(255, 255, 255, 0.8)); }
}

@keyframes phoneVibrate {
  0%, 100% { transform: perspective(500px) rotateZ(10deg) scale(1.15); }
  25% { transform: perspective(500px) rotateZ(12deg) scale(1.15); }
  50% { transform: perspective(500px) rotateZ(8deg) scale(1.15); }
  75% { transform: perspective(500px) rotateZ(12deg) scale(1.15); }
}

/* Desktop Styles */
.main-our-services {
  display: flex;
  padding: 100px 64px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
  min-height: 100vh;
}

.header .title {
  font-size: 48px;
  letter-spacing: 2px;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.header .subtitle {
  font-size: 20px;
  max-width: 600px;
  letter-spacing: 0.5px;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.service-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1600px;
}

.service {
  display: flex;
  width: 320px;
  height: 450px;
  flex-direction: column;
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.7) translateY(80px) rotateX(10deg);
  filter: blur(8px);
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.service-top {
  align-items: flex-start;
  gap: 8px;
}

.service-bottom {
  justify-content: flex-end;
  align-items: flex-start;
  gap: 8px;
}

.service .card {
  height: 330px;
  padding: 40px 35px;
  width: 100%;
}

/* Mobile Styles */
.main-mobile {
  display: none;
  padding: 80px 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 60px;
  width: 100%;
  overflow: hidden;
}

.header-mobile .title-mobile {
  font-size: 42px;
  letter-spacing: 1.5px;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.header-mobile .subtitle-mobile {
  font-size: 16px;
  max-width: 343px;
  letter-spacing: 0.3px;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.service-container {
  display: flex;
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 600px;
}

.service-items-mobile {
  display: flex;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  height: 100%;
}

.service-item-mobile {
  flex: 0 0 100%;
  min-width: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 0 20px;
  transition: all 0.4s ease;
  opacity: 0;
  transform: scale(0.8) translateY(50px);
  filter: blur(5px);
}

.service-container .service-items-mobile .service-item-mobile {
  opacity: 1;
  transform: scale(1);
}

.mobile-top {
  justify-content: flex-start;
  align-items: center;
  padding-top: 40px;
}

.mobile-bottom {
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 40px;
}

.card-mobile {
  width: 100%;
  max-width: 350px;
  height: 400px;
  padding: 40px 30px;
}

.card-mobile .card-icon {
  font-size: 42px;
  width: 70px;
  height: 70px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
}

.point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FFF;
  opacity: 0.3;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.point::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  transition: left 0.6s ease;
}

.point:hover::before {
  left: 100%;
}

.point.active {
  background: #E9480E;
  opacity: 1;
  transform: scale(1.4);
  box-shadow: 
    0 0 20px rgba(233, 72, 14, 0.6),
    0 0 40px rgba(233, 72, 14, 0.3);
  animation: pointPulse 2s infinite;
}

.point:hover {
  transform: scale(1.3);
  opacity: 0.7;
}

@keyframes pointPulse {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(233, 72, 14, 0.6),
      0 0 40px rgba(233, 72, 14, 0.3);
  }
  50% {
    box-shadow: 
      0 0 25px rgba(233, 72, 14, 0.8),
      0 0 50px rgba(233, 72, 14, 0.4);
  }
}

@keyframes gentleBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.02);
  }
}

/* أنيميشن عند الظهور */
.in-view .title,
.in-view .title-mobile {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.in-view .subtitle,
.in-view .subtitle-mobile {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.in-view .service {
  opacity: 1;
  transform: scale(1) translateY(0) rotateX(0);
  filter: blur(0);
}

.in-view .service-item-mobile {
  opacity: 1;
  transform: scale(1) translateY(0);
  filter: blur(0);
}

/* Responsive Design */
@media (max-width: 1299px) {
  .main-our-services {
    display: none;
  }
  
  .main-mobile {
    display: flex;
  }
}

@media (min-width: 1300px) {
  .main-mobile {
    display: none;
  }
  
  .main-our-services {
    display: flex;
  }
}

/* Tablet Styles */
@media (min-width: 768px) and (max-width: 1299px) {
  .main-mobile {
    padding: 80px 32px;
  }
  
  .header-mobile .title-mobile {
    font-size: 56px;
  }
  
  .header-mobile .subtitle-mobile {
    font-size: 18px;
    max-width: 500px;
  }
  
  .card-mobile {
    max-width: 400px;
    height: 380px;
    padding: 40px 35px;
  }
  
  .service-container {
    height: 550px;
  }
}

/* Large Desktop Styles */
@media (min-width: 1440px) {
  .main-our-services {
    padding: 120px 80px;
  }
  
  .service-items {
    gap: 50px;
  }
  
  .service {
    width: 340px;
    height: 480px;
  }
  
  .service .card {
    height: 350px;
    padding: 50px 40px;
  }
}

/* Small Mobile Styles */
@media (max-width: 374px) {
  .main-mobile {
    padding: 60px 16px;
    gap: 50px;
  }
  
  .header-mobile .title-mobile {
    font-size: 36px;
  }
  
  .header-mobile .subtitle-mobile {
    font-size: 14px;
  }
  
  .card-mobile {
    height: 360px;
    padding: 35px 25px;
  }
  
  .card-title {
    font-size: 28px;
  }
  
  .card-subtitle {
    font-size: 15px;
  }
  
  .service-container {
    height: 520px;
  }
  
  .card-mobile .card-icon {
    font-size: 36px;
    width: 60px;
    height: 60px;
  }
}

/* أنيميشن لطيفة للخلفية */
.main-our-services::before,
.main-mobile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 15% 70%, rgba(233, 72, 14, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(233, 72, 14, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: backgroundShift 8s ease-in-out infinite alternate;
}

@keyframes backgroundShift {
  0% {
    transform: scale(1) rotate(0deg);
  }
  100% {
    transform: scale(1.1) rotate(1deg);
  }
}

.main-our-services > *,
.main-mobile > * {
  position: relative;
  z-index: 1;
}

/* تحسينات للأداء والسلاسة */
.service-items,
.service-items-mobile {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.card,
.card-mobile {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* تحسينات الأداء */
.service,
.service-item-mobile {
  will-change: transform, opacity, filter;
}

.title,
.title-mobile,
.subtitle,
.subtitle-mobile {
  will-change: transform, opacity, filter;
}
</style>