<template>
  <footer class="site-footer bg-dark text-white">
    <div class="footer-content">
      <!-- Footer Main -->
      <div class="main-footer">
        <!-- روابط التنقل -->
        <div class="footer-links">
          <button 
            @click="scrollToSection('hero')"
            class="links link-item"
            :aria-label="$t('nav.home')"
          >
            {{ $t('nav.home') }}
          </button>
          <button 
            @click="scrollToSection('services')"
            class="links link-item"
            :aria-label="$t('nav.services')"
          >
            {{ $t('nav.services') }}
          </button>
          <a 
            href="https://vimeo.com/artvelmedia" 
            target="_blank"
            rel="noopener noreferrer"
            class="links link-item"
            :aria-label="$t('nav.portfolio')"
          >
            {{ $t('nav.portfolio') }}
          </a>
        </div>

        <!-- كتلة الاتصال والشبكات الاجتماعية -->
        <div class="links-block">
          <!-- رابط البريد الإلكتروني -->
          <a 
            :href="emailHref" 
            class="email group"
            :aria-label="$t('footer.contactEmail')"
          >
            <span class="email-text">
              {{ cleanEmail }}
            </span>
            <span class="email-underline"></span>
          </a>

          <!-- الشبكات الاجتماعية -->
          <div class="social-cubes-grid">
            <!-- Facebook -->
            <div class="dice-cube-wrapper group" data-platform="facebook">
              <a href="https://facebook.com" class="dice-cube-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <div class="dice-cube">
                  <div class="dice-face dice-face-1"><div class="face-content"><font-awesome-icon :icon="['fab', 'facebook-f']" class="dice-icon" /></div></div>
                  <div class="dice-face dice-face-2"><div class="face-content"><font-awesome-icon :icon="['fab', 'facebook-f']" class="dice-icon" /><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-3"><div class="face-content"><font-awesome-icon :icon="['fab', 'facebook-f']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-4"><div class="face-content"><font-awesome-icon :icon="['fab', 'facebook-f']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-5"><div class="face-content"><font-awesome-icon :icon="['fab', 'facebook-f']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-6"><div class="face-content"><font-awesome-icon :icon="['fab', 'facebook-f']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                </div>
                <span class="dice-tooltip">Facebook</span>
              </a>
            </div>

            <!-- X (Twitter) -->
            <div class="dice-cube-wrapper group" data-platform="x">
              <a href="https://x.com/prostdios_sa" class="dice-cube-link" target="_blank" rel="noopener noreferrer" aria-label="X">
                <div class="dice-cube">
                  <div class="dice-face dice-face-1"><div class="face-content"><font-awesome-icon :icon="['fab', 'x-twitter']" class="dice-icon" /></div></div>
                  <div class="dice-face dice-face-2"><div class="face-content"><font-awesome-icon :icon="['fab', 'x-twitter']" class="dice-icon" /><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-3"><div class="face-content"><font-awesome-icon :icon="['fab', 'x-twitter']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-4"><div class="face-content"><font-awesome-icon :icon="['fab', 'x-twitter']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-5"><div class="face-content"><font-awesome-icon :icon="['fab', 'x-twitter']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-6"><div class="face-content"><font-awesome-icon :icon="['fab', 'x-twitter']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                </div>
                <span class="dice-tooltip">X</span>
              </a>
            </div>

            <!-- WhatsApp -->
            <div class="dice-cube-wrapper group" data-platform="whatsapp">
              <a href="https://wa.me/966581670316" class="dice-cube-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <div class="dice-cube">
                  <div class="dice-face dice-face-1"><div class="face-content"><font-awesome-icon :icon="['fab', 'whatsapp']" class="dice-icon" /></div></div>
                  <div class="dice-face dice-face-2"><div class="face-content"><font-awesome-icon :icon="['fab', 'whatsapp']" class="dice-icon" /><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-3"><div class="face-content"><font-awesome-icon :icon="['fab', 'whatsapp']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-4"><div class="face-content"><font-awesome-icon :icon="['fab', 'whatsapp']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-5"><div class="face-content"><font-awesome-icon :icon="['fab', 'whatsapp']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-6"><div class="face-content"><font-awesome-icon :icon="['fab', 'whatsapp']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                </div>
                <span class="dice-tooltip">WhatsApp</span>
              </a>
            </div>

            <!-- YouTube -->
            <div class="dice-cube-wrapper group" data-platform="youtube">
              <a href="https://www.youtube.com/@prostdios" class="dice-cube-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <div class="dice-cube">
                  <div class="dice-face dice-face-1"><div class="face-content"><font-awesome-icon :icon="['fab', 'youtube']" class="dice-icon" /></div></div>
                  <div class="dice-face dice-face-2"><div class="face-content"><font-awesome-icon :icon="['fab', 'youtube']" class="dice-icon" /><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-3"><div class="face-content"><font-awesome-icon :icon="['fab', 'youtube']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-4"><div class="face-content"><font-awesome-icon :icon="['fab', 'youtube']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-5"><div class="face-content"><font-awesome-icon :icon="['fab', 'youtube']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-6"><div class="face-content"><font-awesome-icon :icon="['fab', 'youtube']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                </div>
                <span class="dice-tooltip">YouTube</span>
              </a>
            </div>

            <!-- TikTok -->
            <div class="dice-cube-wrapper group" data-platform="tiktok">
              <a href="https://www.tiktok.com/@prostdios" class="dice-cube-link" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <div class="dice-cube">
                  <div class="dice-face dice-face-1"><div class="face-content"><font-awesome-icon :icon="['fab', 'tiktok']" class="dice-icon" /></div></div>
                  <div class="dice-face dice-face-2"><div class="face-content"><font-awesome-icon :icon="['fab', 'tiktok']" class="dice-icon" /><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-3"><div class="face-content"><font-awesome-icon :icon="['fab', 'tiktok']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-4"><div class="face-content"><font-awesome-icon :icon="['fab', 'tiktok']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-5"><div class="face-content"><font-awesome-icon :icon="['fab', 'tiktok']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                  <div class="dice-face dice-face-6"><div class="face-content"><font-awesome-icon :icon="['fab', 'tiktok']" class="dice-icon" /><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div></div>
                </div>
                <span class="dice-tooltip">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="bottom-content">
          <div class="copyright">
            <p class="copyright-text">
              {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
              <a 
                href="https://prostdios.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="company-link"
              >
                {{ $t('footer.company') }}
              </a>
            </p>
          </div>

          <button 
            @click="scrollToTop"
            class="to-top"
            :aria-label="$t('footer.backToTop')"
          >
            <span class="to-top-content">
              {{ $t('footer.backToTop') }}
              <span class="to-top-arrow">↑</span>
            </span>
          </button>

          <div class="legal-links">
            <span class="countries-text">
              {{ $t('footer.countries') }}
            </span>
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
  return email.replace('[at]', '@');
});

const emailHref = computed(() => {
  const email = t('footer.contacts.email');
  return `mailto:${email.replace('[at]', '@')}`;
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
};
</script>

<style scoped>
/* الأساسيات */
.site-footer {
  background-color: #151212;
  color: white;
  z-index: 50;
  padding-top: 5rem;
  padding-bottom: 3rem;
  position: relative;
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #E9480E, transparent);
  opacity: 0.3;
}

.footer-content {
  /* max-width: 1400px; */
  margin: 0 auto;
  padding-left: 4rem;
  padding-right: 4rem;
}

/* القسم الرئيسي */
.main-footer {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .main-footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

/* روابط التنقل */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .footer-links {
    flex-direction: row;
    gap: 2.5rem;
  }
}

.link-item {
  cursor: pointer;
  position: relative;
  padding: 0.5rem 0;
  background: none;
  border: none;
  font-family: inherit;
  color: #b0b0b0;
  font-size: 1.5rem; /* تكبير الخط */
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-item:hover {
  color: white;
  transform: translateX(12px);
}

.link-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #E9480E;
  transition: width 0.3s ease;
}

.link-item:hover::after {
  width: 100%;
}

/* كتلة الاتصال */
.links-block {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .links-block {
    align-items: flex-end;
    text-align: right;
  }
}

/* البريد الإلكتروني */
.email {
  font-size: 2rem; /* تكبير الخط */
  font-weight: 500;
  color: white;
  text-decoration: none;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  /* margin-bottom: 2rem; */
}

@media (min-width: 768px) {
  .email {
    font-size: 2.5rem; /* تكبير أكثر للشاشات الكبيرة */
  }
}

.email-text {
  background: linear-gradient(135deg, #FFF 0%, #E9480E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
}

.email:hover .email-text {
  background: linear-gradient(135deg, #E9480E 0%, #FFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.email-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: #E9480E;
  transform: scaleX(0);
  transition: transform 0.5s ease;
  transform-origin: left;
  box-shadow: 0 0 10px rgba(233, 72, 14, 0.5);
}

.email:hover .email-underline {
  transform: scaleX(1);
}

/* مكعبات الزهر */
.social-cubes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 768px) {
  .social-cubes-grid {
    justify-content: flex-end;
    gap: 2rem;
  }
}

.dice-cube-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  perspective: 1000px;
}

@media (min-width: 768px) {
  .dice-cube-wrapper {
    width: 80px;
    height: 80px;
  }
}

.dice-cube-link {
  display: block;
  width: 100%;
  height: 100%;
}

.dice-cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dice-face {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  backface-visibility: hidden;
  overflow: hidden;
}

.face-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.dice-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
  transition: all 0.6s ease;
}

/* مواضع الوجوه */
.dice-face-1 {
  transform: translateZ(40px);
}

.dice-face-2 {
  transform: rotateX(90deg) translateZ(40px);
}

.dice-face-3 {
  transform: rotateY(90deg) translateZ(40px);
}

.dice-face-4 {
  transform: rotateY(-90deg) translateZ(40px);
}

.dice-face-5 {
  transform: rotateY(180deg) translateZ(40px);
}

.dice-face-6 {
  transform: rotateX(-90deg) translateZ(40px);
}

/* دوران ناعم مستمر عند الهوفر */
.dice-cube-wrapper:hover .dice-cube {
  animation: smoothRotate .5s none linear;
}

@keyframes smoothRotate {
  from {
    transform: rotateX(180deg) rotateY(40deg);
  }
  to {
    transform: rotateX(0deg) rotateY(0deg);
  }
}

/* تأثيرات الهوفر */
.dice-cube-wrapper:hover .dice-icon {
  transform: scale(1.4);
  filter: brightness(1.6) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
}

.dice-cube-wrapper:hover .dice-face {
  box-shadow: inset 0 0 40px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.4);
}

.dice-cube-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: conic-gradient(from 0deg at 50% 50%, #E9480E20, #4285F420, #25D36620, #FF000020, #00000020, #EE1D5220, #69C9D020);
  border-radius: 12px;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: all 0.6s ease;
  filter: blur(12px);
  z-index: -1;
}

.dice-cube-wrapper:hover::before {
  transform: translate(-50%, -50%) scale(1.6);
  opacity: 1;
  animation: rotateGlow 8s linear infinite;
}

@keyframes rotateGlow {
  from {
    transform: translate(-50%, -50%) scale(1.6) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) scale(1.6) rotate(360deg);
  }
}

.dice-tooltip {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0;
  transition: all 0.4s ease;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.dice-cube-wrapper:hover .dice-tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
  bottom: -40px;
}

/* ألوان المنصات */
.dice-cube-wrapper[data-platform="facebook"] .dice-face {
  background: linear-gradient(135deg, #1877F2, #0d5bb5);
}

.dice-cube-wrapper[data-platform="x"] .dice-face {
  background: linear-gradient(135deg, #000000, #1DA1F2);
}

.dice-cube-wrapper[data-platform="whatsapp"] .dice-face {
  background: linear-gradient(135deg, #25D366, #1a9f50);
}

.dice-cube-wrapper[data-platform="youtube"] .dice-face {
  background: linear-gradient(135deg, #FF0000, #cc0000);
}

.dice-cube-wrapper[data-platform="tiktok"] .dice-face {
  background: linear-gradient(135deg, #000000, #EE1D52 50%, #69C9D0);
}

/* القسم السفلي */
.footer-bottom {
  border-top: 1px solid #514F4F;
  padding-top: 2rem;
  margin-top: 2rem;
}

.bottom-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .bottom-content {
    flex-direction: row;
    gap: 2rem;
  }
}

/* حقوق النشر */
.copyright-text {
  color: #a0a0a0;
  font-size: 1.250rem; /* تكبير الخط */
  text-align: center;
}

@media (min-width: 768px) {
  .copyright-text {
    text-align: left;
  }
}

.company-link {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.company-link:hover {
  color: #E9480E;
}

/* زر العودة للأعلى */
.to-top {
  position: relative;
  padding: 0.75rem 2rem;
  background: #E9480E;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 1.125rem; /* تكبير الخط */
  font-weight: 500;
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: 0 4px 12px rgba(233, 72, 14, 0.3);
  overflow: hidden;
}

.to-top:hover {
  background: white;
  color: #E9480E;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(233, 72, 14, 0.4);
}

.to-top:active {
  transform: scale(0.95);
}

.to-top-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.to-top-arrow {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.to-top:hover .to-top-arrow {
  transform: translateY(-4px);
}

/* روابط قانونية */
.countries-text {
  color: #a0a0a0;
  font-size: 1.125rem; /* تكبير الخط */
  position: relative;
  display: inline-block;
  cursor: default;
}

.countries-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #E9480E;
  transition: width 0.3s ease;
}

.countries-text:hover::after {
  width: 100%;
}

/* استجابة للشاشات الصغيرة */
@media (max-width: 640px) {
  .footer-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .email {
    font-size: 1.75rem;
    /* margin-bottom: 1.5rem; */
  }
  
  .link-item {
    font-size: 1.25rem;
  }
  
  .copyright-text,
  .countries-text {
    font-size: 1rem;
  }
  
  .to-top {
    font-size: 1rem;
    padding: 0.5rem 1.5rem;
  }
  
  .dice-cube-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .dice-icon {
    width: 24px;
    height: 24px;
  }
  
  .dice-face-1 { transform: translateZ(30px); }
  .dice-face-2 { transform: rotateX(90deg) translateZ(30px); }
  .dice-face-3 { transform: rotateY(90deg) translateZ(30px); }
  .dice-face-4 { transform: rotateY(-90deg) translateZ(30px); }
  .dice-face-5 { transform: rotateY(180deg) translateZ(30px); }
  .dice-face-6 { transform: rotateX(-90deg) translateZ(30px); }
}

/* التقليل من الحركة */
@media (prefers-reduced-motion: reduce) {
  .dice-cube,
  .dice-cube-wrapper:hover .dice-cube {
    animation: none !important;
    transform: none !important;
  }
  
  .link-item,
  .email,
  .to-top,
  .dice-icon {
    transition: none !important;
  }
}
</style>