<template>
  <section class="contact-section" id="contact" ref="sectionContainer">
    <!-- الجزء العلوي: LatestSection (العنوان + اللوجو + التأثيرات) -->
    <div class="latest-part" ref="latestPart">
      <div class="frame">
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
      </div>
    </div>

    <!-- الجزء السفلي: ContactForm -->
    <div class="form-part">
      <div class="form-wrapper">
        <form @submit.prevent="submitForm" class="form">
          <!-- حقل الاسم -->
          <div class="form-group animated-input" ref="nameGroup">
            <label for="name" class="form-label">{{ $t('form.name') }}</label>
            <input
              id="name"
              type="text"
              v-model="formData.name"
              :placeholder="$t('form.namePlaceholder')"
              :class="{ 'error-input': errors.name }"
              @focus="clearError('name')"
              required
            />
            <span v-if="errors.name" class="error-message">{{ $t('form.validation.name') }}</span>
          </div>

          <!-- حقل الإيميل -->
          <div class="form-group animated-input" ref="emailGroup">
            <label for="email" class="form-label">{{ $t('form.email') }}</label>
            <input
              id="email"
              type="email"
              v-model="formData.email"
              :placeholder="$t('form.emailPlaceholder')"
              :class="{ 'error-input': errors.email }"
              @focus="clearError('email')"
              required
            />
            <span v-if="errors.email" class="error-message">{{ emailErrorText }}</span>
          </div>

          <!-- حقل الرسالة -->
          <div class="form-group animated-input" ref="messageGroup">
            <label for="message" class="form-label">{{ $t('form.message') }}</label>
            <textarea
              id="message"
              v-model="formData.message"
              :placeholder="$t('form.messagePlaceholder')"
              :class="{ 'error-input': errors.message }"
              @focus="clearError('message')"
              rows="4"
              required
            ></textarea>
            <span v-if="errors.message" class="error-message">{{ messageErrorText }}</span>
          </div>

          <!-- زر الإرسال -->
          <button
            type="submit"
            class="submit-btn animated-button"
            ref="submitBtn"
            :disabled="submitting"
            :class="{ 'submitting': submitting }"
          >
            <span v-if="!submitting" class="tracking-[1px] font-medium">
              {{ $t('form.submit') }}
            </span>
            <span v-else class="submitting-text">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
              </svg>
              {{ $t('form.submitting') }}
            </span>
          </button>

          <!-- رسائل النجاح والخطأ -->
          <transition name="fade">
            <div v-if="success" class="success-message">
              <svg class="success-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>{{ successMessage || $t('form.successMessage') }}</span>
            </div>
          </transition>

          <transition name="fade">
            <div v-if="errors.general" class="error-message-general">
              {{ $t('form.validation.general') }}
            </div>
          </transition>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Refs
const sectionContainer = ref(null);
const effectsElement = ref(null);
const logoElement = ref(null);
const titleElement = ref(null);
const subtitleElement = ref(null);
const nameGroup = ref(null);
const emailGroup = ref(null);
const messageGroup = ref(null);
const submitBtn = ref(null);

// Form state
const formData = reactive({
  name: '',
  email: '',
  message: ''
});

const submitting = ref(false);
const success = ref(false);
const errors = reactive({});
const hasAnimated = ref(false);
let observer = null;

// Formspree endpoint
const formspreeEndpoint = 'https://formspree.io/f/mzzjpvez';
const successMessage = '';

// Computed
const emailErrorText = computed(() => 
  errors.email === 'invalid' ? t('form.validation.emailInvalid') : t('form.validation.email')
);

const messageErrorText = computed(() => 
  errors.message === 'short' ? t('form.validation.messageShort') : t('form.validation.message')
);

// Form validation & submission
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let valid = true;

  if (!formData.name.trim()) { errors.name = true; valid = false; }
  if (!formData.email.trim()) { errors.email = 'required'; valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { errors.email = 'invalid'; valid = false; }
  if (!formData.message.trim()) { errors.message = 'required'; valid = false; }
  else if (formData.message.trim().length < 10) { errors.message = 'short'; valid = false; }

  return valid;
};

const clearError = (field) => delete errors[field];

const resetForm = () => {
  Object.assign(formData, { name: '', email: '', message: '' });
  success.value = false;
  Object.keys(errors).forEach(key => delete errors[key]);
};

const submitForm = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    const res = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: 'homepage_form',
        _gotcha: ''
      })
    });

    if (res.ok) {
      success.value = true;
      resetForm();
      setTimeout(() => success.value = false, 5000);
    } else {
      errors.general = true;
    }
  } catch (err) {
    errors.general = true;
    console.error('Network error:', err);
  } finally {
    submitting.value = false;
  }
};

// Animations
const startAnimations = () => {
  if (hasAnimated.value) return;
  hasAnimated.value = true;

  // تأثيرات خلفية
  if (effectsElement.value) effectsElement.value.classList.add('active');

  // Detect if desktop
  const isDesktop = window.innerWidth >= 768;

  if (isDesktop) {
    // Desktop animations (slower timing)
    setTimeout(() => logoElement.value?.classList.add('active'), 300);
    setTimeout(() => titleElement.value?.classList.add('active'), 600);
    setTimeout(() => subtitleElement.value?.classList.add('active'), 900);

    const animateInput = (el, delay) => {
      if (el?.value) {
        el.value.style.opacity = '0';
        el.value.style.transform = 'translateY(30px)';
        el.value.style.filter = 'blur(5px)';
        setTimeout(() => {
          el.value.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.value.style.opacity = '1';
          el.value.style.transform = 'translateY(0)';
          el.value.style.filter = 'blur(0)';
        }, delay);
      }
    };

    animateInput(nameGroup, 1200);
    animateInput(emailGroup, 1400);
    animateInput(messageGroup, 1600);
    setTimeout(() => submitBtn.value?.classList.add('active'), 1800);
  } else {
    // Mobile animations (original timing)
    setTimeout(() => logoElement.value?.classList.add('active'), 200);
    setTimeout(() => titleElement.value?.classList.add('active'), 400);
    setTimeout(() => subtitleElement.value?.classList.add('active'), 600);

    const animateInput = (el, delay) => {
      if (el?.value) {
        el.value.style.opacity = '0';
        el.value.style.transform = 'translateY(30px)';
        el.value.style.filter = 'blur(5px)';
        setTimeout(() => {
          el.value.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.value.style.opacity = '1';
          el.value.style.transform = 'translateY(0)';
          el.value.style.filter = 'blur(0)';
        }, delay);
      }
    };

    animateInput(nameGroup, 800);
    animateInput(emailGroup, 900);
    animateInput(messageGroup, 1000);
    setTimeout(() => submitBtn.value?.classList.add('active'), 1100);
  }
};

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !hasAnimated.value) {
      startAnimations();
      observer.unobserve(sectionContainer.value);
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  if (sectionContainer.value) observer.observe(sectionContainer.value);
});

onUnmounted(() => observer?.disconnect());
</script>

<style scoped>
.contact-section {
  width: 100%;
  background: #100E0E;
  overflow: hidden;
  height: 100%;
}

/* Latest Part */
.latest-part {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frame {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 100%;
  padding: 0 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  background: linear-gradient(to bottom right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom right / 50% 50% no-repeat,
              linear-gradient(to bottom left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom left / 50% 50% no-repeat,
              linear-gradient(to top left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top left / 50% 50% no-repeat,
              linear-gradient(to top right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top right / 50% 50% no-repeat,
              url(/images/bg-last-section.jpg) center/cover no-repeat;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  isolation: isolate;
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

.circle-1 { width: 200px; height: 200px; top: -50px; left: -50px; }
.circle-2 { width: 150px; height: 150px; bottom: -30px; right: 10%; transition-delay: 0.2s; }
.circle-3 { width: 120px; height: 120px; top: 50%; left: 80%; transition-delay: 0.4s; }

.background-effects.active .effect-circle {
  opacity: 1;
  transform: scale(1);
}

.background-effects.active .circle-1 { animation: floatCircle 15s ease-in-out infinite; }
.background-effects.active .circle-2 { animation: floatCircle 12s ease-in-out infinite reverse; animation-delay: 1s; }
.background-effects.active .circle-3 { animation: floatCircle 10s ease-in-out infinite; animation-delay: 0.5s; }

@keyframes floatCircle {
  0%, 100% { transform: scale(1) translate(0, 0); }
  33% { transform: scale(1.05) translate(20px, 10px); }
  66% { transform: scale(0.95) translate(-10px, 15px); }
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
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* أنيميشن العنوان */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.title {
  color: #FFF;
  font-family: "Bebas Neue";
  font-size: 40px;
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

.subtitle {
  color: #FFF;
  font-family: Inter;
  font-size: 22px;
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

/* Form Part */
.form-part {
  background: #100E0E;
}

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
  /* border: 1px solid rgba(255, 255, 255, 0.1); */
  border-radius: 0 0 20px 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  width: 100%;
}

.contact-section {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px 14px rgba(233, 72, 14, 0.2);
  border-radius: 20px;

}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.form-label {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
}

input, textarea {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  letter-spacing: 1px;
  line-height: 1;
}

input::placeholder, textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

input:focus, textarea:focus {
  border-color: #E9480E;
  box-shadow: 0 0 0 3px rgba(233, 72, 14, 0.2);
  background: rgba(255, 255, 255, 0.08);
  line-height: 1;
}

textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.2;
}

.error-input {
  border-color: #ff4d4f !important;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

[dir="rtl"] .error-input { animation: shakeRTL 0.5s ease-in-out; }

@keyframes shakeRTL {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
}

.error-message {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 4px;
}

.error-message-general {
  color: #ff4d4f;
  font-size: 0.875rem;
  padding: 12px;
  background: rgba(255, 77, 79, 0.1);
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #E9480E, #FF6B3A);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 8px;
  width: 100%;
  max-width: 200px;
  align-self: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s;
}

.submit-btn.active {
  opacity: 1;
  transform: translateY(0);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.submit-btn:hover::before { left: 100%; }

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 30px rgba(233, 72, 14, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: rotate 1s linear infinite;
}

.spinner circle {
  stroke: white;
  stroke-linecap: round;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate { 100% { transform: rotate(360deg); } }
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

.submitting-text { display: inline-flex; align-items: center; gap: 8px; }

.success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  color: #4caf50;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin-top: 16px;
}

.success-icon { width: 24px; height: 24px; fill: #4caf50; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ============================================= */
/*              Desktop Styles                   */
/* ============================================= */

@media (min-width: 768px) {
  .contact-section {
    display: flex;
    flex-direction: row;
    min-height: 400px;
    max-height: 600px;
    /* max-width: 1200px; */
    width: 100%;
    /* margin: 40px auto; */
    border-radius: 20px;
    overflow: hidden;
    /* box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); */
    background: #100E0E;
    padding: 50px;
    margin: 0 auto;
    
    
  }

  .latest-part {
    flex: 1;
    height: auto;
    border-radius: 20px ;
    position: relative;
    overflow: hidden;
  }

  .latest-part::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(233, 72, 14, 0.1));
    z-index: 1;
    pointer-events: none;
  }

  [dir="rtl"] .latest-part::before {
    right: auto;
    left: 0;
    background: linear-gradient(to left, transparent, rgba(233, 72, 14, 0.1));
  }

  .form-part {
    flex: 1;
    display: flex;
    align-items: center;
    background: #100E0E;
  }

  .frame {
    height: 100%;
    min-height: 600px;
    border-radius: 20px 0 0 20px;
    padding: 0 40px;
    justify-content: center;
    max-width: none;
  }

  .form-wrapper {
    border-radius: 0 20px 20px 0;
    height: 100%;
    margin: 0;
    padding: 60px 40px;
    border: none;
    /* border-left: 1px solid rgba(255, 255, 255, 0.1); */
    max-width: none;
    display: flex;
    align-items: center;
    min-height: 600px;
  }

  .form {
    max-width: 450px;
    margin: 0 auto;
    width: 100%;
  }

  .title {
    font-size: 44px;
    text-align: center;
  }

  .subtitle {
    font-size: 18px;
    text-align: center;
    max-width: 90%;
  }

  .logo img {
    width: 120px;
  }

  .submit-btn {
    max-width: 220px;
  }

  /* Desktop specific hover effects */
  

  .form-group:hover::after,
  .form-group:focus-within::after {
    width: 100%;
    opacity: 1;
  }

  .form-group:hover {
    transform: translateX(5px);
    transition: transform 0.3s ease;
  }

  [dir="rtl"] .form-group:hover {
    transform: translateX(-5px);
  }

  .frame:hover .background-effects .effect-circle {
    animation-play-state: running;
  }
}

@media (min-width: 1024px) {
  .contact-section {
    min-height: 700px;
    max-width: 1400px;
  }

  .frame {
    min-height: 700px;
    padding: 0 60px;
  }

  .form-wrapper {
    padding: 80px 60px;
    min-height: 700px;
  }

  .title {
    font-size: 64px;
  }

  .subtitle {
    font-size: 24px;
  }

  .logo img {
    width: 140px;
  }

  .form {
    max-width: 500px;
  }

  .form-label {
    font-size: 1.7rem;
  }

  input, textarea {
    padding: 18px 22px;
    font-size: 1.325rem;
  }

  .submit-btn {
    max-width: 250px;
    padding: 20px 45px;
    font-size: 1.5rem;
  }

  /* تحسينات إضافية للديسكتوب */
  .circle-1 { width: 350px; height: 350px; }
  .circle-2 { width: 250px; height: 250px; }
  .circle-3 { width: 200px; height: 200px; }

  .background-effects {
    will-change: transform;
  }
  
  .effect-circle {
    will-change: transform, opacity;
  }
}

@media (min-width: 1440px) {
  .contact-section {
    min-height: 800px;
    max-width: 1600px;
  }

  .frame {
    min-height: 800px;
  }

  .form-wrapper {
    min-height: 800px;
  }

  .title {
    font-size: 72px;
  }

  .subtitle {
    font-size: 28px;
  }

  .logo img {
    width: 160px;
  }
}

/* ============================================= */
/*              Mobile Styles                    */
/* ============================================= */

@media (max-width: 767px) {
  .latest-part { height: 350px; padding-top: 30px; }
  .frame { padding: 0 32px; }
  .title { font-size: 32px; }
  .subtitle { font-size: 16px; }
  .form-wrapper { padding: 30px 20px; }
  .submit-btn { max-width: 180px; }
}

@media (max-width: 480px) {
  .latest-part { height: 300px;padding-top: 0px; }
  .title { font-size: 28px; }
  .submit-btn { width: 100%; max-width: 100%; }
}

/* RTL Support */
[dir="rtl"] .title-underline { left: auto; right: 0; }
[dir="rtl"] input, [dir="rtl"] textarea { text-align: right; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>