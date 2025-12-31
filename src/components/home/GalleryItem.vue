<template>
  <div
    class="gallery-item cinematic-transition gsap-enhanced"
    :class="{
      'cinematic-desktop': isDesktopExperience,
      'cinematic-tablet': isTabletExperience,
      'cinematic-mobile': isMobileExperience,
      'cinematic-optimized': true,
      'cinematic-depth': true,
      'cinematic-focus': isFullscreen,
      'is-first-item': isFirstItem,
      'is-fullscreen': isFullscreen,
      'is-visible': isVisible,
      'is-transitioning': isTransitioning,
      'behind-content': shouldBeBehindContent
    }"
    ref="galleryItem"
    :key="`${workKey}-${locale}`"
    :data-index="index"
    :style="{ 'z-index': getZIndex() }"
  >
    <div class="cinematic-lighting" :class="{ 'active': isFullscreen || isExpanding }"></div>
    <div class="cinematic-overlay" :class="{ 'active': isFullscreen || isExpanding }"></div>
    <transition name="scene">
      <div v-if="showSceneTransition" class="scene-transition"></div>
    </transition>

    <div
      class="tv-container cinematic-video"
      ref="tvContainer"
      :class="{
        'fullscreen': isFullscreen,
        'expanding': isExpanding,
        'keep-fullscreen': keepFirstVideoFullscreen,
        'behind': shouldBeBehind,
        'appearing': isAppearing,
        'first-item': isFirstItem,
        'other-item': !isFirstItem
      }"
      :data-first-video="isFirstItem"
      :data-fullscreen="isFullscreen"
      :data-item-index="index"
    >
      <div class="tv-frame" ref="tvFrame">
        <div class="tv-screen" ref="tvScreen">
          <video
            class="tv-video cinematic-video"
            ref="videoEl"
            :poster="videoPoster"
            preload="metadata"
            muted
            playsinline
            webkit-playsinline
            @loadeddata="onVideoLoaded"
            @canplay="onVideoLoaded"
            @error="onVideoError"
            @playing="onVideoPlaying"
            @ended="onVideoEnded"
            @pause="onVideoPause"
          >
            <source :src="videoSrc" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div class="tv-screen-overlay"></div>
          <div class="tv-reflection"></div>
          <div class="tv-scanlines"></div>
        </div>

        <div class="tv-bezel" v-if="!isFullscreen">
          <div class="tv-brand">{{ title }}</div>
          <div class="tv-controls">
            <div class="tv-control tv-power" @click="togglePlay"></div>
            <div class="tv-control tv-volume" @click="toggleSound"></div>
            <div class="tv-control tv-channel" @click="restartVideo"></div>
          </div>
        </div>

        <div class="tv-stand" v-if="!isFullscreen"></div>
      </div>
    </div>

    <div
      class="content cinematic-typography"
      ref="contentEl"
      :class="{ 'visible': isFullscreen && isContentVisible && !shouldBeBehindContent }"
      style="pointer-events: auto;"
    >
      <div class="top">
        <div class="title-wrapper">
          <div class="title">
            <span class="title-text">{{ title }}</span>
            <span class="hidden md:flex title-shadow">{{ title }}</span>
            <span class="title-glow">{{ title }}</span>
          </div>
          <div class="title-underline"></div>
        </div>
        <div class="subtitle-wrapper">
          <div class="subtitle">
            <span class="subtitle-text">{{ subtitle }}</span>
            <span class="subtitle-decoration">✧</span>
          </div>
          <div class="subtitle-line"></div>
        </div>
        <div v-if="showDescription && description" class="description-wrapper">
          <div class="description">
            <span class="description-text">{{ description }}</span>
          </div>
          <div class="description-line"></div>
        </div>
      </div>
      <a :href="buttonLink" target="_blank" class="btn-wrapper" @mouseenter="handleButtonHover" @mouseleave="handleButtonLeave">
        <div class="btn">
          <span class="btn-text">{{ finalButtonText }}</span>
          <div class="btn-glow"></div>
          <div class="btn-border"></div>
          <div class="btn-shine"></div>
        </div>
      </a>
    </div>

    <div class="transition-overlay" :class="{ 'active': isTransitioning }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const { t, locale } = useI18n();

const props = defineProps({
  videoSrc: { type: String, required: true },
  videoPoster: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  workKey: { type: String, default: '' },
  buttonText: { type: String, default: 'btn-watch' },
  buttonLink: { type: String, default: '#' },
  showDescription: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
  isFirstItem: { type: Boolean, default: false }
});

const galleryItem = ref(null);
const tvContainer = ref(null);
const tvFrame = ref(null);
const tvScreen = ref(null);
const videoEl = ref(null);
const contentEl = ref(null);

const isVideoLoaded = ref(false);
const isVisible = ref(false);
const isExpanding = ref(false);
const isFullscreen = ref(false);
const isContentVisible = ref(false);
const isTransitioning = ref(false);
const isPlaying = ref(true);
const isMuted = ref(true);
const scrollProgress = ref(0);
const isButtonHovered = ref(false);
const videoLoadAttempted = ref(false);
const isVideoPlaying = ref(false);
const userInteracted = ref(false);
const keepFirstVideoFullscreen = ref(false);
const shouldBeBehindContent = ref(false);
const shouldBeBehind = ref(false);
const isAppearing = ref(false);

const isDesktopExperience = ref(true);
const isTabletExperience = ref(false);
const isMobileExperience = ref(false);
const showSceneTransition = ref(false);
const showContentAnimation = ref(false);
const isNearEnd = ref(false);

const finalButtonText = computed(() => props.buttonText === 'btn-watch' ? t('btn-watch', 'Watch Full Session') : props.buttonText);
const description = computed(() => props.workKey ? t(`featuredWorks.${props.workKey}.description`, '') : '');

const getZIndex = () => {
  if (shouldBeBehindContent.value) return 10;
  if (isFullscreen.value) return 9999;
  if (isVisible.value) return 1000 + props.index;
  return 100 + props.index;
};

const checkDeviceType = () => {
  const width = window.innerWidth;
  isDesktopExperience.value = width >= 1025;
  isTabletExperience.value = width >= 768 && width <= 1024;
  isMobileExperience.value = width < 768;
};

const playSceneTransition = () => {
  showSceneTransition.value = true;
  setTimeout(() => showSceneTransition.value = false, 800);
};

const onVideoLoaded = () => {
  isVideoLoaded.value = true;
  if (videoEl.value) {
    videoEl.value.style.opacity = '1';
    if ((isVisible.value || isFullscreen.value) && !isVideoPlaying.value) {
      safePlayVideo();
    }
  }
};

const onVideoError = () => {
  if (videoEl.value && props.isFirstItem) {
    setTimeout(() => videoEl.value.load(), 2000);
  }
};

const onVideoPlaying = () => isVideoPlaying.value = true;
const onVideoEnded = () => props.isFirstItem && restartVideo();
const onVideoPause = () => isVideoPlaying.value = false;

const safePlayVideo = () => {
  if (!videoEl.value || videoLoadAttempted.value) return;
  videoLoadAttempted.value = true;
  videoEl.value.currentTime = 0;
  videoEl.value.play().catch(() => setupUserInteractionPlay());
};

const setupUserInteractionPlay = () => {
  const handler = () => videoEl.value?.play().catch(() => {});
  document.addEventListener('click', handler, { once: true });
  document.addEventListener('touchstart', handler, { once: true });
};

const togglePlay = () => videoEl.value?.paused ? videoEl.value.play() : videoEl.value.pause();
const toggleSound = () => { if (videoEl.value) videoEl.value.muted = !videoEl.value.muted; };
const restartVideo = () => { if (videoEl.value) { videoEl.value.currentTime = 0; videoEl.value.play(); } };

const applyFullscreenStyles = () => {
  if (!tvContainer.value) return;

  // الحل الأمثل للموبايل: inset: 0 بدل width/height
  Object.assign(tvContainer.value.style, {
    position: 'fixed',
    inset: '0',                // أهم سطر: يعني top:0; left:0; right:0; bottom:0;
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
    maxHeight: 'none',
    margin: '0',
    padding: '0',
    transform: 'none',
    opacity: '1',
    zIndex: '9999',
    background: '#000',
    pointerEvents: 'auto',
    overflow: 'hidden'
  });

  if (tvFrame.value) {
    Object.assign(tvFrame.value.style, {
      borderRadius: '0',
      padding: '0',
      background: 'transparent',
      boxShadow: 'none',
      width: '100%',
      height: '100%'
    });
  }

  if (tvScreen.value) {
    Object.assign(tvScreen.value.style, {
      borderRadius: '0',
      width: '100%',
      height: '100%',
      background: 'transparent'
    });
  }

  if (videoEl.value) {
    Object.assign(videoEl.value.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      opacity: '1',
      visibility: 'visible'
    });
  }

  // إخفاء العناصر غير المرغوبة
  const bezel = tvFrame.value?.querySelector('.tv-bezel');
  if (bezel) bezel.style.display = 'none';

  const stand = tvFrame.value?.querySelector('.tv-stand');
  if (stand) stand.style.display = 'none';

  tvScreen.value?.querySelectorAll('.tv-screen-overlay, .tv-reflection, .tv-scanlines').forEach(el => {
    if (el) el.style.display = 'none';
  });
};

const startVideoAppearance = () => {
  if (isAppearing.value) return;
  isAppearing.value = true;
  isVisible.value = true;

  if (tvContainer.value) {
    Object.assign(tvContainer.value.style, {
      opacity: '0',
      left: '50%',
      transform: 'translateX(-50%) translateY(100%) scale(0.3)',
      pointerEvents: 'none'
    });

    setTimeout(() => {
      Object.assign(tvContainer.value.style, {
        opacity: '0.9',
        transform: 'translateX(-50%) translateY(-50%) scale(0.7)'
      });
      tvScreen.value?.classList.add('appearing');

      setTimeout(() => {
        if (videoEl.value) {
          videoEl.value.style.opacity = '1';
          safePlayVideo();
        }
        Object.assign(tvContainer.value.style, {
          opacity: '1',
          transform: 'translateX(-50%) translateY(-50%) scale(1)'
        });
      }, 600);
    }, 100);
  }
};

const updateItemPosition = () => {
  if (!galleryItem.value) return;
  const rect = galleryItem.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

  scrollProgress.value = progress;

  // منطق مشترك لكل العناصر
  const inView = progress > 0.1;
  const centered = Math.abs(rect.top + rect.height / 2 - windowHeight / 2) < windowHeight * 0.3;

  if (inView && !isVisible.value) {
    isVisible.value = true;
    if (!props.isFirstItem) {
      tvContainer.value.style.opacity = '1';
      tvContainer.value.style.transform = 'translateX(-50%) translateY(-50%) scale(0.9)';
    } else {
      startVideoAppearance();
    }
  }

  if (centered && !isExpanding.value && !isFullscreen.value) {
    isExpanding.value = true;
    tvContainer.value.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';
  }

  if (centered && isExpanding.value && !isFullscreen.value) {
    isFullscreen.value = true;
    isContentVisible.value = true;
    applyFullscreenStyles();
    playSceneTransition();
    if (videoEl.value && videoEl.value.paused) videoEl.value.play().catch(() => {});
  }

  if (rect.top < -windowHeight * 0.8) {
    shouldBeBehindContent.value = true;
    isContentVisible.value = false;
  } else {
    shouldBeBehindContent.value = false;
  }
};

let rafId = null;
const handleScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(updateItemPosition);
};

const handleResize = () => {
  checkDeviceType();
  updateItemPosition();
};

onMounted(() => {
  checkDeviceType();
  if (videoEl.value) videoEl.value.muted = true;

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize);
  window.addEventListener('touchmove', handleScroll, { passive: true });

  nextTick(() => {
    if (props.isFirstItem && tvContainer.value) {
      Object.assign(tvContainer.value.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        opacity: '0',
        transform: 'translateX(-50%) translateY(100%) scale(0.3)',
        transition: 'none',
        pointerEvents: 'none'
      });
      setTimeout(() => tvContainer.value.style.transition = 'all 1.8s cubic-bezier(0.215, 0.61, 0.355, 1)', 100);
    }

    setTimeout(updateItemPosition, 500);
  });
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (videoEl.value) videoEl.value.pause();
});

watch(locale, () => updateItemPosition());

</script>

<style scoped>

  /* ============================================= */
/*          تنسيقات للفيديوهات الأخرى           */
/* ============================================= */

/* حاوية التلفاز للفيديوهات الأخرى */
.tv-container.other-item {
  width: 80% !important;
  max-width: 1200px !important;
  aspect-ratio: 16/9 !important;
  transform: translate(-50%, -50%) !important;
  top: 50% !important;
  opacity: 0 !important;
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) !important;
}

/* ظهور الفيديوهات الأخرى عند التمرير */
.tv-container.other-item.is-visible {
  opacity: 0.9 !important;
  transform: translate(-50%, -50%) scale(0.9) !important;
}

.tv-container.other-item.expanding {
  opacity: 1 !important;
  transform: translate(-50%, -50%) scale(1) !important;
  z-index: 2000 !important;
}

.tv-container.other-item.fullscreen {
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  aspect-ratio: unset !important;
  transform: none !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 9998 !important;
}

/* إطار التلفاز للفيديوهات الأخرى */
.tv-container.other-item .tv-frame {
  background: linear-gradient(145deg, 
    rgba(20, 20, 20, 0.9) 0%,
    rgba(35, 35, 35, 0.85) 50%,
    rgba(20, 20, 20, 0.9) 100%
  ) !important;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(233, 72, 14, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
}

/* التأكد من ظهور جميع الفيديوهات بشكل صحيح */
.tv-video {
  opacity: 0;
  animation: fadeInVideo 0.8s ease forwards;
}

@keyframes fadeInVideo {
  to {
    opacity: 1;
  }
}

/* إخفاء التأثيرات للفيديوهات الأخرى في الوضع العادي */
.tv-container.other-item:not(.fullscreen) .tv-screen-overlay,
.tv-container.other-item:not(.fullscreen) .tv-reflection,
.tv-container.other-item:not(.fullscreen) .tv-scanlines {
  opacity: 0.3 !important;
}

/* إخفاء الـ Bezel للفيديوهات الأخرى في الوضع العادي */
.tv-container.other-item:not(.fullscreen) .tv-bezel,
.tv-container.other-item:not(.fullscreen) .tv-stand {
  opacity: 0.5 !important;
}

/* تأثيرات خاصة للفيديو الأول فقط */
.tv-container.first-item .tv-frame {
  animation: firstItemGlow 3s ease-in-out infinite alternate;
}

@keyframes firstItemGlow {
  0% {
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.9),
      0 0 0 2px rgba(233, 72, 14, 0.4),
      inset 0 0 40px rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  }
  100% {
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.9),
      0 0 0 2px rgba(233, 72, 14, 0.6),
      inset 0 0 40px rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
}

/* ============================================= */
/*       تحسينات العرض على الشاشات المختلفة     */
/* ============================================= */

/* شاشات كبيرة */
@media (min-width: 1200px) {
  .tv-container.other-item {
    width: 70% !important;
  }
}

/* تابلت */
@media (min-width: 768px) and (max-width: 1024px) {
  .tv-container.other-item {
    width: 85% !important;
  }

  .tv-container.fullscreen,
.tv-container.keep-fullscreen {
  position: fixed !important;
  inset: 0 !important;           /* الأهم: يغطي كامل الشاشة بما فيها الـ safe area */
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: none !important;
  z-index: 9999 !important;
  background: #000 !important;
  overflow: hidden !important;
}
.tv-container.fullscreen .tv-video {
  position: absolute !important;
  inset: 0 !important;
  object-fit: cover !important;
  object-position: center !important;
}
  
  .tv-container.other-item.is-visible {
    transform: translate(-50%, -50%) scale(0.85) !important;
  }
  
  .tv-container.other-item.expanding {
    transform: translate(-50%, -50%) scale(0.95) !important;
  }
}

/* موبايل */
@media (max-width: 767px) {
  .tv-container {
    width: 90% !important;
    min-width: 280px !important;
  }
  .tv-container.other-item {
    width: 95% !important;
  }
  
  .tv-container.other-item.is-visible {
    transform: translate(-50%, -50%) scale(0.8) !important;
  }
  
  
  
  .tv-container.other-item.fullscreen {
    border-radius: 0 !important;
  }
}

/* ============================================= */
/*       تحسينات الانتقال بين الفيديوهات        */
/* ============================================= */

.gallery-item {
  transition: z-index 0.3s ease !important;
}

.gallery-item.is-visible {
  z-index: 1500 !important;
}

.gallery-item.expanding {
  z-index: 2000 !important;
}

.gallery-item.fullscreen {
  z-index: 9999 !important;
}

/* تأثير الانتقال عند الخروج من Fullscreen */
.tv-container.other-item:not(.fullscreen) {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* تأثيرات الظهور المتتالية للفيديوهات */
.gallery-item:nth-child(2) .tv-container.other-item {
  transition-delay: 0.1s !important;
}

.gallery-item:nth-child(3) .tv-container.other-item {
  transition-delay: 0.2s !important;
}

.gallery-item:nth-child(4) .tv-container.other-item {
  transition-delay: 0.3s !important;
}

.gallery-item:nth-child(5) .tv-container.other-item {
  transition-delay: 0.4s !important;
}

.gallery-item:nth-child(6) .tv-container.other-item {
  transition-delay: 0.5s !important;
}
  /* ============================================= */
  /*              Base Styles                      */
  /* ============================================= */
  .future-works-section {
    contain: layout style paint;
  }
  
  .gallery-item {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    isolation: isolate;
  }
  
  .gallery-item.is-first-item {
    height: 100vh;
    min-height: 100vh;
  }
  
  .gallery-item.behind-content {
    z-index: 10 !important;
    pointer-events: none;
  }
  
  /* ============================================= */
  /*              Cinematic Styles                 */
  /* ============================================= */
  .cinematic-transition {
    transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) !important;
  }
  
  .gsap-enhanced .tv-container {
    will-change: transform, opacity, filter !important;
    transform-style: preserve-3d !important;
    backface-visibility: hidden !important;
  }
  
  .cinematic-video {
    backface-visibility: hidden !important;
    transform: translateZ(0) !important;
    image-rendering: pixelated !important;
  }
  
  .cinematic-enter {
    animation: cinematicEnter 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  
  @keyframes cinematicEnter {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.95);
      filter: blur(10px);
    }
    60% {
      opacity: 0.8;
      transform: translateY(0) scale(1);
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
  
  .cinematic-optimized * {
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    image-rendering: -webkit-optimize-contrast !important;
    image-rendering: crisp-edges !important;
  }
  
  .cinematic-depth {
    perspective: 1000px !important;
  }
  
  .cinematic-focus {
    animation: focusBreath 6s ease-in-out infinite;
  }
  
  @keyframes focusBreath {
    0%, 100% { filter: brightness(1) contrast(1); }
    50% { filter: brightness(1.05) contrast(1.1); }
  }
  
  .cinematic-lighting {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(233, 72, 14, 0.05) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .cinematic-lighting.active {
    opacity: 1;
  }
  
  .cinematic-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 30%,
      rgba(0, 0, 0, 0.4) 70%,
      rgba(0, 0, 0, 0.6) 100%
    );
    pointer-events: none;
    z-index: 99998;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .cinematic-overlay.active {
    opacity: 1;
  }
  
  .scene-transition {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    z-index: 999999;
    opacity: 0;
    pointer-events: none;
    animation: sceneTransition 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  
  @keyframes sceneTransition {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .cinematic-typography {
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.6),
      0 8px 24px rgba(0, 0, 0, 0.4) !important;
    font-smooth: always !important;
    -webkit-font-smoothing: antialiased !important;
  }
  
  /* تأثير Bloom سينمائي للتلفاز */
  .cinematic-desktop .tv-video.playing::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      rgba(233, 72, 14, 0.15) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 5;
    animation: bloomPulse 4s ease-in-out infinite;
  }
  
  @keyframes bloomPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  /* ============================================= */
  /*              TV Container                     */
  /* ============================================= */
  .tv-container {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(-50%) !important;
  width: 40%;
  max-width: 800px;
  min-width: 300px;
  aspect-ratio: 16/9;
  z-index: 1000;
  opacity: 0;
  pointer-events: auto;
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}
  
.tv-container.is-visible {
  opacity: 1 !important;
}

.tv-container.expanding {
  transform: translateX(-50%) translateY(-50%) scale(1) !important;
  z-index: 2000 !important;
}
  
  .tv-container.behind {
    opacity: 0.15 !important;
    z-index: 10 !important;
    pointer-events: none !important;
    filter: blur(2px) !important;
  }
  
  /* تأثيرات الظهور للفيديو الأول */
  .tv-container.appearing {
    animation: tvAppear 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }
  
  @keyframes tvAppear {
    0% {
      opacity: 0;
      transform: translate(-50%, 50%) scale(0.3) rotateX(10deg);
      filter: blur(10px);
    }
    40% {
      opacity: 0.6;
      transform: translate(-50%, 0%) scale(0.6) rotateX(5deg);
      filter: blur(5px);
    }
    70% {
      opacity: 0.8;
      transform: translate(-50%, -10%) scale(0.8) rotateX(2deg);
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, 0%) scale(1) rotateX(0deg);
      filter: blur(0);
    }
  }
  
  /* وضع fullscreen مع مركزية مثالية */
  .tv-container.fullscreen,
  .tv-container.keep-fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    aspect-ratio: unset !important;
    transform: none !important;
    z-index: 9998 !important;
    border-radius: 0 !important;
    opacity: 1 !important;
    transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) !important;
    background: #000 !important;
    pointer-events: auto !important;
    filter: none !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* الفيديو في fullscreen */
  .tv-container.fullscreen .tv-video,
  .tv-container.keep-fullscreen .tv-video {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    transform: translate(-50%, -50%) !important;
    opacity: 1 !important;
  }
  
  /* إطار التلفاز في fullscreen */
  .tv-container.fullscreen .tv-frame,
  .tv-container.keep-fullscreen .tv-frame {
    border-radius: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    width: 100% !important;
    height: 100% !important;
  }
  
  /* الشاشة في fullscreen */
  .tv-container.fullscreen .tv-screen,
  .tv-container.keep-fullscreen .tv-screen {
    border-radius: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: transparent !important;
    position: relative !important;
    overflow: hidden !important;
  }
  
  /* إخفاء التأثيرات في fullscreen */
  .tv-container.fullscreen .tv-screen-overlay,
  .tv-container.fullscreen .tv-reflection,
  .tv-container.fullscreen .tv-scanlines,
  .tv-container.keep-fullscreen .tv-screen-overlay,
  .tv-container.keep-fullscreen .tv-reflection,
  .tv-container.keep-fullscreen .tv-scanlines {
    display: none !important;
  }
  
  /* إطار التلفاز */
  .tv-frame {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, 
      rgba(25, 25, 25, 0.95) 0%,
      rgba(45, 45, 45, 0.9) 50%,
      rgba(25, 25, 25, 0.95) 100%
    );
    border-radius: 20px;
    padding: 15px;
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.9),
      0 0 0 2px rgba(233, 72, 14, 0.4),
      inset 0 0 40px rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.15);
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  /* شاشة التلفاز */
  .tv-screen {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .tv-screen::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: 10;
  }
  
  /* تأثيرات شاشة التلفاز عند الظهور */
  .tv-screen.appearing::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg,
      transparent 30%,
      rgba(233, 72, 14, 0.15) 50%,
      transparent 70%);
    z-index: 5;
    animation: screenGlow 2s ease-in-out;
    pointer-events: none;
  }
  
  @keyframes screenGlow {
    0% {
      opacity: 0;
      transform: translateX(-100%);
    }
    20% {
      opacity: 0.5;
    }
    40% {
      opacity: 0.3;
    }
    60% {
      opacity: 0.1;
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }
  
  /* تحسينات للتلفاز في fullscreen */
  .tv-container.fullscreen .tv-screen {
    animation: screenReveal 0.8s ease-out;
  }
  
  @keyframes screenReveal {
    0% {
      box-shadow: inset 0 0 0 100px #000;
    }
    100% {
      box-shadow: inset 0 0 0 0 #000;
    }
  }
  
  /* الفيديو */
  .tv-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 0.6s ease;
    background-color: #000;
  }
  
  .tv-video.loaded {
    opacity: 1 !important;
  }
  
  .tv-container .tv-video.loaded,
  .tv-container.expanding .tv-video.loaded,
  .tv-container.fullscreen .tv-video.loaded {
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  /* تأثيرات الفيديو عند التشغيل */
  .tv-video.playing {
    animation: videoReveal 1.5s ease-out;
  }
  
  @keyframes videoReveal {
    0% {
      opacity: 0;
      filter: brightness(0.5) contrast(1.2);
    }
    50% {
      filter: brightness(1.1) contrast(1.1);
    }
    100% {
      opacity: 1;
      filter: brightness(1) contrast(1);
    }
  }
  
  /* حاوية الفيديو العادية */
  .video-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.77, 0, 0.175, 1);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .video-container.fullscreen {
    opacity: 1 !important;
    z-index: 9999 !important;
    pointer-events: auto;
  }
  
  .fullscreen-video {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.8s ease;
    background-color: #000;
  }
  
  .video-container.fullscreen .fullscreen-video {
    opacity: 1;
  }
  
  /* تأثيرات الفيديو العادي */
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.3) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
  }
  
  .video-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(
      ellipse at center,
      rgba(233, 72, 14, 0.1) 0%,
      transparent 70%
    );
    filter: blur(60px);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .video-container.fullscreen .video-glow {
    opacity: 0.4;
  }
  
  /* تأثيرات شاشة التلفاز */
  .tv-screen-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.15) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.15) 100%
    );
    pointer-events: none;
    z-index: 2;
  }
  
  .tv-reflection {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 3;
  }
  
  .tv-scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.05) 1px,
      rgba(0, 0, 0, 0.05) 2px
    );
    pointer-events: none;
    z-index: 4;
    animation: scanlines 10s linear infinite;
    opacity: 0.7;
    mix-blend-mode: overlay;
  }
  
  @keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
  }
  
  /* تفاصيل إطار التلفاز */
  .tv-bezel {
    position: absolute;
    bottom: -50px;
    left: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(
      to top,
      rgba(35, 35, 35, 0.95) 0%,
      rgba(25, 25, 25, 0.98) 100%
    );
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 25px;
    border-radius: 0 0 20px 20px;
    z-index: 1;
  }
  
  .tv-brand {
    color: rgba(233, 72, 14, 0.9);
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .tv-controls {
    display: flex;
    gap: 20px;
  }
  
  .tv-control {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(233, 72, 14, 0.7);
    position: relative;
    cursor: pointer !important;
    transition: all 0.3s ease;
    pointer-events: auto !important;
  }
  
  .tv-control:hover {
    background: rgba(233, 72, 14, 1);
    transform: scale(1.3);
    box-shadow: 0 0 10px rgba(233, 72, 14, 0.5);
  }
  
  .tv-control::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
  }
  
  .tv-stand {
    position: absolute;
    bottom: -80px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 25px;
    background: linear-gradient(
      to bottom,
      rgba(40, 40, 40, 0.95) 0%,
      rgba(20, 20, 20, 0.98) 100%
    );
    border-radius: 4px 4px 12px 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
  }
  
  /* طبقة الانتقال */
  .transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 9998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .transition-overlay.active {
    opacity: 0.7;
    animation: transitionPulse 0.6s ease;
  }
  
  @keyframes transitionPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 0.9; }
  }
  
  /* المحتوى */
  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    width: 90%;
    max-width: 1200px;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .content.visible {
    opacity: 1;
    visibility: visible;
    pointer-events: all !important;
    z-index: 9999 !important;
    animation: contentReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  @keyframes contentReveal {
    from {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  
  .content.visible * {
    pointer-events: auto !important;
  }
  
  /* العنوان */
  .title-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .title {
    position: relative;
    color: #FFF;
    font-family: "Bebas Neue", sans-serif;
    font-size: clamp(60px, 8vw, 100px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -1px;
    text-align: center;
    transition: transform 0.3s ease;
    cursor: default;
  }
  
  .content.visible .title:hover {
    transform: scale(1.02);
  }
  
  .title-text {
    position: relative;
    z-index: 3;
    display: block;
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.8),
      0 4px 12px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(233, 72, 14, 0.4),
      0 0 60px rgba(233, 72, 14, 0.2);
  }
  
  .title-shadow {
    position: absolute;
    top: 0px;
    left: 4px;
    color: rgba(0, 0, 0, 0.3);
    z-index: 1;
    filter: blur(5px);
    opacity: .7;
  }
  
  .title-glow {
    position: absolute;
    top: 0;
    left: 0;
    color: rgba(233, 72, 14, 0.3);
    z-index: 2;
    filter: blur(15px);
    animation: titleGlowPulse 4s ease-in-out infinite;
  }
  
  @keyframes titleGlowPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  
  .title-underline {
    width: 200px;
    height: 3px;
    background: linear-gradient(90deg, 
      transparent, 
      #E9480E, 
      transparent);
    margin-top: 15px;
    border-radius: 2px;
  }
  
  /* العنوان الفرعي */
  .subtitle-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  }
  
  .subtitle {
    color: #FFF;
    font-family: 'Inter', sans-serif;
    font-size: clamp(20px, 2.5vw, 30px);
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-align: center;
    position: relative;
    cursor: default;
  }
  
  .subtitle-text {
    position: relative;
    z-index: 2;
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.8),
      0 2px 8px rgba(0, 0, 0, 0.6);
  }
  
  .subtitle-decoration {
    position: absolute;
    right: -30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #E9480E;
    opacity: 0.7;
    animation: spinDecoration 10s linear infinite;
  }
  
  @keyframes spinDecoration {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }
  
  .subtitle-line {
    width: 150px;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent);
  }
  
  /* الوصف */
  .description-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    max-width: 800px;
    text-align: center;
  }
  
  .description {
    color: rgba(255, 255, 255, 0.85);
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 1.8vw, 20px);
    font-weight: 300;
    line-height: 1.6;
    position: relative;
    padding: 0 20px;
    cursor: default;
  }
  
  .description-text {
    position: relative;
    z-index: 2;
    display: block;
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.6),
      0 2px 6px rgba(0, 0, 0, 0.4);
  }
  
  .description-line {
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(233, 72, 14, 0.5), 
      transparent);
    border-radius: 1px;
  }
  
  /* الزر */
  .btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-decoration: none;
    position: relative;
    z-index: 10001;
    pointer-events: auto !important;
    cursor: pointer !important;
  }
  
  .btn {
    position: relative;
    height: 65px;
    padding: 18px 48px;
    border-radius: 144px;
    background: linear-gradient(135deg, 
      rgba(52, 50, 50, 0.9) 0%, 
      rgba(28, 26, 26, 0.9) 100%);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer !important;
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(10px);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(233, 72, 14, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
    pointer-events: auto !important;
  }
  
  .btn:hover {
    transform: translateY(-5px) scale(1.05);
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(255, 255, 255, 0.9) 100%);
    box-shadow: 
      0 20px 40px rgba(233, 72, 14, 0.3),
      0 0 60px rgba(233, 72, 14, 0.2),
      inset 0 0 30px rgba(255, 255, 255, 0.1);
    border: 2px solid #E9480E;
  }
  
  .btn:hover .btn-text {
    color: #000;
    letter-spacing: 2px;
  }
  
  .btn-text {
    color: white;
    font-family: "Bebas Neue", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 3;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .btn-glow {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      rgba(233, 72, 14, 0.2) 0%,
      rgba(233, 72, 14, 0.1) 50%,
      rgba(233, 72, 14, 0.2) 100%);
    border-radius: 144px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .btn:hover .btn-glow {
    opacity: 1;
  }
  
  .btn-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    border-radius: 144px;
    background: linear-gradient(135deg, 
      rgba(233, 72, 14, 0.5) 0%,
      rgba(233, 72, 14, 0.3) 50%,
      rgba(233, 72, 14, 0.5) 100%);
    background-clip: padding-box;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .btn:hover .btn-border {
    opacity: 1;
  }
  
  .btn-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    transform: rotate(30deg);
    z-index: 3;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .btn:hover .btn-shine {
    opacity: 1;
    animation: shine 1s ease;
  }
  
  @keyframes shine {
    0% { left: -50%; }
    100% { left: 150%; }
  }
  
  /* تحسينات للاستجابة */
  @media (max-width: 1200px) {
    .tv-container {
      width: 50% !important;
    }
    
    .tv-container.expanding {
      width: 70% !important;
    }
  }
  
  @media (max-width: 768px) {
    .gallery-item.is-first-item {
      height: 100vh;
      min-height: 100vh;
    }
    
    .tv-container {
      width: 85% !important;
    }
    
    .tv-container.expanding {
      width: 100% !important;
    }
    
    .tv-frame {
      padding: 10px;
      border-radius: 15px;
    }
    
    .tv-bezel {
      height: 40px;
      bottom: -40px;
      padding: 0 15px;
    }
    
    .tv-brand {
      font-size: 14px;
    }
    
    .tv-stand {
      bottom: -60px;
      width: 100px;
      height: 20px;
    }
    
    .content {
      width: 95%;
      gap: 30px;
    }
    
    .title {
      font-size: clamp(40px, 6vw, 60px);
    }
    
    .subtitle {
      font-size: clamp(16px, 2vw, 20px);
      letter-spacing: 6px;
    }
    
    .description {
      font-size: clamp(14px, 1.5vw, 18px);
    }
    
    .btn {
      height: 55px;
      padding: 16px 32px;
    }
    
    .btn-text {
      font-size: 20px;
    }
    
    .title-underline {
      width: 150px;
    }
    
    .subtitle-line {
      width: 100px;
    }
    
    .description-line {
      width: 200px;
    }
  }
  
  @media (max-width: 480px) {
    .gallery-item.is-first-item {
      height: 100vh;
      min-height: 100vh;
    }
    
    .tv-container {
      width: 100% !important;
    }
    
    .tv-frame {
      border-radius: 12px;
      padding: 8px;
    }
    
    .tv-bezel {
      height: 30px;
      bottom: -30px;
      padding: 0 10px;
    }
    
    .tv-brand {
      font-size: 12px;
      letter-spacing: 1px;
    }
    
    .tv-stand {
      bottom: -45px;
      width: 80px;
      height: 15px;
    }
    
    .content {
      gap: 25px;
    }
    
    .title {
      font-size: clamp(45px, 5vw, 48px);
    }
    
    .subtitle {
      font-size: 14px;
      letter-spacing: 4px;
    }
    
    .description {
      font-size: 14px;
      line-height: 1.4;
      padding: 0 16px;
    }
    
    .btn {
      height: 50px;
      padding: 14px 28px;
    }
    
    .btn-text {
      font-size: 18px;
    }
    
    .title-underline {
      width: 120px !important;
    }
    
    .subtitle-line {
      width: 80px !important;
    }
    
    .description-line {
      width: 150px !important;
    }
  }
  
  /* إيقاف الأنيميشن للذين يفضلون تقليل الحركة */
  @media (prefers-reduced-motion: reduce) {
    .tv-container,
    .video-container,
    .content,
    .transition-overlay,
    .cinematic-transition,
    .scene-transition,
    .cinematic-lighting,
    .cinematic-overlay {
      transition: none !important;
      animation: none !important;
    }
  }
  
  /* تحسينات للأداء */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* إصلاح كامل لمشكلة الشاشة السوداء في fullscreen */
  .tv-container.fullscreen .tv-video,
  .tv-container.keep-fullscreen .tv-video {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
  }

  /* إزالة أي خلفية سوداء من الشاشة في fullscreen */
  .tv-container.fullscreen .tv-screen,
  .tv-container.keep-fullscreen .tv-screen {
    background: transparent !important;
  }

  /* تأكيد ظهور الفيديو في كل الحالات */
  .tv-video {
    opacity: 1 !important;
    background-color: transparent !important;
  }

  .tv-video.loaded {
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* إصلاح خاص للفيديو الأول في fullscreen */
  .tv-container[data-first-video="true"].fullscreen .tv-video {
    opacity: 1 !important;
    visibility: visible !important;
    z-index: 9999 !important;
  }

  /* إخفاء التأثيرات الزائدة في fullscreen */
  .tv-container.fullscreen .tv-screen-overlay,
  .tv-container.fullscreen .tv-reflection,
  .tv-container.fullscreen .tv-scanlines,
  .tv-container.keep-fullscreen .tv-screen-overlay,
  .tv-container.keep-fullscreen .tv-reflection,
  .tv-container.keep-fullscreen .tv-scanlines {
    display: none !important;
  }

  /* التأكد من أن الشاشة فارغة في fullscreen */
  .tv-container.fullscreen .tv-screen::after {
    display: none !important;
  }
  
  /* تحسينات خاصة للتجربة السينمائية */
  .cinematic-tablet .tv-container {
    transition: all 0.4s ease !important;
  }
  
  .cinematic-tablet .content {
    transform: translate(-50%, -50%) scale(0.98) !important;
  }
  
  .cinematic-mobile .tv-container {
    transition: none !important;
    animation: none !important;
  }
  
  .cinematic-mobile .content {
    transform: translate(-50%, -50%) scale(1) !important;
    transition: opacity 0.3s ease !important;
  }
</style>