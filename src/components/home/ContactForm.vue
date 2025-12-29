<template>
  <section class="contact-section" id="contact" ref="sectionContainer" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
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
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

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

  if (effectsElement.value) effectsElement.value.classList.add('active');

  const isDesktop = window.innerWidth >= 768;

  if (isDesktop) {
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

// Watch for language change to re-trigger animations if needed
watch(locale, () => {
  hasAnimated.value = false;
  if (sectionContainer.value && observer) {
    observer.unobserve(sectionContainer.value);
    observer.observe(sectionContainer.value);
  }
});

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
/* ============================================= */
/*              Base Styles                      */
/* ============================================= */
.contact-section {
  width: 100%;
  background: #100E0E;
  overflow: hidden;
  height: auto;
  padding: 30px 20px;
  box-sizing: border-box;
  box-shadow: 0 10px 40px 14px rgba(233, 72, 14, 0.2);
  border-radius: 20px;
}

/* ============================================= */
/*              Latest Part Styles               */
/* ============================================= */
.latest-part {
  position: relative;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.frame {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: linear-gradient(to bottom right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom right / 50% 50% no-repeat,
              linear-gradient(to bottom left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom left / 50% 50% no-repeat,
              linear-gradient(to top left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top left / 50% 50% no-repeat,
              linear-gradient(to top right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top right / 50% 50% no-repeat,
              url(/images/bg-last-section.jpg) center/cover no-repeat;
  border-radius: 16px;
  overflow: hidden;
  isolation: isolate;
  box-sizing: border-box;
}

/* ============================================= */
/*              Background Effects               */
/* ============================================= */
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

/* ============================================= */
/*              Logo Animation                   */
/* ============================================= */
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
  width: 80px;
  transition: transform 0.5s ease;
}

.logo.active img {
  animation: logoFloat 6s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ============================================= */
/*              Title & Subtitle                 */
/* ============================================= */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.title {
  color: #FFF;
  font-family: "Bebas Neue";
  font-size: 32px;
  font-weight: 400;
  line-height: 125%;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
  word-break: break-word;
  hyphens: auto;
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
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s;
  max-width: 90%;
  margin: 0 auto;
}

.subtitle.active {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================= */
/*              Form Part Styles                 */
/* ============================================= */
.form-part {
  background: #100E0E;
  width: 100%;
}

.form-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0px 0px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  background: rgba(16, 14, 10, 0.9);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

/* ============================================= */
/*              Form Elements                    */
/* ============================================= */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.form-label {
  color: #FFFFFF;
  font-size: 21px;
  line-height: 125%;
  font-weight: 500;
  letter-spacing: 0.5px;
}

input, textarea {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  letter-spacing: 0.5px;
  line-height: 1.5;
  font-family: Inter, sans-serif;
  box-sizing: border-box;
  text-align: start;
}

input::placeholder, textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-family: Inter, sans-serif;
}

input:focus, textarea:focus {
  border-color: #E9480E;
  box-shadow: 0 0 0 3px rgba(233, 72, 14, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
}

/* ============================================= */
/*              RTL Specific Styles              */
/* ============================================= */
.contact-section[dir="rtl"] input,
.contact-section[dir="rtl"] textarea {
  text-align: right;
  direction: rtl;
}

.contact-section[dir="rtl"] .form-label,
.contact-section[dir="rtl"] .subtitle,
.contact-section[dir="rtl"] .success-message,
.contact-section[dir="rtl"] .error-message-general {
  font-family: 'Noto Sans Arabic', 'Cairo', 'Inter', sans-serif;
  text-align: right;
}

.contact-section[dir="rtl"] .title-underline {
  left: auto;
  right: 0;
}

/* ============================================= */
/*              Error States                     */
/* ============================================= */
.error-input {
  border-color: #ff4d4f !important;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.contact-section[dir="rtl"] .error-input {
  animation: shakeRTL 0.5s ease-in-out;
}

@keyframes shakeRTL {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
  font-family: Inter, sans-serif;
}

.error-message-general {
  color: #ff4d4f;
  font-size: 14px;
  padding: 12px;
  background: rgba(255, 77, 79, 0.1);
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
  font-family: Inter, sans-serif;
}

/* ============================================= */
/*              Submit Button                    */
/* ============================================= */
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
  font-size: 18px;
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
  font-family: "Bebas Neue", sans-serif;
  letter-spacing: 1px;
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

/* ============================================= */
/*              Loading Spinner                  */
/* ============================================= */
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

.submitting-text { 
  display: inline-flex; 
  align-items: center; 
  gap: 8px; 
  font-family: Inter, sans-serif;
}

/* ============================================= */
/*              Success Message                  */
/* ============================================= */
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
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-top: 16px;
  font-family: Inter, sans-serif;
}

.success-icon { 
  width: 24px; 
  height: 24px; 
  fill: #4caf50; 
}

/* ============================================= */
/*              Transitions                      */
/* ============================================= */
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.5s ease; 
}

.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

/* ============================================= */
/*              Responsive & Media Queries       */
/* ============================================= */
@media (max-width: 767px) {
  .contact-section { padding: 20px 16px; }
  .latest-part { margin-bottom: 20px; }
  .frame { padding: 30px 20px; border-radius: 12px; }
  .title { font-size: 32px; }
  .subtitle { font-size: 16px; padding: 0 10px; }
  .logo img { width: 70px; }
  .submit-btn { width: 100%; max-width: none; padding: 16px 24px; }
}

@media (max-width: 480px) {
  .frame { padding: 24px 16px; }
  .title { font-size: 28px; }
  .subtitle { font-size: 14px; }
  .logo img { width: 60px; }
  .form-label { font-size: 15px; }
  input, textarea { font-size: 14px; padding: 12px 14px; }
  .submit-btn { font-size: 16px; padding: 14px 20px; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .contact-section { padding: 40px 30px; display: flex; flex-direction: column; }
  .title { font-size: 44px; }
  .subtitle { font-size: 20px; max-width: 80%; }
  .logo img { width: 100px; }
  .submit-btn { max-width: 200px; padding: 10px 20px; font-size: 22px; }
}

@media (min-width: 768px) and (max-width: 1023px) and (orientation: landscape) {
  .contact-section { flex-direction: row; gap: 40px; align-items: stretch; }
  .latest-part, .form-part { flex: 1; }
}

@media (min-width: 1024px) and (max-width: 1199px) {
  .contact-section { flex-direction: row; padding: 50px 40px; gap: 50px; align-items: stretch; max-width: 1200px; margin: 0 auto; }
  .latest-part { flex: 1; }
  .form-part { flex: 1; display: flex; align-items: center; }
  .frame { height: 100%; min-height: 300px; padding: 0 40px; border-radius: 20px 0 0 20px; }
  .form-wrapper { height: 100%; padding: 60px 40px; border-radius: 0 20px 20px 0; display: flex; align-items: center; }
  .title { font-size: 52px; }
  .subtitle { font-size: 22px; max-width: 90%; }
  .logo img { width: 120px; }
}

@media (min-width: 1200px) {
  .contact-section {
    display: flex;
    flex-direction: row;
    height: auto;
    min-height: auto;
    padding: 45px 40px;
    margin: 0px auto;
    max-width: 1400px;
    border-radius: 20px;
    align-items: stretch;
    gap: 0;
  }

  .latest-part {
    flex: 1;
    height: auto;
    margin-bottom: 0;
    border-radius: 20px 0 0 20px;
    position: relative;
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
  }

  .frame {
    height: 100%;
    border-radius: 20px 0 0 20px;
    padding: 0 60px;
  }

  .form-wrapper {
    height: 100%;
    margin: 0;
    padding: 80px 60px;
    border-radius: 0 20px 20px 0;
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 64px;
  }

  .subtitle {
    font-size: 24px;
    max-width: 90%;
  }

  .logo img {
    width: 140px;
  }

  .form-label {
    font-size: 36px;
    line-height: 125%;
  }

  input, textarea {
    padding: 18px 22px;
    font-size: 16px;
  }

  .submit-btn {
    max-width: 250px;
    padding: 20px 45px;
    font-size: 20px;
  }

  .circle-1 { width: 350px; height: 350px; }
  .circle-2 { width: 250px; height: 250px; }
  .circle-3 { width: 200px; height: 200px; }
}

@media (min-width: 1440px) {
  .contact-section { max-width: 1600px; padding: 45px 40px; }
  .title { font-size: 72px; }
  .subtitle { font-size: 28px; }
  .logo img { width: 160px; }
  input, textarea { font-size: 25px; }
  .submit-btn { max-width: 280px; padding: 22px 50px; font-size: 22px; }
}

/* ============================================= */
/*              Reduced Motion & Accessibility   */
/* ============================================= */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .logo.active img, .background-effects.active .effect-circle { animation: none; }
}

@media (prefers-contrast: high) {
  .contact-section { border: 2px solid #E9480E; }
  input:focus, textarea:focus { outline: 3px solid #E9480E; outline-offset: 2px; }
}

@media (prefers-color-scheme: light) {
  .contact-section { background: #f5f5f5; }
  .form-wrapper { background: rgba(255, 255, 255, 0.9); }
  .form-label { color: #333; }
  input, textarea { background: rgba(0, 0, 0, 0.05); border-color: rgba(0, 0, 0, 0.2); color: #333; }
  input::placeholder, textarea::placeholder { color: rgba(0, 0, 0, 0.4); }
}
</style>