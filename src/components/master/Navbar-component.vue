<template>
  <nav :class="navClasses">
    <div class="mx-auto main">
      <div class="flex items-center justify-between w-full h-[75px]">
        <!-- Left Side: Mobile Logo or Desktop Links -->
        <div class="flex flex-row items-center w-[364px] gap-4">
          <!-- Mobile Logo -->
          <router-link to="/" class="md:hidden flex items-center">
            <img class="w-[123.5px] h-[32px]" src="/logos/logo.svg" alt="Your Company Logo">
          </router-link>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center gap-4">
            <router-link to='/' class="flex items-center h-[36px] p-2 gap-2 cursor-pointer">
              <h2 class="text-white font-normal text-[20px]" style="line-height: 125%;">{{ $t('nav.home') }}</h2>
            </router-link>
            <div class="flex items-center h-[36px] p-2 gap-2 cursor-pointer" @click="scrollToSection('services')">
              <h2 class="text-white font-normal text-[20px]" style="line-height: 125%;">{{ $t('nav.services') }}</h2>
            </div>

            <a href="https://vimeo.com/artvelmedia" target="_blank"
              class="flex items-center h-[36px] p-2 gap-2 cursor-pointer">
              <h2 class="text-white font-normal text-[20px]" style="line-height: 125%;">{{ $t('nav.portfolio') }}</h2>
            </a>
          </div>
        </div>

        <!-- Center: Desktop Logo -->
        <div class="hidden md:flex text-white space-x-8 lg:space-x-16">
          <router-link to="/">
            <div class="flex items-center">
              <img class="w-[123.5px] h-[32px]" src="/logos/logo.svg" alt="Your Company Logo">
            </div>
          </router-link>
        </div>

        <!-- Right Side: Desktop Contact and Language, Mobile Burger -->
        <div class="flex items-center">
          <!-- Desktop Contact and Language -->
          <div class="hidden md:flex items-center w-[364px] justify-end gap-4">
            <div @click="scrollToSection('contact')" class="flex items-end p-2 gap-2 cursor-pointer">
              <h2 class="text-white font-normal text-[20px]" style="line-height: 125%;">{{ $t('nav.contactUs') }}</h2>
            </div>

            <div class="space">|</div>

            <div class="language cursor-pointer flex items-center gap-1" @click="toggleLanguage">
              <span>{{ currentLanguage === 'en' ? 'Ar' : 'En' }}</span>
              <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': showLanguageOptions }" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>

              
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center ml-auto">
            <button @click="toggleMobileMenu" type="button" class="text-white focus:outline-none" ref="menuButton">
              <div class="burger-icon" :class="{ 'open': isMobileMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Navigation Menu -->
  <transition name="mobile-menu">
    <div v-if="isMobileMenuOpen" ref="mobileMenu" class="fixed inset-0 z-[9999] md:hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeMobileMenu"></div>
      
      <!-- Menu Content -->
      <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-[#100E0E] shadow-xl overflow-y-auto">
        <div class="flex flex-col h-full">
          <!-- Header with Logo -->
          <div class="p-6 border-b border-white/10">
            <div class="flex justify-center">
              <router-link to="/" @click="closeMobileMenu">
                <img src="/logos/logo.svg" class="h-10 w-auto" alt="logo">
              </router-link>
            </div>
            
            <!-- Close Button -->
            <button @click="closeMobileMenu" class="absolute top-6 right-6 p-1 rounded-full flex justify-center items-center border-[1px]  transition-colors">
              <font-awesome-icon icon="fa-solid fa-xmark" class="text-white w-5" />
            </button>
          </div>

          <!-- Navigation Links -->
          <div class="flex-1 px-6 py-8">
            <div class="space-y-6">
              <router-link to="/" 
                class="flex items-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                @click="closeMobileMenu">
                <span class="text-2xl font-medium text-white group-hover:text-[#E9480E] transition-colors">
                  {{ $t('nav.home') }}
                </span>
                <svg class="w-5 h-5 ml-auto text-white/40 group-hover:text-[#E9480E] transition-all transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>

              <div @click="handleMobileNavClick('services')"
                class="flex items-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                <span class="text-2xl font-medium text-white group-hover:text-[#E9480E] transition-colors">
                  {{ $t('nav.services') }}
                </span>
                <svg class="w-5 h-5 ml-auto text-white/40 group-hover:text-[#E9480E] transition-all transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>

              <a href="https://vimeo.com/artvelmedia" target="_blank"
                class="flex items-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group">
                <span class="text-2xl font-medium text-white group-hover:text-[#E9480E] transition-colors">
                  {{ $t('nav.portfolio') }}
                </span>
                <svg class="w-5 h-5 ml-auto text-white/40 group-hover:text-[#E9480E] transition-all transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <div @click="handleMobileNavClick('contact')"
                class="flex items-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300 group cursor-pointer">
                <span class="text-2xl font-medium text-white group-hover:text-[#E9480E] transition-colors">
                  {{ $t('nav.contactUs') }}
                </span>
                <svg class="w-5 h-5 ml-auto text-white/40 group-hover:text-[#E9480E] transition-all transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>

            <!-- Language Switcher -->
            <div class="mt-12 pt-8 border-t border-white/10">
              <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                   @click="toggleLanguage">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#E9480E]/20 flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-language " class="h-6 w-10 text-[#E9480E]"  />
                  </div>
                  <div>
                    <h3 class="text-white font-medium tracking-[.9px]">{{ $t('nav.language') }}</h3>
                    <p class="text-sm text-white/60 tracking-[.9px]">
                      {{ currentLanguage === 'en' ? 'English' : 'العربية' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-semibold text-[#E9480E]">
                    {{ currentLanguage === 'en' ? 'ع' : 'EN' }}
                  </span>
                  
                </div>
              </div>
              
              <!-- Language Options (if you want dropdown) -->
              <div v-if="showLanguageOptions" class="mt-2 space-y-2">
                <div v-for="lang in languages" :key="lang.code"
                     @click="changeLanguage(lang.code)"
                     class="flex items-center p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                     :class="{ 'bg-white/10': currentLanguage === lang.code }">
                  <span class="text-white flex-1">{{ lang.name }}</span>
                  <span class="text-[#E9480E] text-sm font-medium">{{ lang.code.toUpperCase() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-white/10">
            <div class="text-center">
              <p class="text-white/60 text-sm mb-4">{{ $t('nav.followUs') }}</p>
              <div class="flex justify-center gap-4">
                <a href="https://x.com/prostdios_sa" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E9480E] transition-colors">
                  <font-awesome-icon icon="fa-brands fa-x-twitter" class="text-white" />
                </a>
                <a href="https://www.youtube.com/@prostdios" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E9480E] transition-colors">
                  <font-awesome-icon icon="fa-brands fa-youtube" class="text-white" />
                </a>
                <a href="https://www.tiktok.com/@prostdios" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E9480E] transition-colors">
                  <font-awesome-icon icon="fa-brands fa-tiktok" class="text-white" />
                </a>

                <a href="https://vimeo.com/artvelmedia" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E9480E] transition-colors">
                  <font-awesome-icon icon="fa-brands fa-vimeo-v"  class="text-white" />
                </a>
              </div>
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

// State
const isMobileMenuOpen = ref(false);
const hasScrolled = ref(false);
const isNavbarVisible = ref(true);
const lastScrollY = ref(0);
const showLanguageOptions = ref(false);

// Languages list
const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' }
];

// Load language from localStorage
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

// Toggle language
function toggleLanguage() {
  const newLanguage = locale.value === 'en' ? 'ar' : 'en';
  changeLanguage(newLanguage);
  showLanguageOptions.value = false;
}

// Change language
function changeLanguage(lang) {
  locale.value = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('language', lang);
  
  // Close mobile menu after language change
  if (window.innerWidth < 768) {
    setTimeout(closeMobileMenu, 300);
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
  } else {
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }, 300);
  }
}

// Close mobile menu
function closeMobileMenu() {
  if (isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false;
    
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }, 300);
  }
}

// Handle mobile navigation clicks
function handleMobileNavClick(sectionId) {
  scrollToSection(sectionId);
  closeMobileMenu();
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  closeMobileMenu();
  
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, 300);
}

// Handle scroll
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

// Handle escape key
function handleKeydown(event) {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
}

// Event listeners
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeydown);
  
  // Cleanup
  document.body.style.overflow = '';
  document.body.style.height = '';
});

// Computed classes for nav
const navClasses = computed(() => {
  return [
    'fixed top-0 left-0 w-full z-50 transition-all duration-300',
    {
      ' backdrop-blur-md ': hasScrolled.value && !isMobileMenuOpen.value,
      'bg-transparent': !hasScrolled.value || isMobileMenuOpen.value,
      'translate-y-0': isNavbarVisible.value,
      '-translate-y-full': !isNavbarVisible.value,
    },
  ];
});
</script>

<style scoped>
/* Main navigation */
.main {
  display: flex;
  width: 100%;
  padding: 27.5px 64px 11.5px 64px;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 760px) {
  .main {
    padding: 20px 24px;
  }
}

/* Burger icon */
.burger-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.burger-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background: white;
  transition: all 0.3s ease;
  transform-origin: left center;
}

.burger-icon.open span:nth-child(1) {
  transform: rotate(45deg) translate(1px, -1px);
}

.burger-icon.open span:nth-child(2) {
  opacity: 0;
}

.burger-icon.open span:nth-child(3) {
  transform: rotate(-45deg) translate(1px, 1px);
}

/* Language selector */
.language {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #FFF;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.language:hover {
  background: rgba(255, 255, 255, 0.1);
}

.space {
  color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
  user-select: none;
}

/* Mobile menu animations */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active .absolute.inset-y-0.right-0,
.mobile-menu-leave-active .absolute.inset-y-0.right-0 {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from .absolute.inset-y-0.right-0 {
  transform: translateX(100%);
}

.mobile-menu-leave-to .absolute.inset-y-0.right-0 {
  transform: translateX(100%);
}

/* Menu link hover effects */
.group:hover .transition-all {
  transition: all 0.3s ease;
}

/* Scrollbar styling for mobile menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* RTL Support */
[dir="rtl"] .burger-icon.open span:nth-child(1) {
  transform-origin: right center;
  transform: rotate(-45deg) translate(-1px, -1px);
}

[dir="rtl"] .burger-icon.open span:nth-child(3) {
  transform-origin: right center;
  transform: rotate(45deg) translate(-1px, 1px);
}

[dir="rtl"] .mobile-menu-enter-from .absolute.inset-y-0.right-0 {
  transform: translateX(-100%);
}

[dir="rtl"] .mobile-menu-leave-to .absolute.inset-y-0.right-0 {
  transform: translateX(-100%);
}

[dir="rtl"] .absolute.inset-y-0.right-0 {
  right: auto;
  left: 0;
}

[dir="rtl"] .absolute.top-6.right-6 {
  right: auto;
  left: 1.5rem;
}

[dir="rtl"] .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-\[\#100E0E\] {
    background-color: #0a0a0a;
  }
}

/* Accessibility improvements */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #E9480E;
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-transform,
  .transition-colors,
  .mobile-menu-enter-active,
  .mobile-menu-leave-active,
  .burger-icon,
  .burger-icon span {
    transition: none !important;
  }
  
  .mobile-menu-enter-from .absolute.inset-y-0.right-0,
  .mobile-menu-leave-to .absolute.inset-y-0.right-0 {
    transform: none !important;
  }
}

/* Enhanced touch targets for mobile */
@media (max-width: 768px) {
  .flex.items-center.p-4 {
    min-height: 56px;
  }
  
  button,
  .cursor-pointer {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Loading state */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>