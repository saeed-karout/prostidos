<template>
  <div v-if="error" class="error">
    An error occurred: {{ error.message }}
  </div>
  <div v-else>
    <div class="hero z-10 relative">
      <video class="absolute top-0 left-0 w-full h-full object-cover z-0" autoplay loop muted playsinline>
        <source src="@/assets/new-video/Hero.mp4" type="video/mp4" />
        {{ $t('videoUnsupported') }}
      </video>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient z-10 flex justify-start items-center">

        <div class="text-video pl-[72px]">
          <div class="content">
            <div class="small">
              {{ t('contact.small') }}
            </div>

            <div class="big">
              {{ t('contact.big') }}


            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="form-section">
      <div class="form">
        <form @submit.prevent="submitForm">
          <div class="input">
            <div class="title">{{ $t('form.name') }}</div>
            <input type="text" name="name" :placeholder="$t('form.namePlaceholder')" v-model="formData.name"
              :class="{ 'error-input': errors.name }" required />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>
          <div class="input">
            <div class="title">{{ $t('form.email') }}</div>
            <input type="email" name="email" :placeholder="$t('form.emailPlaceholder')" v-model="formData.email"
              :class="{ 'error-input': errors.email }" required />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </div>
          <div class="input">
            <div class="title">{{ $t('form.message') }}</div>
            <textarea class="name" name="message" :placeholder="$t('form.messagePlaceholder')"
              v-model="formData.message" :class="{ 'error-input': errors.message }" required></textarea>
            <span v-if="errors.message" class="error">{{ errors.message }}</span>
          </div>
          <button type="submit" :disabled="submitting">
            {{ submitting ? $t('form.submitting') : $t('form.submit') }}
          </button>
          <div v-if="errors.general" class="error">{{ errors.general }}</div>
          <div v-if="succeeded" class="success-message">
            {{ $t('form.successMessage') }}
          </div>
        </form>
      </div>

      <div class="data-contact md:block hidden">
        <div class="logo">
          <img src="/logo.svg" :alt="$t('logoAlt')" />
        </div>
        <div class="paragraph">{{ $t('contact.address') }}</div>
        <div class="social">
          <div class="icon">
            <img src="/icons/media/sms.svg" :alt="$t('contact.emailIcon')" />
          </div>
          <div class="text">Info@ProStdios.com</div>
        </div>
        <div class="social">
          <div class="icon">
            <img src="/icons/media/call.svg" :alt="$t('contact.phoneIcon')" />
          </div>
          <div class="text">{{ $t('contact.phone1') }}</div>
        </div>
        <div class="social">
          <div class="icon">
            <img src="/icons/media/call-calling.svg" :alt="$t('contact.phoneIcon')" />
          </div>
          <div class="text">{{ $t('contact.phone2') }}</div>
        </div>
        <div class="social-media">
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
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
.error {
  color: red;
  text-align: center;
  padding: 20px;
}
</style>
<style scoped>
/* Original styles unchanged */
.hero {
  width: 100%;
  height: 562px;
  flex-shrink: 0;
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
  font-family: Rockwell;
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
  transition: background 0.3s ease, color 0.3s ease;
  max-width: 210px;
}

button:hover {
  background: #E9480E;
  color: #FFF;
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
}

.bg-gradient {
  background: linear-gradient(0deg, rgba(233, 72, 14, 0.47) 10%, transparent 100%);
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

  /* 22/Reg Rockwell */
  font-family: Rockwell;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  /* 27.5px */
}

.text-video .content .big {
  color: #FFF;
  font-family: Rockwell;
  font-size: 56px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  /* 70px */
}

/* Responsive adjustments */
@media (max-width: 1100px) {
  .hero {
    height: 300px;
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
    /* Hide on mobile */
  }

  .text-video .content .small {
    color: #FFF;

    /* 22/Reg Rockwell */
    font-family: Rockwell;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    /* 27.5px */
  }


  .text-video .content .big {
    color: #FFF;
    font-family: Rockwell;
    font-size: 38;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    /* 70px */
  }
}

@media (max-width: 768px) {
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
  }

  .text-video .content .small {
    color: #FFF;

    /* 22/Reg Rockwell */
    font-family: Rockwell;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    /* 27.5px */
  }


  .text-video .content .big {
    color: #FFF;
    font-family: Rockwell;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    /* 70px */
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
</style>