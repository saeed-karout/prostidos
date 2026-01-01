<template>
    <nav :class="navClasses">
        <div class="main">
            <div class="flex items-center  justify-center w-full h-[72px] mx-auto">
                <!-- Left Side: Logo (مخفي في الشاشات العادية) -->
                <div class=" flex-row items-center hidden lg:flex" >
                    <router-link to="/" class="flex items-center">
                        <img class="w-[123.5px] h-[32px]" src="/logos/logo.svg" alt="Your Company Logo">
                    </router-link>
                </div>
                
                <!-- Right Side: Empty Space for Balance -->
                <div class="flex items-center justify-end">
                    <!-- This space is intentionally left blank for balance -->
                </div>

                <!-- Mobile Menu Button (Hidden on Desktop) -->
                <div class="lg:hidden flex justify-between items-center ml-auto  w-full">
                    
                    <div class="flex items-center ">
                        <img class="w-[123.5px] h-[32px]" src="/logos/logo.svg" alt="Your Company Logo">
                    </div>

                    
                    <button @click="toggleMobileMenu" type="button" class="text-white focus:outline-none" ref="menuButton">
                        <img src="/icons/menu.svg" class="w-8" alt="menu">
                    </button>

                  
                    
                </div>
            </div>
        </div>
    </nav>

    <!-- Vertical Navigation Menu (Desktop Only) - Independent Positioning -->
    <div class="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <div class="vertical-nav-menu" :class="{ 'expanded': isHomeMenuOpen }">
            <!-- Navigation Items -->
            <div class="nav-items rotate-[-90deg]">
                <!-- Home with dropdown functionality -->
                <div @click="toggleHomeMenu" 
                    class="nav-item group cursor-pointer main-nav-item"
                    :class="{ 'active': isActive('/') }">
                    <div class="nav-dot"></div>
                    <span class="nav-text">{{ $t('nav.home') }}</span>
                </div>
            </div>

            <!-- Language Switcher -->
            <div class="language-section" :class="{ 'mt-4': isHomeMenuOpen }">
                <div class="language-item" @click="toggleLanguage">
                    <div class="language-icon">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                        </svg>
                    </div>
                    <span class="language-text">
                        {{ currentLanguage === 'en' ? 'ar' : 'en' }}
                    </span>
                </div>
            </div>

            <!-- Email -->
            <div class="email-section" :class="{ 'mt-4': isHomeMenuOpen }">
                <a :href="emailHref" class="email-item">
                  
                        <font-awesome-icon icon="fa-regular fa-envelope" class="w-7 h-7 text-[#F0531C]" />
                  
                </a>
            </div>
        </div>
    </div>

    <!-- Desktop Full Screen Menu (يظهر عند النقر على Home) -->
    <transition name="desktop-full-menu">
        <div v-if="isHomeMenuOpen" class="desktop-full-menu">
            <!-- Backdrop -->
            <div class="desktop-menu-backdrop" @click="closeHomeMenu"></div>
            
            <!-- Menu Content -->
            <div class="desktop-menu-content">
                <!-- Header with Close Button -->
                <div class="desktop-menu-header">
                    <router-link to="/" @click="closeHomeMenu">
                        <img src="/logos/logo.svg" class="h-12 w-auto" alt="logo">
                    </router-link>
                    <button @click="closeHomeMenu" class="desktop-menu-close">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Navigation Links -->
                <div class="desktop-menu-items">
                    <router-link to="/" @click="closeHomeMenu" 
                        class="desktop-menu-item"
                        :class="{ 'active': isActive('/') }">
                        <div class="desktop-menu-number">01</div>
                        <div class="desktop-menu-text">
                            <h3>{{ $t('nav.home') }}</h3>
                            <p>Back to homepage</p>
                        </div>
                        <div class="desktop-menu-arrow">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </div>
                    </router-link>

                    <div @click="scrollToSectionAndClose('services')" class="desktop-menu-item cursor-pointer">
                        <div class="desktop-menu-number">02</div>
                        <div class="desktop-menu-text">
                            <h3>{{ $t('nav.services') }}</h3>
                            <p>Our services & solutions</p>
                        </div>
                        <div class="desktop-menu-arrow">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </div>
                    </div>

                    <a href="https://vimeo.com/artvelmedia" target="_blank" class="desktop-menu-item">
                        <div class="desktop-menu-number">03</div>
                        <div class="desktop-menu-text">
                            <h3>{{ $t('nav.portfolio') }}</h3>
                            <p>View our portfolio</p>
                        </div>
                        <div class="desktop-menu-arrow">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </div>
                    </a>

                    <div @click="scrollToSectionAndClose('contact')" class="desktop-menu-item cursor-pointer">
                        <div class="desktop-menu-number">04</div>
                        <div class="desktop-menu-text">
                            <h3>{{ $t('nav.contactUs') }}</h3>
                            <p>Get in touch with us</p>
                        </div>
                        <div class="desktop-menu-arrow">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="desktop-menu-footer">
                    <div class="contact-section">
                        <a :href="emailHref" class="contact-email">{{ cleanEmail }}</a>
                        <!-- <div class="contact-phone">{{ $t('footer.contacts.phone') }}</div> -->
                    </div>
                    <div class="social-section">
                        <a href="https://x.com/prostdios_sa" target="_blank" class="social-icon">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/@prostdios" target="_blank" class="social-icon">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@prostdios" target="_blank" class="social-icon">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </a>
                        <a href="https://vimeo.com/artvelmedia" target="_blank" class="social-icon">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.875 10.063c-2.442 5.217-8.337 12.319-12.063 12.319-3.672 0-4.203-7.831-6.208-13.043-.987-2.565-1.624-1.976-3.474-.681l-1.128-1.455c2.698-2.372 5.398-5.127 7.057-5.28 1.868-.179 3.018 1.098 3.448 3.832.568 3.593 1.362 9.17 2.748 9.17 1.08 0 3.741-4.424 3.878-6.006.243-2.316-1.703-2.386-3.392-1.663 2.673-8.754 13.793-7.142 9.134 2.807z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </transition>

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
                        <button @click="closeMobileMenu" class="absolute top-6 right-6 p-1 rounded-full flex justify-center items-center transition-colors">
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
                                        <font-awesome-icon icon="fa-solid fa-language" class="h-6 w-10 text-[#E9480E]" />
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
                        </div>

                        <!-- Email -->
                        <div class="mt-6">
                            <a :href="emailHref" class="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-[#E9480E]/20 flex items-center justify-center">
                                        <font-awesome-icon icon="fa-solid fa-envelope" class="h-6 w-10 text-[#E9480E]" />
                                    </div>
                                    <div>
                                        <h3 class="text-white font-medium tracking-[.9px]">Email</h3>
                                        <p class="text-sm text-white/60 tracking-[.9px] truncate max-w-[200px]">
                                            {{ cleanEmail }}
                                        </p>
                                    </div>
                                </div>
                                <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="p-6 border-t border-white/10">
                        <div class="text-center">
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
                                    <font-awesome-icon icon="fa-brands fa-vimeo-v" class="text-white" />
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
import { useRoute } from 'vue-router';

// i18n setup
const { locale, t } = useI18n();
const route = useRoute();
const currentLanguage = computed(() => locale.value);

// State
const isMobileMenuOpen = ref(false);
const isHomeMenuOpen = ref(false);
const hasScrolled = ref(false);
const isNavbarVisible = ref(true);
const lastScrollY = ref(0);

// Email
const cleanEmail = computed(() => {
    const email = t('footer.contacts.email');
    return email.replace('[at]', '@');
});

const emailHref = computed(() => {
    const email = t('footer.contacts.email');
    return `mailto:${email.replace('[at]', '@')}`;
});

// Check active route
const isActive = (path) => {
    return route.path === path;
};

// Toggle home menu
function toggleHomeMenu() {
    isHomeMenuOpen.value = !isHomeMenuOpen.value;
    if (isHomeMenuOpen.value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeHomeMenu() {
    isHomeMenuOpen.value = false;
    document.body.style.overflow = '';
}

function scrollToSectionAndClose(sectionId) {
    closeHomeMenu();
    setTimeout(() => {
        scrollToSection(sectionId);
    }, 300);
}

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
}

// Change language
function changeLanguage(lang) {
    locale.value = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    
    // Close menus after language change
    if (window.innerWidth < 768) {
        setTimeout(closeMobileMenu, 300);
    } else {
        closeHomeMenu();
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
    closeHomeMenu();
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
    if (!isMobileMenuOpen.value && !isHomeMenuOpen.value) {
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
    if (event.key === 'Escape') {
        closeHomeMenu();
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
        'fixed top-0 left-0 w-full z-[99999999999999999] transition-all duration-300',
        {
            ' backdrop-blur-md ': hasScrolled.value && !isMobileMenuOpen.value && !isHomeMenuOpen.value,
            'bg-transparent': !hasScrolled.value || isMobileMenuOpen.value || isHomeMenuOpen.value,
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
    overflow: hidden;
 
}

@media (max-width: 760px) {
    .main {
        padding: 20px 24px;
    }
}

/* Vertical Navigation Menu - Desktop Only */
.vertical-nav-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 40px 0px;
    background: rgba(16, 14, 14, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px 0 0 20px;
    border: 1px solid rgba(233, 72, 14, 0.2);
    border-right: none;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.vertical-nav-menu.expanded {
    background: rgba(233, 72, 14, 0.1);
}

.nav-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.main-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
}

.main-nav-item:hover {
    transform: translateX(-3px);
}

.main-nav-item.active {
    color: #E9480E;
}

.main-nav-item.active .nav-dot {
    background: #E9480E;
    box-shadow: 0 0 10px rgba(233, 72, 14, 0.5);
}

.nav-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
}

.main-nav-item:hover .nav-dot {
    background: #E9480E;
    transform: scale(1.2);
}

.nav-text {
    color: white;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.5px;
    white-space: nowrap;
    transition: color 0.3s ease;
}

.main-nav-item:hover .nav-text {
    color: #E9480E;
}

/* Language Section */
.language-section {
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.language-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.language-item:hover {
    background: rgba(233, 72, 14, 0.1);
    transform: translateY(-2px);
}

.language-icon {
    color: #E9480E;
}

.language-text {
    color: white;
    font-size: 20px;
    font-weight: 500;
}

/* Email Section */
.email-section {
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
}

.email-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    transition: all 0.3s ease;
    text-decoration: none;
}

.email-item:hover {
    background: rgba(233, 72, 14, 0.1);
    transform: translateY(-2px);
}

.email-icon {
    color: #E9480E;
}

/* Desktop Full Screen Menu */
.desktop-full-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9998;
    display: flex;
    justify-content: center;
    align-items: center;
}

.desktop-menu-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
}

.desktop-menu-content {
    position: relative;
    width: 90%;
    max-width: 800px;
    background: rgba(16, 14, 14, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 30px;
    border: 1px solid rgba(233, 72, 14, 0.3);
    padding: 40px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    z-index: 1;
    height: auto;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.desktop-menu-content::-webkit-scrollbar {
    display: none;
}

.desktop-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.desktop-menu-close {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
}

.desktop-menu-close:hover {
    background: rgba(233, 72, 14, 0.3);
    transform: rotate(90deg);
}

.desktop-menu-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.desktop-menu-item {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 18px 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    transition: all 0.3s ease;
    text-decoration: none;
    border: 1px solid transparent;
}

.desktop-menu-item:hover {
    background: rgba(233, 72, 14, 0.1);
    border-color: rgba(233, 72, 14, 0.3);
    transform: translateX(10px);
}

.desktop-menu-item.active {
    background: rgba(233, 72, 14, 0.15);
    border-color: rgba(233, 72, 14, 0.5);
}

.desktop-menu-number {
    color: #E9480E;
    font-size: 28px;
    font-weight: bold;
    min-width: 60px;
}

.desktop-menu-text {
    flex: 1;
}

.desktop-menu-text h3 {
    color: white;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
}

.desktop-menu-text p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
}

.desktop-menu-arrow {
    color: #E9480E;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
}

.desktop-menu-item:hover .desktop-menu-arrow {
    opacity: 1;
    transform: translateX(0);
}

.desktop-menu-footer {
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.contact-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.contact-email {
    color: white;
    font-size: 18px;
    text-decoration: none;
    transition: color 0.3s ease;
}

.contact-email:hover {
    color: #E9480E;
}

.contact-phone {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
}

.social-section {
    display: flex;
    gap: 20px;
}

.social-icon {
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.social-icon:hover {
    background: #E9480E;
    transform: translateY(-5px);
}

/* Desktop Full Menu Animations */
.desktop-full-menu-enter-active,
.desktop-full-menu-leave-active {
    transition: opacity 0.5s ease;
}

.desktop-full-menu-enter-from,
.desktop-full-menu-leave-to {
    opacity: 0;
}

.desktop-full-menu-enter-active .desktop-menu-content,
.desktop-full-menu-leave-active .desktop-menu-content {
    transition: all 0.5s ease;
}

.desktop-full-menu-enter-from .desktop-menu-content {
    transform: scale(0.9) translateY(50px);
    opacity: 0;
}

.desktop-full-menu-leave-to .desktop-menu-content {
    transform: scale(0.9) translateY(50px);
    opacity: 0;
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

/* RTL Support */


[dir="rtl"] .main-nav-item:hover {
    transform: translateX(3px);
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



[dir="rtl"] .desktop-menu-item:hover {
    transform: translateX(-10px);
}

[dir="rtl"] .desktop-menu-arrow {
    transform: translateX(10px);
}

[dir="rtl"] .desktop-menu-item:hover .desktop-menu-arrow {
    transform: translateX(0);
}

/* Responsive adjustments */
@media (min-width: 1024px) {
    .vertical-nav-menu {
        min-width: 70px;
    }
}

/* Hide vertical menu on tablet */
@media (min-width: 768px) and (max-width: 1023px) {
    .vertical-nav-menu {
        display: none;
    }
}

@media (max-width: 767px) {
    .desktop-menu-content {
        width: 95%;
        padding: 30px;
        border-radius: 20px;
    }
    
    .desktop-menu-header {
        margin-bottom: 40px;
    }
    
    .desktop-menu-item {
        padding: 20px;
        gap: 20px;
    }
    
    .desktop-menu-number {
        font-size: 22px;
        min-width: 50px;
    }
    
    .desktop-menu-text h3 {
        font-size: 22px;
    }
    
    .desktop-menu-footer {
        flex-direction: column;
        gap: 30px;
        align-items: flex-start;
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
    .desktop-full-menu-enter-active,
    .desktop-full-menu-leave-active {
        transition: none !important;
    }
    
    .mobile-menu-enter-from .absolute.inset-y-0.right-0,
    .mobile-menu-leave-to .absolute.inset-y-0.right-0,
    .desktop-full-menu-enter-from .desktop-menu-content,
    .desktop-full-menu-leave-to .desktop-menu-content {
        transform: none !important;
        opacity: 1 !important;
    }
    
    .main-nav-item:hover,
    .language-item:hover,
    .email-item:hover,
    .desktop-menu-item:hover,
    .desktop-menu-close:hover,
    .social-icon:hover {
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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .bg-\[\#100E0E\] {
        background-color: #0a0a0a;
    }
    
    .vertical-nav-menu,
    .desktop-menu-content {
        background: rgba(10, 10, 10, 0.95);
    }
}
</style>