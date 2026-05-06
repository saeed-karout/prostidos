<template>
  <div
    class="gallery-item"
    :class="{
      'is-first-item': isFirstItem,
      'is-fullscreen': isFullscreen,
      'is-visible': isVisible,
      'is-expanding': isExpanding
    }"
    ref="galleryItem"
    :style="{ 'z-index': getZIndex() }"
  >
    <!-- تأثيرات الإضاءة والـ overlay السينمائي -->
    <div class="cinematic-lighting" :class="{ 'active': isFullscreen || isExpanding }"></div>
    <div class="cinematic-overlay" :class="{ 'active': isFullscreen || isExpanding }"></div>
    <transition name="scene">
      <div v-if="showSceneTransition" class="scene-transition"></div>
    </transition>

    <!-- حاوية التلفاز المحسّنة -->
    <div
      class="tv-container"
      ref="tvContainer"
      :class="{
        'fullscreen': isFullscreen,
        'expanding': isExpanding,
        'appearing': isAppearing,
        'first-item': isFirstItem
      }"
    >
      <div class="tv-frame" ref="tvFrame">
        <div class="tv-screen" ref="tvScreen">
          <video
            class="tv-video"
            ref="videoEl"
            :poster="videoPoster"
            preload="metadata"
            muted
            playsinline
            webkit-playsinline
            loop
            @loadeddata="onVideoLoaded"
            @canplay="onVideoLoaded"
            @playing="onVideoPlaying"
          >
            <source :src="videoSrc" type="video/mp4" />
          </video>

          <!-- تأثيرات الشاشة المحترفة (أخف وأنيقة) -->
          <div class="tv-screen-glow"></div>
          <div class="tv-subtle-reflection"></div>
        </div>
      </div>
    </div>

    <!-- المحتوى – يبقى كما هو تمامًا (لا تغيير) -->
    <div
      class="content cinematic-typography"
      ref="contentEl"
      :class="{ 'visible': isFullscreen && isContentVisible }"
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

const { t, locale } = useI18n();

const galleryItem = ref(null);
const tvContainer = ref(null);
const tvFrame = ref(null);
const tvScreen = ref(null);
const videoEl = ref(null);
const contentEl = ref(null);

const isVisible = ref(false);
const isExpanding = ref(false);
const isFullscreen = ref(false);
const isContentVisible = ref(false);
const isTransitioning = ref(false);
const isAppearing = ref(false);
const showSceneTransition = ref(false);

const finalButtonText = computed(() => props.buttonText === 'btn-watch' ? t('btn-watch', 'Watch Full Session') : props.buttonText);
const description = computed(() => props.workKey ? t(`featuredWorks.${props.workKey}.description`, '') : '');

const getZIndex = () => {
  if (isFullscreen.value) return 9999;
  if (isVisible.value) return 1000 + props.index;
  return 100 + props.index;
};

const playSceneTransition = () => {
  showSceneTransition.value = true;
  setTimeout(() => showSceneTransition.value = false, 800);
};

const onVideoLoaded = () => {
  if (videoEl.value) {
    videoEl.value.style.opacity = '1';
    if (isVisible.value || isFullscreen.value) {
      videoEl.value.play().catch(() => {});
    }
  }
};

const onVideoPlaying = () => {};

const applyFullscreenStyles = () => {
  if (!tvContainer.value) return;

  Object.assign(tvContainer.value.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    transform: 'none',
    zIndex: '9999',
    background: '#000',
  });

  if (tvFrame.value) {
    tvFrame.value.style.borderRadius = '0';
    tvFrame.value.style.padding = '0';
    tvFrame.value.style.background = 'transparent';
    tvFrame.value.style.boxShadow = 'none';
  }

  if (tvScreen.value) {
    tvScreen.value.style.borderRadius = '0';
    tvScreen.value.style.background = 'transparent';
  }

  if (videoEl.value) {
    Object.assign(videoEl.value.style, {
      objectFit: 'cover',
      opacity: '1',
    });
  }

  // إخفاء التأثيرات في fullscreen
  tvScreen.value?.querySelectorAll('.tv-screen-glow, .tv-subtle-reflection').forEach(el => {
    el.style.opacity = '0';
  });
};

const startVideoAppearance = () => {
  isAppearing.value = true;
  isVisible.value = true;

  if (tvContainer.value) {
    Object.assign(tvContainer.value.style, {
      opacity: '0',
      transform: 'translate(-50%, -50%) scale(0.4)',
    });

    setTimeout(() => {
      Object.assign(tvContainer.value.style, {
        opacity: '1',
        transform: 'translate(-50%, -50%) scale(1.05)',
        transition: 'all 1.8s cubic-bezier(0.22, 0.61, 0.36, 1)',
      });

      setTimeout(() => {
        tvContainer.value.style.transform = 'translate(-50%, -50%) scale(1)';
        if (videoEl.value) videoEl.value.play().catch(() => {});
      }, 300);
    }, 100);
  }
};

const updateItemPosition = () => {
  if (!galleryItem.value) return;

  const rect = galleryItem.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // هل القسم داخل الشاشة أو قريب منها؟
  const isInView = rect.top < windowHeight * 1.2 && rect.bottom > -windowHeight * 0.5;

  if (isInView) {
    // أظهر التلفاز
    tvContainer.value.style.opacity = '1';
    tvContainer.value.style.pointerEvents = 'auto';
  } else {
    // أخفِ التلفاز تمامًا عند الخروج من القسم
    tvContainer.value.style.opacity = '0';
    tvContainer.value.style.pointerEvents = 'none';

    // إعادة الحالة إلى البداية (مهم جدًا)
    isVisible.value = false;
    isExpanding.value = false;
    isFullscreen.value = false;
    isContentVisible.value = false;
  }

  // باقي المنطق (التوسع والـ fullscreen) فقط إذا كان داخل الشاشة
  if (!isInView) return;

  const centered = Math.abs(rect.top + rect.height / 2 - windowHeight / 2) < windowHeight * 0.35;

  if (!isVisible.value) {
    isVisible.value = true;
    if (!props.isFirstItem) {
      tvContainer.value.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
  }

  if (centered && !isExpanding.value) {
    isExpanding.value = true;
    tvContainer.value.style.transform = 'translate(-50%, -50%) scale(1.15)';
  }

  if (centered && isExpanding.value && !isFullscreen.value) {
    isFullscreen.value = true;
    isContentVisible.value = true;
    applyFullscreenStyles();
    playSceneTransition();
    videoEl.value?.play().catch(() => {});
  }
};

let rafId = null;
const handleScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(updateItemPosition);
};

onMounted(() => {
  if (videoEl.value) videoEl.value.muted = true;

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('touchmove', handleScroll, { passive: true });

  nextTick(() => {
    if (props.isFirstItem && tvContainer.value) {
      Object.assign(tvContainer.value.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.4)',
        opacity: '0',
        transition: 'none',
      });
      setTimeout(() => {
        tvContainer.value.style.transition = 'all 1.8s cubic-bezier(0.22, 0.61, 0.36, 1)';
        startVideoAppearance();
      }, 100);
    }

    setTimeout(updateItemPosition, 300);
  });
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  videoEl.value?.pause();
});

watch(locale, () => updateItemPosition());
</script>

<style scoped>
  /* ============================================= */
  /*                 Gallery Item Base              */
  /* ============================================= */
  .gallery-item {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #000;
    isolation: isolate;
  }
  
  /* ============================================= */
  /*                 TV Container                   */
  /* ============================================= */
  .tv-container {
    position: fixed;
    top: 50%;
    left: 50%;
    /* transform: translate(-50%, -50%) scale(0.9); */
    width: 100%;
    /* max-width: 1400px; */
    aspect-ratio: 16/9;
    opacity: 0;
    transition: all 1.6s cubic-bezier(0.22, 0.61, 0.36, 1);
    pointer-events: none;
    z-index: 1000;
  }
  
  .tv-container.appearing,
  .tv-container.is-visible {
    opacity: 1;
  }
  
  .tv-container.expanding {
    /* transform: translate(-50%, -50%) scale(1.15) !important; */
    z-index: 3000;
  }
  
  .tv-container.fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    aspect-ratio: unset !important;
    transform: none !important;
    z-index: 9999 !important;
    background: #000 !important;
  }
  
  /* ============================================= */
  /*                 TV Frame & Screen              */
  /* ============================================= */
  .tv-frame {
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, #111 0%, #222 50%, #111 100%);
    border-radius: 32px;
    padding: 14px;
    box-shadow:
      0 40px 100px rgba(0, 0, 0, 0.95),
      0 0 0 3px rgba(233, 72, 14, 0.5),
      inset 0 0 50px rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    overflow: hidden;
    transition: all 0.6s ease;
  }
  
  .tv-screen {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
  }
  
  .tv-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 1.2s ease;
    background: #000;
  }
  
  .tv-video[src] {
    opacity: 1;
  }
  
  /* تأثيرات شاشة أنيقة وخفيفة */
  .tv-screen-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(233, 72, 14, 0.1) 0%, transparent 65%);
    opacity: 0.7;
    pointer-events: none;
    transition: opacity 0.8s ease;
  }
  
  .tv-subtle-reflection {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.09), transparent);
    pointer-events: none;
    opacity: 0.6;
  }
  
  /* إخفاء التأثيرات في fullscreen */
  .tv-container.fullscreen .tv-screen-glow,
  .tv-container.fullscreen .tv-subtle-reflection {
    opacity: 0;
  }
  
  /* ============================================= */
  /*               Cinematic Effects                */
  /* ============================================= */
  .cinematic-lighting {
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at center top, rgba(233, 72, 14, 0.07) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 1s ease;
    pointer-events: none;
    z-index: 99999;
  }
  
  .cinematic-lighting.active {
    opacity: 1;
  }
  
  .cinematic-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%);
    opacity: 0;
    transition: opacity 1s ease;
    pointer-events: none;
    z-index: 99998;
  }
  
  .cinematic-overlay.active {
    opacity: 1;
  }
  
  .scene-transition {
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 999999;
    opacity: 0;
    pointer-events: none;
    animation: sceneTransition 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  
  @keyframes sceneTransition {
    0% { opacity: 0; }
    40% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .transition-overlay {
    position: fixed;
    inset: 0;
    background: #000;
    opacity: 0;
    z-index: 9998;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  .transition-overlay.active {
    opacity: 0.8;
  }
  
  /* ============================================= */
  /*                   Content (المحتوى)            */
  /* ============================================= */
  /* تم الحفاظ عليه 100% كما كان في النسخة الأصلية التي أحببتها */
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
    background: linear-gradient(90deg, transparent, #E9480E, transparent);
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
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6);
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4);
  }
  
  .description-line {
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(233, 72, 14, 0.5), transparent);
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
    background: linear-gradient(135deg, rgba(52, 50, 50, 0.9) 0%, rgba(28, 26, 26, 0.9) 100%);
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
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
    background: linear-gradient(135deg, rgba(233, 72, 14, 0.2) 0%, rgba(233, 72, 14, 0.1) 50%, rgba(233, 72, 14, 0.2) 100%);
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
    background: linear-gradient(135deg, rgba(233, 72, 14, 0.5) 0%, rgba(233, 72, 14, 0.3) 50%, rgba(233, 72, 14, 0.5) 100%);
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
    background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
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
  
  /* ============================================= */
  /*                 Responsive                     */
  /* ============================================= */
  @media (max-width: 1280px) {
    .tv-container {
      /* width: 80%; */
    }
    .tv-container.expanding {
      /* transform: translate(-50%, -50%) scale(1.1) !important; */
    }
  }
  
  @media (max-width: 1024px) {
    .tv-container {
      width: 85%;
    }
    .tv-frame {
      border-radius: 28px;
      padding: 12px;
    }
  }
  
  @media (max-width: 767px) {
    .tv-container {
      /* width: 94%; */
    }
    .tv-container.expanding {
      /* transform: translate(-50%, -50%) scale(1) !important; */
    }
    .tv-frame {
      border-radius: 20px;
      padding: 8px;
    }
    .content {
      gap: 30px;
    }
    .title {
      font-size: clamp(45px, 7vw, 70px);
    }
    .subtitle {
      font-size: clamp(16px, 2.2vw, 22px);
      letter-spacing: 6px;
    }
    .description {
      font-size: 16px;
      padding: 0 20px;
    }
    .btn {
      height: 58px;
      padding: 16px 40px;
    }
    .btn-text {
      font-size: 22px;
    }
  }
  
  @media (max-width: 480px) {
    .title {
      font-size: clamp(40px, 8vw, 55px);
    }
    .subtitle {
      letter-spacing: 4px;
    }
    .btn {
      padding: 14px 32px;
    }
    .btn-text {
      font-size: 20px;
    }
  }
  
  /* تقليل الحركة للمستخدمين الذين يفضلون ذلك */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  </style>