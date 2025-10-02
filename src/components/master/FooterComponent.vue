<template>
  <footer class="bg-[#151212] text-white min-h-[200px] ">
    <div class="content  mx-auto p-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-16">
        <!-- First Column: Logo -->
        <div class="section-logo">
          <a href="https://plateau.media/" target="_blank">
            <img src="@/assets/logo.svg" alt="Logo" class="logo max-w-[150px]">
          </a>
        </div>

        <!-- Second Column: Address and Social Media -->
        <div class="section-two">
          <h4 class="title mb-4">{{ $t('footer.address.title') }}</h4>
          <p class="mb-4">{{ $t('footer.address.text') }}</p>
          <div class="flex flex-row w-[132px] h-[24px] gap-3">
            <a href="https://facebook.com" class="social-media" target="_blank" rel="noopener noreferrer">
              <img src="/icons/media/facebook.svg" alt="Facebook" class="w-6 h-6">
            </a>
            <a href="https://google.com" class="social-media" target="_blank" rel="noopener noreferrer">
              <img src="/icons/media/google.svg" alt="Google" class="w-6 h-6">
            </a>
            <a href="https://whatsapp.com" class="social-media" target="_blank" rel="noopener noreferrer">
              <img src="/icons/media/whatsapp.svg" alt="WhatsApp" class="w-6 h-6">
            </a>
            <a href="https://youtube.com" class="social-media" target="_blank" rel="noopener noreferrer">
              <img src="/icons/media/youtube.svg" alt="YouTube" class="w-6 h-6">
            </a>
          </div>
        </div>

        <!-- Third Column: Quick Links -->
        <div class="section-two flex flex-col gap-3 uppercase">
          <h4 class="title cursor-pointer" @click="scrollToSection('services')">{{ $t('footer.links.services') }}</h4>
          <h4 class="title cursor-pointer" @click="scrollToSection('gallery')">{{ $t('footer.links.gallery') }}</h4>
          <router-link to="/blog" class="title">{{ $t('footer.links.blog') }}</router-link>
          <router-link to="/contact" class="title">{{ $t('footer.links.contactUs') }}</router-link>
        </div>

        <!-- Fourth Column: Contact Info -->
        <div class="section-two">
          <h4 class="title mb-4">{{ $t('footer.contacts.title') }}</h4>
          <div class="info">
            <div class="row">
              <div class="icon"></div>
              <div class="text">{{ $t('footer.contacts.phone1') }}</div>
            </div>
            <div class="row">
              <div class="icon"></div>
              <div class="text">{{ $t('footer.contacts.phone2') }}</div>
            </div>
            <div class="row">
              <div class="icon"></div>
              <div class="text">{{ email }}</div> <!-- Use computed email -->
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Copyright and Privacy -->
      <div class="flex justify-center items-center copy-right">
        <span class="flex gap-1 text-sm text-[#939393] p-[8px]">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
          <a href="https://prostdios.com/" target="_blank">
            {{ $t('footer.company') }}
          </a>
          <span class="mx-2">|</span>
          <router-link to="/privacy-policy">{{ $t('footer.privacyPolicy') }}</router-link>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';


const email = computed(() => 'Info@ProStdios.com'); // Avoid I18n parsing issue

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.error(`Element with ID ${sectionId} not found`);
  }
}
</script>



<style scoped>
.gradient-text {
  background: linear-gradient(180deg, #E9480E, #100E0E);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 64px 80px 0px 80px;
}

footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.section-logo {
  width: 252px;
  padding: 48px 0;
  gap: 8px;
}

.logo {
  width: 185px;
  height: 48px;
}

.section-two {
  width: 252px;
  padding-top: 48px;
  gap: 20px;
}

.title {
  font-family: Rockwell;
  font-weight: 400;
  font-size: 20px;
  line-height: 125%;
  text-transform: uppercase;
}

.title:hover {
  color: #E9480E;
  cursor: pointer;
}

.social-media img {
  width: 24px;
  height: 24px;
}

.info .row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.info .text {
  font-size: 16px;
}

/* Responsive adjustments */
@media (max-width: 950px) {
  .content {
    padding: 32px 16px 0;
  }

  footer {
    height: auto;
  }

  .section-logo,
  .section-two {
    width: 100%;
    padding-top: 24px;
    text-align: start;
  }

  .section-logo {
    display: flex;
    justify-content: start;
  }

  .section-two .flex {
    justify-content: start;
    margin-left: 0;
    padding-left: 0;

  }

  .title {
    font-size: 18px;
  }

  .info .row {
    justify-content: start;
    gap: 0;
  }

  .flex-row {
    justify-content: start;
  }
}

.copy-right{
  border-top: 1px solid var(--Black-black-9, #514F4F);
  padding: 16px 0;
}
</style>