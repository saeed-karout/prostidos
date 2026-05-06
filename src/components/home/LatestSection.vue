<template>
  <div class="main" ref="mainElement">
    <div class="frame" ref="frameElement">
      <!-- تأثيرات خلفية متحركة -->
      <div class="background-effects" ref="effectsElement">
        <div class="effect-circle circle-1"></div>
        <div class="effect-circle circle-2"></div>
        <div class="effect-circle circle-3"></div>
      </div>
      
      <div class="logo" ref="logoElement">
        <img src="/logos/logo.svg" alt="Logo">
      </div>

      <div class="content">
        <div class="title" ref="titleElement">
          <span class="title-text">{{ $t('contacts.title') }}</span>
          <div class="title-underline"></div>
        </div>

        <div class="subtitle" ref="subtitleElement">
          {{ $t('contacts.subtitle') }}
        </div>
      </div>
      
      <!-- <router-link to="/contact" class="button-link">
        <div class="buttons" ref="buttonElement">
          <span class="button-text">{{ $t('contacts.button') }}</span>
          <div class="button-glow"></div>
        </div>
      </router-link> -->


     
    </div>


    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';


const mainElement = ref(null);
const frameElement = ref(null);
const logoElement = ref(null);
const titleElement = ref(null);
const subtitleElement = ref(null);
const buttonElement = ref(null);
const effectsElement = ref(null);

let observer = null;
let hasAnimated = false;

// دالة لتنفيذ الأنيميشن عند الظهور
const startAnimations = () => {
  if (hasAnimated) return;
  hasAnimated = true;
  
  // أنيميشن الإطار
  if (frameElement.value) {
    frameElement.value.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    frameElement.value.style.opacity = '1';
    frameElement.value.style.transform = 'translateY(0)';
  }
  
  // أنيميشن التأثيرات الخلفية
  if (effectsElement.value) {
    effectsElement.value.classList.add('active');
  }
  
  // أنيميشن اللوجو
  if (logoElement.value) {
    setTimeout(() => {
      logoElement.value.classList.add('active');
    }, 200);
  }
  
  // أنيميشن العنوان
  if (titleElement.value) {
    setTimeout(() => {
      titleElement.value.classList.add('active');
    }, 400);
  }
  
  // أنيميشن العنوان الفرعي
  if (subtitleElement.value) {
    setTimeout(() => {
      subtitleElement.value.classList.add('active');
    }, 600);
  }
  
  // أنيميشن الزر
  if (buttonElement.value) {
    setTimeout(() => {
      buttonElement.value.classList.add('active');
    }, 800);
  }
};

// إعادة تعيين الأنيميشن
const resetAnimations = () => {
  if (frameElement.value) {
    frameElement.value.style.transition = 'none';
    frameElement.value.style.opacity = '0';
    frameElement.value.style.transform = 'translateY(30px)';
  }
  
  [effectsElement, logoElement, titleElement, subtitleElement, buttonElement].forEach(ref => {
    if (ref.value) {
      ref.value.classList.remove('active');
    }
  });
  
  hasAnimated = false;
};

onMounted(() => {
  // إعداد الحالة الأولية للأنيميشن
  resetAnimations();
  
  // إعداد Intersection Observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        // بدء الأنيميشن عند رؤية العنصر
        startAnimations();
        // التوقف عن المراقبة بعد التنفيذ الأول
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3, // عندما يكون 30% من العنصر مرئيًا
    rootMargin: '0px 0px -100px 0px' // تنشيط مبكر قليلاً
  });
  
  // بدء مراقبة العنصر الرئيسي
  if (mainElement.value) {
    observer.observe(mainElement.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.main {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #100E0E;
  position: relative;
  overflow: hidden;
  
  /* margin: 0 auto; */
  height: 400px;

}

.frame {
  display: flex;
  height: 100%;
  margin: 0 auto;
  flex-direction: column;
  padding: 0px 64px;
  max-width: 600px;
  justify-content: center;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  background: linear-gradient(to bottom right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom right / 50% 50% no-repeat, 
              linear-gradient(to bottom left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom left / 50% 50% no-repeat, 
              linear-gradient(to top left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top left / 50% 50% no-repeat, 
              linear-gradient(to top right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top right / 50% 50% no-repeat, 
              url(/images/bg-last-section.jpg) lightgray 50% / cover no-repeat;
  position: relative;
  isolation: isolate;
  opacity: 0;
  transform: translateY(30px);
}

/* تأثيرات الخلفية المتحركة */
.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
  z-index: -1;
}

.effect-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(233, 72, 14, 0.1) 0%, transparent 70%);
  filter: blur(20px);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 1s ease, transform 1s ease;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  right: 10%;
  transition-delay: 0.2s;
}

.circle-3 {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 80%;
  transition-delay: 0.4s;
}

.background-effects.active .effect-circle {
  opacity: 1;
  transform: scale(1);
}

.background-effects.active .circle-1 {
  animation: floatCircle 15s ease-in-out infinite;
}

.background-effects.active .circle-2 {
  animation: floatCircle 12s ease-in-out infinite reverse;
  animation-delay: 1s;
}

.background-effects.active .circle-3 {
  animation: floatCircle 10s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes floatCircle {
  0%, 100% {
    transform: scale(1) translate(0, 0);
  }
  33% {
    transform: scale(1.05) translate(20px, 10px);
  }
  66% {
    transform: scale(0.95) translate(-10px, 15px);
  }
}

/* أنيميشن اللوجو */
.logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6.822px;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
}

.logo.active {
  opacity: 1;
  transform: translateY(0);
}

.logo img {
  width: 100%;
  transition: transform 0.5s ease;
}

.logo.active img {
  animation: logoFloat 6s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* أنيميشن العنوان */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.content .title {
  color: #FFF;
  font-family: "Bebas Neue";
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
}

.title.active {
  opacity: 1;
  transform: translateY(0);
}

.title-text {
  position: relative;
  z-index: 2;
  display: inline-block;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.title-underline {
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #E9480E, #FF8C42);
  border-radius: 2px;
  transition: width 1s ease 0.6s;
}

.title.active .title-underline {
  width: 100%;
}

/* أنيميشن العنوان الفرعي */
.content .subtitle {
  color: #FFF;
  font-family: Inter;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s;
}

.subtitle.active {
  opacity: 1;
  transform: translateY(0);
}

/* أنيميشن الزر */
.button-link {
  text-decoration: none;
}

.buttons {
  display: flex;
  padding: 16px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 144px;
  background: #FFF;
  color: var(--Orange-orange-500, #E9480E);
  font-family: "Bebas Neue";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s;
}

.buttons.active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.button-text {
  position: relative;
  z-index: 2;
  /* top: 2px; */
  line-height: .9;
  transition: all 0.3s ease;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(233, 72, 14, 0.2), 
    transparent);
  transition: left 0.6s ease;
}

.buttons:hover {
  background: #E9480E;
  color: #FFF;
  cursor: pointer;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(233, 72, 14, 0.3);
}

.buttons:hover .button-glow {
  left: 100%;
}

/* تحسينات للهواتف */
@media (max-width: 768px) {
  .main {
    display: flex;
    height: 400px;
    /* padding: 0px 16px; */
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  }

  .content .title{
    font-size: 32px;
  }
  .content .subtitle{
    font-size: 16px;
  }

  .frame {
    display: flex;
    /* padding: 0px 16px; */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    flex: 1 0 0;
    align-self: stretch;
  }

  .logo {
    width: 150px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    align-self: stretch;
  }

  .title {
    align-self: stretch;
    color: #FFF;
    text-align: center;
    font-family: "Bebas Neue";
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
  }

  .subtitle {
    color: #FFF;
    text-align: center;
    font-family: "Inter";
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 125%;
  }
  
  /* تبسيط الأنيميشن للهواتف */
  .background-effects {
    display: none;
  }
}

/* RTL Support for Arabic */
[dir="rtl"] .main {
  align-items: flex-end;
}

[dir="rtl"] .logo {
  align-items: flex-end;
}

[dir="rtl"] .content {
  align-items: center;
}

[dir="rtl"] .title-underline {
  left: auto;
  right: 0;
}

/* إيقاف الأنيميشن للذين يفضلون تقليل الحركة */
@media (prefers-reduced-motion: reduce) {
  .frame,
  .logo,
  .title,
  .subtitle,
  .buttons,
  .effect-circle,
  .title-underline {
    transition: none !important;
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  
  .frame {
    opacity: 1;
    transform: none;
  }
  
  .background-effects {
    display: none;
  }
}
</style>