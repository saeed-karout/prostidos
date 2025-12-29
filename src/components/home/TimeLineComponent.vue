<template>
    <div class="main">
        <div class="header">
            <div class="title">
                {{ $t('timeLine.title') }}
            </div>
            <div class="subtitle">
                {{ $t('timeLine.subtitle') }}
            </div>
        </div>

        <div class="content">
            <!-- صورة SVG مع تأثير تغيير اللون -->
            <div class="timeline-svg-container desktop-svg" ref="timelineSvgRef">
                <img src="/images/brush2.svg" alt="timeline path" class="svg-image svg-base" />
                <img src="/images/brush2.svg" alt="timeline path" class="svg-image svg-colored" ref="coloredSvgRef" />
            </div>

            <!-- SVG للجوال -->
            <div class="timeline-svg-container mobile-svg" ref="mobileTimelineSvgRef">
                <img src="/images/brush-mobile.svg" alt="timeline path mobile" class="svg-image svg-base" />
            </div>

            <!-- الكاردات مع التقسيم المتجاوب -->
            <div class="sections-wrapper">
                <!-- Section 1: Discovery & Strategy + Concept Development -->
                <div class="section-content responsive-section" ref="section1Ref">
                    <div class="card-container">
                        <!-- Card 1 -->
                        <div 
                            class="card cinematic-card" 
                            @mouseenter="startTitleAnimation" 
                            @mouseleave="resetTitleAnimation"
                            :class="{ 'rtl-card': locale === 'ar' }"
                            :key="locale"
                        >
                            <div class="card-icon-wrapper">
                                <img src="/icons/TimeLine/search-status.svg" class="icon" :alt="$t('timeLine.section1.title1')">
                                <div class="icon-glow"></div>
                            </div>
                            <div class="title-card">
                                <span class="title-text">{{ $t('timeLine.section1.title1') }}</span>
                                <div class="title-highlight"></div>
                            </div>
                            <div class="subtitle-card">
                                {{ $t('timeLine.section1.desc1') }}
                            </div>
                            <div class="card-glow"></div>
                        </div>

                        <!-- Card 2 -->
                        <div 
                            class="card cinematic-card" 
                            @mouseenter="startTitleAnimation" 
                            @mouseleave="resetTitleAnimation"
                            :class="{ 'rtl-card': locale === 'ar' }"
                            :key="locale"
                        >
                            <div class="card-icon-wrapper">
                                <img src="/icons/TimeLine/command.svg" class="icon" :alt="$t('timeLine.section1.title2')">
                                <div class="icon-glow"></div>
                            </div>
                            <div class="title-card">
                                <span class="title-text">{{ $t('timeLine.section1.title2') }}</span>
                                <div class="title-highlight"></div>
                            </div>
                            <div class="subtitle-card">
                                {{ $t('timeLine.section1.desc2') }}
                            </div>
                            <div class="card-glow"></div>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Pre-Production -->
                <div class="section-content responsive-section" ref="section2Ref">
                    <div class="card single-card cinematic-card" 
                         @mouseenter="startTitleAnimation" 
                         @mouseleave="resetTitleAnimation"
                         :class="{ 'rtl-card': locale === 'ar' }"
                         :key="locale">
                        <div class="card-icon-wrapper">
                            <img src="/icons/TimeLine/magicpen.svg" class="icon" :alt="$t('timeLine.section2.title')">
                            <div class="icon-glow"></div>
                        </div>
                        <div class="title-card">
                            <span class="title-text">{{ $t('timeLine.section2.title') }}</span>
                            <div class="title-highlight"></div>
                        </div>
                        <div class="subtitle-card">
                            {{ $t('timeLine.section2.desc') }}
                        </div>
                        <div class="card-glow"></div>
                    </div>
                </div>

                <!-- Section 3: Production + Post-Production -->
                <div class="section-content responsive-section" ref="section3Ref">
                    <div class="card-container">
                        <!-- Card 1 -->
                        <div 
                            class="card cinematic-card" 
                            @mouseenter="startTitleAnimation" 
                            @mouseleave="resetTitleAnimation"
                            :class="{ 'rtl-card': locale === 'ar' }"
                            :key="locale"
                        >
                            <div class="card-icon-wrapper">
                                <img src="/icons/TimeLine/main-component.svg" class="icon" :alt="$t('timeLine.section3.title1')">
                                <div class="icon-glow"></div>
                            </div>
                            <div class="title-card">
                                <span class="title-text">{{ $t('timeLine.section3.title1') }}</span>
                                <div class="title-highlight"></div>
                            </div>
                            <div class="subtitle-card">
                                {{ $t('timeLine.section3.desc1') }}
                            </div>
                            <div class="card-glow"></div>
                        </div>

                        <!-- Card 2 -->
                        <div 
                            class="card cinematic-card" 
                            @mouseenter="startTitleAnimation" 
                            @mouseleave="resetTitleAnimation"
                            :class="{ 'rtl-card': locale === 'ar' }"
                            :key="locale"
                        >
                            <div class="card-icon-wrapper">
                                <img src="/icons/TimeLine/forward-item.svg" class="icon" :alt="$t('timeLine.section3.title2')">
                                <div class="icon-glow"></div>
                            </div>
                            <div class="title-card">
                                <span class="title-text">{{ $t('timeLine.section3.title2') }}</span>
                                <div class="title-highlight"></div>
                            </div>
                            <div class="subtitle-card">
                                {{ $t('timeLine.section3.desc2') }}
                            </div>
                            <div class="card-glow"></div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Review & Feedback -->
                <div class="section-content responsive-section" ref="section4Ref">
                    <div class="card single-card cinematic-card" 
                         @mouseenter="startTitleAnimation" 
                         @mouseleave="resetTitleAnimation"
                         :class="{ 'rtl-card': locale === 'ar' }"
                         :key="locale">
                        <div class="card-icon-wrapper">
                            <img src="/icons/TimeLine/recovery-convert.svg" class="icon" :alt="$t('timeLine.section4.title')">
                            <div class="icon-glow"></div>
                        </div>
                        <div class="title-card">
                            <span class="title-text">{{ $t('timeLine.section4.title') }}</span>
                            <div class="title-highlight"></div>
                        </div>
                        <div class="subtitle-card">
                            {{ $t('timeLine.section4.desc') }}
                        </div>
                        <div class="card-glow"></div>
                    </div>
                </div>

                <!-- Section 5: Final Delivery + Launch Support -->
                <div class="section-content responsive-section" ref="section5Ref">
                    <div class="card-container">
                        <!-- Card 1 -->
                        <div 
                            class="card cinematic-card" 
                            @mouseenter="startTitleAnimation" 
                            @mouseleave="resetTitleAnimation"
                            :class="{ 'rtl-card': locale === 'ar' }"
                            :key="locale"
                        >
                            <div class="card-icon-wrapper">
                                <img src="/icons/TimeLine/shapes.svg" class="icon" :alt="$t('timeLine.section5.title1')">
                                <div class="icon-glow"></div>
                            </div>
                            <div class="title-card">
                                <span class="title-text">{{ $t('timeLine.section5.title1') }}</span>
                                <div class="title-highlight"></div>
                            </div>
                            <div class="subtitle-card">
                                {{ $t('timeLine.section5.desc1') }}
                            </div>
                            <div class="card-glow"></div>
                        </div>

                        <!-- Card 2 -->
                        <div 
                            class="card cinematic-card" 
                            @mouseenter="startTitleAnimation" 
                            @mouseleave="resetTitleAnimation"
                            :class="{ 'rtl-card': locale === 'ar' }"
                            :key="locale"
                        >
                            <div class="card-icon-wrapper">
                                <img src="/icons/TimeLine/unlimited.svg" class="icon" :alt="$t('timeLine.section5.title2')">
                                <div class="icon-glow"></div>
                            </div>
                            <div class="title-card">
                                <span class="title-text">{{ $t('timeLine.section5.title2') }}</span>
                                <div class="title-highlight"></div>
                            </div>
                            <div class="subtitle-card">
                                {{ $t('timeLine.section5.desc2') }}
                            </div>
                            <div class="card-glow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-text">
                <div class="title">{{ $t('timeLine.footer.title') }}</div>
                <div class="subtitle">
                    {{ $t('timeLine.footer.description') }}
                </div>
            </div>
            <a href="https://vimeo.com/artvelmedia" target="_blank" class="btn-container cinematic-btn">
                {{ $t('timeLine.footer.button') }}
                <div class="btn-glow"></div>
            </a>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t, locale } = useI18n()

// Refs للعناصر
const timelineSvgRef = ref(null)
const mobileTimelineSvgRef = ref(null)
const coloredSvgRef = ref(null)
const section1Ref = ref(null)
const section2Ref = ref(null)
const section3Ref = ref(null)
const section4Ref = ref(null)
const section5Ref = ref(null)

// دالة لتفعيل أنيميشن العنوان عند الهوفر
const startTitleAnimation = (event) => {
    const card = event.currentTarget
    const titleHighlight = card.querySelector('.title-highlight')
    const titleText = card.querySelector('.title-text')
    const iconGlow = card.querySelector('.icon-glow')
    const cardGlow = card.querySelector('.card-glow')
    
    gsap.killTweensOf([titleHighlight, titleText, iconGlow, cardGlow])
    
    gsap.timeline()
        .to(titleHighlight, {
            width: '100%',
            duration: 0.6,
            ease: "power2.out"
        })
        .to(titleText, {
            color: '#E9480E',
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.4")
        .to(iconGlow, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)"
        }, "-=0.3")
        .to(cardGlow, {
            opacity: 0.1,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
    
    gsap.to(card, {
        y: -8,
        duration: 0.4,
        ease: "power2.out"
    })
}

// دالة لإعادة تعيين الأنيميشن عند مغادرة الهوفر
const resetTitleAnimation = (event) => {
    const card = event.currentTarget
    const titleHighlight = card.querySelector('.title-highlight')
    const titleText = card.querySelector('.title-text')
    const iconGlow = card.querySelector('.icon-glow')
    const cardGlow = card.querySelector('.card-glow')
    
    gsap.timeline()
        .to(titleHighlight, {
            width: '0%',
            duration: 0.4,
            ease: "power2.in"
        })
        .to(titleText, {
            color: '#FFF',
            duration: 0.3,
            ease: "power2.out"
        }, "-=0.3")
        .to(iconGlow, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3
        }, "-=0.2")
        .to(cardGlow, {
            opacity: 0,
            duration: 0.3
        }, "-=0.2")
    
    gsap.to(card, {
        y: 0,
        duration: 0.4,
        ease: "power2.out"
    })
}

onMounted(() => {
    if (coloredSvgRef.value) {
        gsap.fromTo(coloredSvgRef.value, 
            {
                opacity: 0,
                filter: 'brightness(0.5) saturate(0.5)'
            },
            {
                opacity: 1,
                filter: 'brightness(1) saturate(1)',
                ease: "none",
                scrollTrigger: {
                    trigger: timelineSvgRef.value,
                    start: "top 30%",
                    end: "bottom 70%",
                    scrub: true,
                    markers: false
                }
            }
        )
    }

    if (coloredSvgRef.value) {
        gsap.fromTo(coloredSvgRef.value, 
            {
                clipPath: 'inset(100% 0% 0% 0%)'
            },
            {
                clipPath: 'inset(0% 0% 0% 0%)',
                ease: "none",
                scrollTrigger: {
                    trigger: timelineSvgRef.value,
                    start: "top 20%",
                    end: "bottom bottom",
                    scrub: 1.5,
                    markers: false
                }
            }
        )
    }

    gsap.utils.toArray('.responsive-section').forEach((section) => {
        gsap.fromTo(section, 
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "top 50%",
                    toggleActions: "play none none reverse"
                }
            }
        )
    })
    
    const btn = document.querySelector('.cinematic-btn')
    if (btn) {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn.querySelector('.btn-glow'), {
                opacity: 0.3,
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out"
            })
        })
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn.querySelector('.btn-glow'), {
                opacity: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            })
        })
    }
})
</script>

<style scoped>
.main {
    display: flex;
    width: 100%;
    padding: 80px 64px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 64px;
    background: #100E0E;
    position: relative;
}

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    color: white;
    position: relative;
    z-index: 3;
}

.header .title {
    font-size: 40px;
    font-family: "Bebas Neue";
    background: linear-gradient(135deg, #E9480E 0%, #FF6B35 50%, #FF8E53 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.header .subtitle {
    font-size: 22px;
    max-width: 600px;
    font-family: Inter;
}

.content {
    display: flex;
    width: 100%;
    padding: 0 24px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 64px;
    position: relative;
}

.timeline-svg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    overflow: hidden;
}

.desktop-svg {
    display: block;
}

.mobile-svg {
    display: none;
}

.svg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.svg-base {
    opacity: 0.3;
    filter: brightness(0.8) saturate(0.7);
}

.svg-colored {
    opacity: 0;
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 15px rgba(233, 72, 14, 0.6));
    clip-path: inset(100% 0% 0% 0%);
}

.sections-wrapper {
    display: flex;
    flex-direction: column;
    gap: 120px;
    width: 100%;
    max-width: 1200px;
    position: relative;
    z-index: 2;
}

.section-content {
    display: flex;
    justify-content: center;
    width: 100%;
}

.card-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 40px;
}

.card {
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    background: rgba(16, 14, 14, 0.9);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex: 1;
    max-width: 500px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
}

.cinematic-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: start;
}

.cinematic-card.rtl-card {
    align-items: flex-end;
    text-align: end;
}

.cinematic-card.rtl-card .title-card,
.cinematic-card.rtl-card .subtitle-card {
    width: 100%;
    text-align: right;
}

.cinematic-card.rtl-card .title-highlight {
    left: auto;
    right: 0;
    transform-origin: right;
}

.cinematic-card:hover {
    border-color: rgba(233, 72, 14, 0.4);
    box-shadow: 0 10px 30px rgba(233, 72, 14, 0.2);
    transform: translateY(-5px);
}

.card-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(233, 72, 14, 0.1) 0%, transparent 70%);
    opacity: 0;
    z-index: 1;
    pointer-events: none;
}

.card-icon-wrapper {
    position: relative;
    display: inline-block;
    width: fit-content;
}

.icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
}

.cinematic-card:hover .icon {
    filter: brightness(1.2) drop-shadow(0 0 8px rgba(233, 72, 14, 0.6));
}

.icon-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, rgba(233, 72, 14, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
    z-index: 1;
    pointer-events: none;
}

.title-card {
    color: #FFF;
    font-family: "Bebas Neue";
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    position: relative;
    display: inline-block;
}

.title-text {
    position: relative;
    z-index: 2;
    color: #FFF;
    transition: color 0.4s ease;
}

.title-highlight {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #E9480E, #FF6B35, #FF8E53);
    border-radius: 2px;
    z-index: 1;
    transition: width 0.6s ease;
}

.cinematic-card:hover .title-text {
    background: linear-gradient(135deg, #E9480E 0%, #FF6B35 50%, #FF8E53 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle-card {
    color: #FDFDFD;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    position: relative;
    z-index: 2;
}

.single-card {
    max-width: 600px;
    width: 100%;
}

.footer {
    display: flex;
    width: 100%;
    max-width: 872px;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    position: relative;
    z-index: 2;
    text-align: center;
}

.footer-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.footer-text .title {
    color: #FFF;
    font-family: "Bebas Neue";
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
}

.footer-text .subtitle {
    color: #FFF;
    text-align: center;
    font-family: Inter;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
}

.footer .btn-container {
    display: flex;
    padding: 17px 40px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 144px;
    background: #343232;
    color: #FFF;
    font-family: "Bebas Neue";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    letter-spacing: 1px;
}

.cinematic-btn:hover {
    background: linear-gradient(135deg, #E9480E 0%, #FF6B35 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(233, 72, 14, 0.3);
}

.btn-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    opacity: 0;
    border-radius: 144px;
    pointer-events: none;
}

/* Responsive */
@media (max-width: 1024px) {
    .main { padding: 60px 32px; gap: 48px; }
    .header .title { font-size: 36px; }
    .header .subtitle { font-size: 20px; }
    .content { padding: 0 16px; gap: 48px; }
    .card-container { flex-direction: column; gap: 32px; }
    .card, .single-card { max-width: 100%; }
}

@media (max-width: 768px) {
    .main { padding: 40px 20px; gap: 40px; }
    .header .title { font-size: 32px; }
    .header .subtitle { font-size: 18px; }
    .content { padding: 0 12px; gap: 40px; }
    .sections-wrapper { gap: 80px; }
    .title-card { font-size: 24px; }
    .subtitle-card { font-size: 16px; }
    .footer-text .title { font-size: 24px; }
    .footer-text .subtitle { font-size: 16px; }
    .footer .btn-container { padding: 14px 32px; font-size: 20px; }
    .desktop-svg { display: none; }
    .mobile-svg { display: block; }
    .cinematic-card:active { border-color: rgba(233, 72, 14, 0.4); transform: translateY(-2px); }
}

@media (max-width: 480px) {
    .main { padding: 32px 16px; gap: 32px; }
    .header .title { font-size: 28px; }
    .header .subtitle { font-size: 16px; }
    .content { padding: 0 8px; gap: 32px; }
    .sections-wrapper { gap: 60px; }
    .card { padding: 20px; }
    .title-card { font-size: 22px; }
    .subtitle-card { font-size: 15px; }
    .footer-text .title { font-size: 22px; }
    .footer-text .subtitle { font-size: 15px; }
    .footer .btn-container { padding: 12px 30px; font-size: 20px; }
}

/* دعم اللغة العربية العام */
:global([dir="rtl"]) .header,
:global([dir="rtl"]) .footer-text {
    text-align: center;
}

:global([dir="rtl"]) .subtitle-card,
:global([dir="rtl"]) .footer-text .subtitle {
    font-family: 'Cairo', 'Inter', sans-serif;
    text-align: right;
}

:global([dir="rtl"]) .card-container {
    direction: rtl;
}

:global([dir="rtl"]) .title-card {
    font-family: 'Cairo', 'Bebas Neue', sans-serif;
}

:global([dir="rtl"]) .title-highlight {
    right: 0;
    left: auto;
}
</style>