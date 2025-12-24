<template>
  <div v-if="error" class="error">
    An error occurred: {{ error.message }}
  </div>
  <div v-else>
    <div class="hero z-10 relative" ref="heroSection">
      <video 
        class="absolute top-0 left-0 w-full h-full object-cover z-0 video-background" 
        autoplay 
        loop 
        muted 
        playsinline
        ref="videoEl"
      >
        <source src="@/assets/new-video/beachy.mp4" type="video/mp4" />
        {{ $t('videoUnsupported') }}
      </video>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient z-10 flex justify-start items-center gradient-overlay" ref="gradientOverlay">

        <div class="text-video pl-[72px]" ref="textVideo">
          <div class="content">
            <div class="small animated-text" ref="smallText">
              {{ t('contact.small') }}
            </div>

            <div class="big animated-text" ref="bigText">
              {{ t('contact.big') }}
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="form-section" ref="formSection">
      <div class="form">
        <form @submit.prevent="submitForm">
          <div class="input animated-input" ref="nameInput">
            <div class="title">{{ $t('form.name') }}</div>
            <input type="text" name="name" :placeholder="$t('form.namePlaceholder')" v-model="formData.name"
              :class="{ 'error-input': errors.name }" required />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>
          <div class="input animated-input" ref="emailInput">
            <div class="title">{{ $t('form.email') }}</div>
            <input type="email" name="email" :placeholder="$t('form.emailPlaceholder')" v-model="formData.email"
              :class="{ 'error-input': errors.email }" required />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="input animated-input" ref="messageInput">
            <div class="title">{{ $t('form.message') }}</div>
            <textarea class="name" name="message" :placeholder="$t('form.messagePlaceholder')"
              v-model="formData.message" :class="{ 'error-input': errors.message }" required></textarea>
            <span v-if="errors.message" class="error">{{ errors.message }}</span>
          </div>
          <button type="submit" :disabled="submitting" class="animated-button" ref="submitButton">
            {{ submitting ? $t('form.submitting') : $t('form.submit') }}
          </button>
          <div v-if="errors.general" class="error">{{ errors.general }}</div>
          <div v-if="succeeded" class="success-message">
            {{ $t('form.successMessage') }}
          </div>
        </form>
      </div>

      <div class="data-contact md:block hidden" ref="contactInfo">
        <div class="logo animated-logo">
          <img src="/logos/logo.svg" :alt="$t('logoAlt')" />
        </div>
        <div class="paragraph animated-text">{{ $t('contact.address') }}</div>
        <div class="social animated-social">
          <div class="icon">
            <img src="/icons/media/sms.svg" :alt="$t('contact.emailIcon')" />
          </div>
          <div class="text">Info@ProStdios.com</div>
        </div>
        <div class="social animated-social">
          <div class="icon">
            <img src="/icons/media/call.svg" :alt="$t('contact.phoneIcon')" />
          </div>
          <div class="text">{{ $t('contact.phone1') }}</div>
        </div>
        <div class="social animated-social">
          <div class="icon">
            <img src="/icons/media/call-calling.svg" :alt="$t('contact.phoneIcon')" />
          </div>
          <div class="text">{{ $t('contact.phone2') }}</div>
        </div>
        <div class="social-media animated-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="item">
            <img src="/icons/media/facebook.svg" :alt="$t('contact.social.facebook')" />
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" class="item">
            <img src="/icons/media/whatsapp.svg" :alt="$t('contact.social.whatsapp')" />
          </a>
          <a href="https://google.com" target="_blank" rel="noopener noreferrer" class="item">
            <img src="/icons/media/google.svg" :alt="$t('contact.social.google')" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="item">
            <img src="/icons/media/youtube.svg" :alt="$t('contact.social.youtube')" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Refs للأنيميشن
const heroSection = ref(null);
const videoEl = ref(null);
const gradientOverlay = ref(null);
const textVideo = ref(null);
const smallText = ref(null);
const bigText = ref(null);
const formSection = ref(null);
const nameInput = ref(null);
const emailInput = ref(null);
const messageInput = ref(null);
const submitButton = ref(null);
const contactInfo = ref(null);

// حالة الأنيميشن
const hasAnimated = ref(false);
const formHasAnimated = ref(false);

const formspreeEndpoint = 'https://formspree.io/f/mzzjpvez';
const formData = reactive({
  name: '',
  email: '',
  message: ''
});
const submitting = ref(false);
const succeeded = ref(false);
const errors = ref({});
const error = ref(null);

// دالة لإعداد أنيميشن الهيرو
const setupHeroAnimations = () => {
  if (hasAnimated.value) return;
  hasAnimated.value = true;

  // أنيميشن الفيديو
  if (videoEl.value) {
    videoEl.value.style.opacity = '0';
    videoEl.value.style.transform = 'scale(1.1)';
    videoEl.value.style.filter = 'blur(10px)';
    
    setTimeout(() => {
      videoEl.value.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      videoEl.value.style.opacity = '1';
      videoEl.value.style.transform = 'scale(1)';
      videoEl.value.style.filter = 'blur(0)';
    }, 300);
  }

  // أنيميشن الجرادينت
  if (gradientOverlay.value) {
    gradientOverlay.value.style.opacity = '0';
    setTimeout(() => {
      gradientOverlay.value.style.transition = 'opacity 0.8s ease 0.3s';
      gradientOverlay.value.style.opacity = '1';
    }, 400);
  }

  // أنيميشن النص
  const animateText = () => {
    const elements = [smallText.value, bigText.value];
    
    elements.forEach((el, index) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.filter = 'blur(5px)';
        
        setTimeout(() => {
          el.style.transition = `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.2 + 0.5}s`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.style.filter = 'blur(0)';
        }, 500);
      }
    });
  };

  setTimeout(animateText, 600);
};

// دالة لإعداد أنيميشن الفورم
const setupFormAnimations = () => {
  if (formHasAnimated.value) return;
  formHasAnimated.value = true;

  const animateElements = () => {
    const elements = [
      nameInput.value,
      emailInput.value,
      messageInput.value,
      submitButton.value,
      contactInfo.value
    ];

    elements.forEach((el, index) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.filter = 'blur(3px)';
        
        setTimeout(() => {
          el.style.transition = `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15 + 0.3}s`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
          el.style.filter = 'blur(0)';
        }, 400);
      }
    });
  };

  setTimeout(animateElements, 300);
};

// إعادة تعيين الأنيميشن
const resetAnimations = () => {
  const elements = [
    videoEl.value,
    gradientOverlay.value,
    smallText.value,
    bigText.value,
    nameInput.value,
    emailInput.value,
    messageInput.value,
    submitButton.value,
    contactInfo.value
  ];

  elements.forEach(el => {
    if (el) {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = '';
      el.style.filter = '';
    }
  });
};

// Intersection Observers
let heroObserver;
let formObserver;

onMounted(() => {
  // إعادة تعيين الأنيميشن أولاً
  resetAnimations();

  // إعداد الـ Observer للهيرو
  heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated.value) {
        entry.target.classList.add('in-view');
        setupHeroAnimations();
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  // إعداد الـ Observer للفورم
  formObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !formHasAnimated.value) {
        entry.target.classList.add('in-view');
        setupFormAnimations();
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  // بدء المراقبة
  if (heroSection.value) {
    heroObserver.observe(heroSection.value);
  }
  
  if (formSection.value) {
    formObserver.observe(formSection.value);
  }
});

onUnmounted(() => {
  if (heroObserver) {
    heroObserver.disconnect();
  }
  if (formObserver) {
    formObserver.disconnect();
  }
});

async function submitForm() {
  submitting.value = true;
  succeeded.value = false;
  errors.value = {};

  if (!formData.name.trim()) {
    errors.value.name = t('form.validation.name');
    submitting.value = false;
    return;
  }
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.value.email = t('form.validation.email');
    submitting.value = false;
    return;
  }
  if (!formData.message.trim()) {
    errors.value.message = t('form.validation.message');
    submitting.value = false;
    return;
  }

  try {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _gotcha: ''
      })
    });

    const responseData = await response.json();
    console.log('Formspree response:', responseData);

    if (response.ok) {
      succeeded.value = true;
      formData.name = '';
      formData.email = '';
      formData.message = '';
    } else {
      errors.value = responseData.errors?.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {}) || { general: t('form.validation.general') };
    }
  } catch (error) {
    console.error('Form submission error:', error);
    errors.value = { general: t('form.validation.network') };
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* Original styles unchanged */
.hero {
  width: 100%;
  height: 562px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

/* أنيميشن الفيديو */
.video-background {
  transform: scale(1.1);
  opacity: 0;
  filter: blur(10px);
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.gradient-overlay {
  background: linear-gradient(0deg, rgba(233, 72, 14, 0.47) 10%, transparent 100%);
  opacity: 0;
  transition: opacity 0.8s ease 0.3s;
}

/* أنيميشن النص */
.animated-text {
  opacity: 0;
  transform: translateY(30px);
  filter: blur(5px);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* أنيميشن العناصر */
.animated-input,
.animated-button,
.animated-logo,
.animated-social {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  filter: blur(3px);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* حالة الأنيميشن عند الظهور */
.in-view .video-background {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

.in-view .gradient-overlay {
  opacity: 1;
}

.in-view .animated-text {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.in-view .animated-input,
.in-view .animated-button,
.in-view .animated-logo,
.in-view .animated-social {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.form-section {
  display: flex;
  width: 100%;
  padding: 96px 64px;
  justify-content: center;
  align-items: center;
  gap: 136px;
  flex-shrink: 0;
  background: #100E0E;
  background-image: url(@/assets/Gradient.png);
  background-repeat: no-repeat;
  background-position: 0;
  background-size: cover;
}

.form {
  display: flex;
  width: 597px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  flex-shrink: 0;
}

.input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
}

.input .title {
  color: #FFF;
  /* font-family: Rockwell; */
  font-size: 18px;
  font-weight: 700;
  line-height: 125%;
  align-self: stretch;
}

input {
  display: flex;
  padding: 14px 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #FFF;
  font-size: 20px;
  line-height: 1;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #E9480E;
  box-shadow: 0 0 0 2px rgba(233, 72, 14, 0.2);
  transform: translateY(-2px);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-family: Rockwell;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
}

textarea {
  display: flex;
  height: 144px;
  padding: 14px 16px;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #FFF;
  transition: all 0.3s ease;
  resize: vertical;
}

textarea:focus {
  border-color: #E9480E;
  box-shadow: 0 0 0 2px rgba(233, 72, 14, 0.2);
  transform: translateY(-2px);
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-family: Rockwell;
  font-size: 16px;
  font-weight: 400;
  line-height: 125%;
}

button {
  display: flex;
  padding: 16px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 144px;
  background: #FFF;
  color: var(--Orange-orange-500, #E9480E);
  font-family: Rockwell;
  font-size: 18px;
  font-weight: 700;
  line-height: 125%;
  transition: all 0.3s ease;
  max-width: 210px;
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(233, 72, 14, 0.2), transparent);
  transition: left 0.6s ease;
}

button:hover::before {
  left: 100%;
}

button:hover {
  background: #E9480E;
  color: #FFF;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 25px rgba(233, 72, 14, 0.3);
}

button:active {
  transform: translateY(-1px) scale(1.02);
}

.data-contact {
  display: flex;
  width: 335px;
  padding: 40px 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex-shrink: 0;
  align-self: stretch;
}

.logo {
  display: flex;
  width: 252px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.paragraph {
  color: var(--Black-black-5, #DBDBDB);
  font-family: Rockwell;
  font-size: 18px;
  font-weight: 400;
  line-height: 125%;
  width: 252px;
}

.social {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.social:hover {
  transform: translateX(5px);
}

.social .icon {
  display: flex;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
}

.social .text {
  color: var(--Black-black-5, #DBDBDB);
  text-align: center;
  font-family: Rockwell;
  font-size: 18px;
  font-weight: 400;
  line-height: 125%;
}

.social-media {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-media .item {
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.social-media .item:hover {
  transform: scale(1.2) rotate(5deg);
}

.text-video {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

.text-video .content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.text-video .content .small {
  color: #FFF;
  font-family: Rockwell;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.text-video .content .big {
  color: #FFF;
  font-family: Rockwell;
  font-size: 56px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
}

/* Responsive adjustments */
@media (max-width: 1100px) {
  .hero {
    height: 100vh; /* تغيير إلى 100vh للجوال */
    min-height: 100vh;
  }

  .form-section {
    padding: 32px 16px;
    flex-direction: column;
    gap: 32px;
    height: auto;
  }

  .form {
    width: 100%;
    gap: 24px;
  }

  .input .title {
    font-size: 16px;
  }

  input {
    font-size: 16px;
    padding: 12px 14px;
  }

  input::placeholder {
    font-size: 14px;
  }

  textarea {
    height: 120px;
    padding: 12px 14px;
  }

  textarea::placeholder {
    font-size: 14px;
  }

  button {
    width: 100%;
    padding: 14px 32px;
    font-size: 16px;
  }

  .data-contact {
    display: none;
  }

  .text-video .content .small {
    font-family: Rockwell;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
  }

  .text-video .content .big {
    font-family: Rockwell;
    font-size: 38px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
  }
}

@media (max-width: 768px) {
  .hero {
    height: 100vh; /* تأكيد 100vh للجوال */
  }

  .form {
    align-items: flex-end;
  }

  .input .title {
    text-align: right;
  }

  input,
  textarea {
    text-align: right;
  }

  .text-video{
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
  }

  .text-video .content {
    width: 100%;
    align-items: flex-start;
  }

  .text-video .content .small {
    font-family: Rockwell;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
  }

  .text-video .content .big {
    font-family: Rockwell;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
  }
}

/* Add feedback styles */
.error {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
  display: block;
  font-family: Rockwell;
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

.success-message {
  color: #4caf50;
  font-size: 16px;
  margin-top: 16px;
  font-weight: 700;
  font-family: Rockwell;
  text-align: center;
  padding: 12px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) and (dir: rtl) {
  .error,
  .success-message {
    text-align: right;
  }
}

form {
  width: 100%;
  gap: 32px;
  display: flex;
  flex-direction: column;
}

/* تحسينات الأداء */
.hero,
.form-section {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.video-background,
.animated-text,
.animated-input {
  will-change: transform, opacity, filter;
}
</style>