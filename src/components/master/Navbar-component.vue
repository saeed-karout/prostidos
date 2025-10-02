<template>
  <nav :class="navClasses">
    <div class="mx-auto main">
      <div class="flex items-center justify-between w-full h-[75px]">
        <!-- Left Side: Mobile Logo or Desktop Links -->
        <div class="flex flex-row items-center w-[364px] gap-4">
          <!-- Mobile Logo -->
          <router-link to="/" class="md:hidden flex items-center">
            <img class="w-[123.5px] h-[32px]" src="@/assets/logo.svg" alt="Your Company Logo">
          </router-link>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-4">
            <div class="flex items-center w-[80px] h-[36px] p-2 gap-2 cursor-pointer" @click="scrollToSection('services')">
              <h2 class="text-white font-normal text-base" style="line-height: 125%;">{{ $t('nav.services') }}</h2>
            </div>
            
            <div class="flex items-center w-[80px] h-[36px] p-2 gap-2 cursor-pointer" @click="scrollToSection('gallery')">
              <h2 class="text-white font-normal text-base" style="line-height: 125%;">{{ $t('nav.gallery') }}</h2>
            </div>

            <router-link to="/blog" class="flex items-center w-[80px] h-[36px] p-2 gap-2 ">
              <h2 class="text-white font-normal text-base " style="line-height: 125%;">{{ $t('nav.blog') }}</h2>
            </router-link>
          </div>
        </div>

        <!-- Center: Desktop Logo -->
        <div class="hidden md:flex text-white space-x-8 lg:space-x-16">
          <router-link to="/">
            <div class="flex items-center">
              <img class="w-[123.5px] h-[32px]" src="@/assets/logo.svg" alt="Your Company Logo">
            </div>
          </router-link>
        </div>

        <!-- Right Side: Desktop Contact and Language, Mobile Burger -->
        <div class="flex items-center">
          <!-- Desktop Contact and Language -->
          <div class="hidden md:flex items-center w-[364px] h-[36px] justify-end gap-4">
            <router-link to="/contact" class="flex items-end h-[36px] p-2 gap-2">
              <h2 class="text-white font-normal text-base" style="line-height: 125%;">{{ $t('nav.contactUs') }}</h2>
            </router-link>

            <div class="space">|</div>

            <div class="language cursor-pointer" @click="toggleLanguage">{{ currentLanguage === 'en' ? 'Ar' : 'En' }}</div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center opacity-50 ml-auto">
            <button @click="toggleMobileMenu" type="button" class="text-white focus:outline-none" ref="menuButton">
              <img src="/icons/menu.svg" alt="Menu Icon">
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Navigation Menu - Moved outside nav for full-screen coverage -->
  <transition
    name="mobile-menu"
    @enter="startMenuAnimation"
    @after-enter="endMenuAnimation"
    @before-leave="startMenuAnimation"
    @after-leave="endMenuAnimation"
  >
    <div 
      v-if="isMobileMenuOpen" 
      ref="mobileMenu" 
      :class="[
        'fixed inset-0 z-[60] bg-black bg-opacity-100 md:hidden',
        { 'hidden': !isMobileMenuOpen }
      ]"
      @click="handleMobileMenuClick"
    >
      <div class="main-mobile">
        <div class="frame-top">
          <router-link to="/" >

            <img src="/logo.svg" width="124px" alt="logo">
          </router-link>
          <img src="/icons/close.svg" class="close-icon cursor-pointer" alt="close" @click="closeMobileMenu">
        </div>

        <div class="frame-router">
          <div class="route cursor-pointer" @click="scrollToSection('services'); closeMobileMenu()">
            <span>{{ $t('nav.services') }}</span>
          </div>
          <div class="route cursor-pointer" @click="scrollToSection('gallery'); closeMobileMenu()">
            <span>{{ $t('nav.gallery') }}</span>
          </div>
          <router-link to="/blog" class="route" @click="closeMobileMenu">
            <span>{{ $t('nav.blog') }}</span>
          </router-link>
          <router-link to="/contact" class="route" @click="closeMobileMenu">
            <span>{{ $t('nav.contactUs') }}</span>
          </router-link>
        </div>

        <div class="change-lang cursor-pointer" @click="toggleLanguage">
          <span>{{ currentLanguage === 'en' ? 'Change Language to Arabic' : 'Change Language to English' }}</span>
        </div>
        <div class="copy-right-mob">
          <div class="links">
            <div class="left">
              <span>Copyright © 2024 By ProStdios</span>
            </div>
            <div class="line"></div>
            <div class="privacy">
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

// i18n setup
const { locale } = useI18n();
const currentLanguage = computed(() => locale.value);

// Load language from localStorage on mount
onMounted(() => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
    locale.value = savedLanguage;
    document.documentElement.lang = savedLanguage;
  } else {
    locale.value = 'en';
    document.documentElement.lang = 'en';
    localStorage.setItem('language', 'en');
  }
});

// Toggle language and save to localStorage
function toggleLanguage() {
  const newLanguage = locale.value === 'en' ? 'ar' : 'en';
  locale.value = newLanguage;
  document.documentElement.lang = newLanguage;
  localStorage.setItem('language', newLanguage);
}

// Animation variables
const isAnimating = ref(false);

// DOM references
const isMobileMenuOpen = ref(false);
const hasScrolled = ref(false);
const isNavbarVisible = ref(true);
const mobileMenu = ref(null);
const menuButton = ref(null);
const lastScrollY = ref(0);

// تحسين دالة فتح وإغلاق القائمة
function toggleMobileMenu() {
  if (isAnimating.value) return;
  
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  
  if (isMobileMenuOpen.value) {
    // عند فتح القائمة
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  } else {
    // عند إغلاق القائمة - ننتظر نهاية animation
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }, 400); // نفس مدة animation
  }
}

// تحسين دالة إغلاق القائمة
function closeMobileMenu() {
  if (isMobileMenuOpen.value && !isAnimating.value) {
    isMobileMenuOpen.value = false;
    
    // إعادة التمرير بعد animation
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }, 400);
  }
}

// تحسين animation handlers
function startMenuAnimation() {
  isAnimating.value = true;
}

function endMenuAnimation() {
  isAnimating.value = false;
  
  // إذا كانت القائمة مغلقة، نعيد التمرير
  if (!isMobileMenuOpen.value) {
    document.body.style.overflow = '';
    document.body.style.height = '';
  }
}

// Handle click inside/outside mobile menu
function handleMobileMenuClick(event) {
  if (event.target === mobileMenu.value) {
    closeMobileMenu();
  }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.error(`Element with ID ${sectionId} not found`);
  }
}

// Handle scroll direction
function handleScroll() {
  if (!isMobileMenuOpen.value) {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
      isNavbarVisible.value = false;
    } else if (currentScrollY < lastScrollY.value || currentScrollY <= 100) {
      isNavbarVisible.value = true;
    }
    lastScrollY.value = currentScrollY;
    hasScrolled.value = currentScrollY > 100;
  }
}

// Handle clicks outside mobile menu
function handleClickOutside(event) {
  if (isMobileMenuOpen.value && window.innerWidth < 768) {
    if (
      mobileMenu.value &&
      !mobileMenu.value.contains(event.target) &&
      menuButton.value &&
      !menuButton.value.contains(event.target)
    ) {
      closeMobileMenu();
    }
  }
}

// Add event listeners on mount
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});

// Remove event listeners on unmount
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  
  // تنظيف أي styles متبقية
  document.body.style.overflow = '';
  document.body.style.height = '';
});

// Computed classes for nav
const navClasses = computed(() => {
  return [
    'fixed top-0 left-0 w-full z-50 transition-all duration-300',
    {
      'bg-[#4C0024]/50 backdrop-blur-md': hasScrolled.value && !isMobileMenuOpen.value,
      'bg-transparent': !hasScrolled.value || isMobileMenuOpen.value,
      'translate-y-0': isNavbarVisible.value,
      '-translate-y-full': !isNavbarVisible.value,
    },
  ];
});
</script>

<style scoped>
.main {
  display: flex;
  width: 100%;
  padding: 27.5px 64px 11.5px 64px;
  justify-content: space-between;
  align-items: center;
}

nav {
  background-color: transparent;
}

nav .md:hidden button {
  transition: color 0.3s ease;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.text-gray-200 {
  color: #E5E7EB;
}

.text-gray-300 {
  color: #D1D5DB;
}

.close-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: transform 0.3s ease-in-out;
}

.close-icon:hover {
  transform: rotate(180deg);
}

hr {
  border-top-width: 3px;
  border-color: #D1D5DB;
}

.space {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  color: white;
}

.language {
  display: flex;
  padding: 8px;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  color: #FFF;
  font-family: Rockwell;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.main-mobile {
  width: 100%;
  height: 100%;
  background: #100E0E;
  display: flex;
  flex-direction: column;
}

.frame-top {
  display: flex;
  width: 100%;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
}

.frame-router {
  display: flex;
  width: 100%;
  padding: 64px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 48px;
  margin: 0 auto;
}

.route {
  display: flex;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}

.route span {
  color: #FFF;
  font-family: Rockwell;
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.copy-right-mob {
  display: flex;
  width: 100%;
  padding: 16px 0;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--Black-black-9, #514F4F);
  margin-top: auto;
}

.copy-right-mob .links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-right-mob .links .left {
  display: flex;
  padding: 8px 8px 8px 0;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.copy-right-mob .links .left span {
  color: var(--Black-black-7, #939393);
  text-align: right;
  font-family: Georgia;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.line {
  width: 1px;
  height: 16px;
  background: var(--Black-black-7, #939393);
}

.copy-right-mob .privacy {
  display: flex;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.copy-right-mob .privacy span {
  color: var(--Black-black-7, #939393);
  text-align: right;
  font-family: Georgia;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.change-lang {
  display: flex;
  position: absolute;
  bottom: 70px;
  width: 100%;
  max-width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.change-lang span {
  color: var(--Black-black-7, #939393);
  font-family: Georgia;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

/* Mobile menu animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Animation for inner content */
.main-mobile {
  transition: transform 0.5s ease;
}

.mobile-menu-enter-active .main-mobile,
.mobile-menu-leave-active .main-mobile {
  transition: transform 0.5s ease;
}

.mobile-menu-enter-from .main-mobile {
  transform: translateX(100%);
}

.mobile-menu-leave-to .main-mobile {
  transform: translateX(100%);
}

.mobile-menu-enter-to .main-mobile,
.mobile-menu-leave-from .main-mobile {
  transform: translateX(0);
}

/* Prevent scrolling during animation */
.no-scroll {
  overflow: hidden;
  height: 100vh;
}

/* Additional improvements for inner elements */
@media (max-width: 760px) {
  .main {
    padding: 0 17px;
  }
}
</style>