<template>
  <footer class="site-footer bg-[#151212] text-white">
    <div class="footer-content mx-auto px-4 sm:px-6 lg:px-[64px] ">
      <!-- Main Footer Content -->
      <div class="footer-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">

        <!-- Column 1: Logo -->
        <div class="footer-col">
          <a href="/" class="logo-link inline-block mb-6">
            <img src="@/assets/logo.svg" alt="Logo" class="logo w-auto h-12 md:h-14" loading="lazy" width="185"
              height="48">
          </a>
        </div>

        <!-- Column 2: Address and Social Media -->
        <div class="footer-col">
          <h4 class="footer-title mb-4">{{ $t('footer.address.title') }}</h4>
          <p class="text-gray-400 mb-6">{{ $t('footer.address.text') }}</p>
          <div class="social-icons flex items-center gap-4">
            <a href="https://facebook.com"
              class="social-icon p-2 rounded-full bg-white/5 hover:bg-[#E9480E] transition-all duration-300 group"
              target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/icons/media/facebook.svg" alt="Facebook"
                class="w-5 h-5 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                loading="lazy">
            </a>
            <a href="https://google.com"
              class="social-icon p-2 rounded-full bg-white/5 hover:bg-[#E9480E] transition-all duration-300 group"
              target="_blank" rel="noopener noreferrer" aria-label="Google">
              <img src="/icons/media/google.svg" alt="Google"
                class="w-5 h-5 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                loading="lazy">
            </a>
            <a href="https://wa.me/966581670316"
              class="social-icon p-2 rounded-full bg-white/5 hover:bg-[#E9480E] transition-all duration-300 group"
              target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <img src="/icons/media/whatsapp.svg" alt="WhatsApp"
                class="w-5 h-5 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                loading="lazy">
            </a>
            <a href="https://www.youtube.com/@prostdios?si=6pDhdqlsGtVqVZs_"
              class="social-icon p-2 rounded-full bg-white/5 hover:bg-[#E9480E] transition-all duration-300 group"
              target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <img src="/icons/media/youtube.svg" alt="YouTube"
                class="w-5 h-5 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                loading="lazy">
            </a>
          </div>
        </div>

        <!-- Column 3: Quick Links -->
        <div class="footer-col">
          <h4 class="footer-title mb-4">{{ $t('nav.quickLinks', 'Quick Links') }}</h4>
          <ul class="space-y-3">
            <li>
              <button @click="scrollToSection('services')" class="footer-link group flex items-center w-full text-left"
                :aria-label="$t('footer.links.services')">
                <span class="link-text">{{ $t('footer.links.services') }}</span>
                <span
                  class="link-arrow ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </button>
            </li>
            <li>
              <button @click="scrollToSection('gallery')" class="footer-link group flex items-center w-full text-left"
                :aria-label="$t('footer.links.gallery')">
                <span class="link-text">{{ $t('footer.links.gallery') }}</span>
                <span
                  class="link-arrow ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </button>
            </li>
            <li>
              <router-link to="/blog" class="footer-link group flex items-center" :aria-label="$t('footer.links.blog')">
                <span class="link-text">{{ $t('footer.links.blog') }}</span>
                <span
                  class="link-arrow ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="footer-link group flex items-center"
                :aria-label="$t('footer.links.contactUs')">
                <span class="link-text">{{ $t('footer.links.contactUs') }}</span>
                <span
                  class="link-arrow ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 4: Contact Info -->
        <div class="footer-col">
          <h4 class="footer-title mb-4">{{ $t('footer.contacts.title') }}</h4>
          <ul class="contact-info space-y-4">
            <li class="flex items-start gap-3">
              <div class="contact-icon w-5 h-5  flex-shrink-0">
                <svg class="w-full h-full text-[#E9480E]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div>
                <a :href="emailHref" class="contact-link hover:text-[#E9480E] transition-colors"
                  :aria-label="$t('footer.contacts.email')">
                  {{ cleanEmail }}
                </a>
              </div>
            </li>

            <li class="flex items-start gap-3">
              <div class="contact-icon w-5 h-5  flex-shrink-0">
                <svg class="w-full h-full text-[#E9480E]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <div class="space-y-1">
                <a :href="`tel:${$t('footer.contacts.phone1').replace(/\s/g, '')}`"
                  class="contact-link block hover:text-[#E9480E] transition-colors"
                  :aria-label="$t('footer.contacts.phone1')">
                  {{ $t('footer.contacts.phone1') }}
                </a>
                <a :href="`tel:${$t('footer.contacts.phone2').replace(/\s/g, '')}`"
                  class="contact-link block hover:text-[#E9480E] transition-colors"
                  :aria-label="$t('footer.contacts.phone2')">
                  {{ $t('footer.contacts.phone2') }}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom border-t border-[#514F4F] pt-8 pb-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <!-- Copyright -->
          <div class="copyright text-center md:text-left">
            <p class="text-[#939393] text-sm">
              {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
              <a href="https://prostdios.com/" target="_blank" class="hover:text-[#E9480E] transition-colors"
                rel="noopener noreferrer">
                {{ $t('footer.company') }}
              </a>
            </p>
          </div>

          <!-- Legal Links -->
          <div class="legal-links flex items-center gap-6">
            <router-link to="/privacy-policy"
              class="legal-link text-[#939393] hover:text-white text-sm transition-colors"
              :aria-label="$t('footer.privacyPolicy')">
              {{ $t('footer.privacyPolicy') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const cleanEmail = computed(() => {
  const email = t('footer.contacts.email');
  // Convert [at] back to @ for mailto link
  return email.replace('[at]', '@');
});

const emailHref = computed(() => {
  const email = t('footer.contacts.email');
  return `mailto:${email.replace('[at]', '@')}`;
});

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }
}
</script>

<style scoped>
.site-footer {
  background: #151212;
  position: relative;
  overflow: hidden;
}

.footer-content {
  max-width: 1920px;
  position: relative;
  z-index: 1;
}

/* Logo */
.logo {
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* Footer Titles */
.footer-title {
  font-weight: 500;
  /* أفضل من 400 للتباين */
  font-size: 24px;
  /* زيادة من 20px → 24px */
  line-height: 1.3;
  text-transform: uppercase;
  color: white;
  position: relative;
  display: inline-block;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  /* زيادة المسافة قليلاً */
  left: 0;
  width: 70px;
  /* خط أطول قليلاً */
  height: 3px;
  /* أسمك */
  background: #E9480E;
  border-radius: 2px;
}

/* Footer Links */
.footer-link {
  color: #c0c0c0;
  /* لون أفتح قليلاً لتباين أفضل */
  font-size: 18px;
  /* زيادة من 16px → 18px */
  font-weight: 400;
  padding: 0.5rem 0;
  /* مسافة أكبر بين الروابط */
  transition: all 0.3s ease;
  text-transform: uppercase;
  cursor: pointer;
}

.footer-link:hover {
  color: #E9480E;
  padding-left: 8px;
  /* حركة أكثر وضوحاً */
}

.link-text {
  position: relative;
}

.link-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #E9480E;
  transition: width 0.3s ease;
}

.footer-link:hover .link-text::after {
  width: 100%;
}

/* Social Icons */
.social-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-icon:hover {
  transform: translateY(-2px) scale(1.1);
  border-color: #E9480E;
  box-shadow: 0 4px 12px rgba(233, 72, 14, 0.2);
}

/* Contact Info */
.contact-info {
  color: #a0a0a0;
}

.contact-link {
  color: #c0c0c0;
  font-size: 18px;
  /* نفس حجم الروابط */
  transition: all 0.3s ease;
  line-height: 1.6;
  /* مسافة أكبر بين السطور */
}

.contact-link:hover {
  color: #E9480E;
}

.contact-icon {
  opacity: 0.7;
}

/* Legal Links */
.legal-link {
  position: relative;
}

.legal-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #E9480E;
  transition: width 0.3s ease;
}

.legal-link:hover::after {
  width: 100%;
}


.footer-col p {
  font-size: 17px;
  /* زيادة من الافتراضي */
  line-height: 1.7;
  color: #b0b0b0;
}

/* Copyright في الأسفل */
.copyright p {
  font-size: 15px;
  /* من text-sm (14px) إلى 15px */
  color: #a0a0a0;
}

.legal-link {
  font-size: 15px;
  /* نفس الحجم */
  color: #a0a0a0;
}

/* Responsive Design */
@media (max-width: 950px) {
  .footer-title {
    font-size: 22px;
    /* بدلاً من 18px */
  }

  .footer-link,
  .contact-link {
    font-size: 17px;
    /* مريح جداً على الجوال */
  }
}

@media (max-width: 768px) {
  .footer-title {
    font-size: 21px;
  }

  .footer-link,
  .contact-link {
    font-size: 17px;
  }

  .copyright p,
  .legal-link {
    font-size: 14.5px;
  }
}

@media (max-width: 480px) {
  .footer-title {
    font-size: 20px;
  }

  .footer-link,
  .contact-link {
    font-size: 16.5px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {

  .footer-col,
  .footer-link,
  .social-icon,
  .logo {
    animation: none !important;
    transition: none !important;
  }

  .link-arrow,
  .link-text::after,
  .legal-link::after {
    display: none;
  }

  .footer-link:hover {
    padding-left: 0;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .site-footer {
    background: #000;
    border-top: 3px solid #fff;
  }

  .footer-link,
  .contact-link,
  .legal-link {
    color: #fff;
  }

  .social-icon {
    border: 2px solid #fff;
  }
}
</style>