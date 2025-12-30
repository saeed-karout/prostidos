<!-- eslint-disable no-unused-vars -->
<template>
  <div 
    class="gallery-item"
    ref="galleryItem"
    :key="`${workKey}-${locale}`"
    :data-index="index"
    :class="{ 
      'is-first-item': isFirstItem,
      'is-fullscreen': isFullscreen,
      'is-visible': isVisible,
      'is-transitioning': isTransitioning,
      'behind-content': shouldBeBehindContent
    }"
    :style="{
      'z-index': getZIndex()
    }"
  >
    
    <!-- حاوية التلفاز (للفيديو الأول فقط) -->
    <div 
      v-if="isFirstItem"
      class="tv-container" 
      ref="tvContainer"
      :class="{ 
        'fullscreen': isFullscreen,
        'expanding': isExpanding,
        'keep-fullscreen': keepFirstVideoFullscreen,
        'behind': shouldBeBehind,
        'appearing': isAppearing
      }"
      :data-first-video="isFirstItem"
      :data-fullscreen="isFullscreen"
    >
      <!-- إطار التلفاز -->
      <div class="tv-frame" ref="tvFrame">
        <div class="tv-screen" ref="tvScreen">
          <!-- الفيديو داخل شاشة التلفاز -->
          <video
            class="tv-video"
            ref="videoEl"
            :poster="videoPoster"
            preload="auto"
            muted
            playsinline
            webkit-playsinline
            x5-playsinline
            x5-video-player-type="h5"
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
          
          <!-- تأثيرات شاشة التلفاز -->
          <div class="tv-screen-overlay"></div>
          <div class="tv-reflection"></div>
          <div class="tv-scanlines"></div>
        </div>
        
        <!-- تفاصيل إطار التلفاز -->
        <div class="tv-bezel" v-if="!isFullscreen">
          <div class="tv-brand">{{ title }}</div>
          <div class="tv-controls">
            <div class="tv-control tv-power" @click="togglePlay"></div>
            <div class="tv-control tv-volume" @click="toggleSound"></div>
            <div class="tv-control tv-channel" @click="restartVideo"></div>
          </div>
        </div>
        
        <!-- قاعدة التلفاز -->
        <div class="tv-stand" v-if="!isFullscreen"></div>
      </div>
    </div>
    
    <!-- حاوية الفيديو العادية (للفيديوهات الباقية) -->
    <div 
      v-else
      class="video-container"
      ref="videoContainer"
      :class="{ 'fullscreen': isFullscreen }"
    >
      <video
        class="fullscreen-video"
        ref="videoEl"
        :poster="videoPoster"
        preload="auto"
        muted
        playsinline
        webkit-playsinline
        @loadeddata="onVideoLoaded"
        @canplay="onVideoLoaded"
        @error="onVideoError"
      >
        <source :src="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <!-- تأثيرات الفيديو -->
      <div class="video-overlay"></div>
      <div class="video-glow"></div>
    </div>
    
    <!-- طبقة المحتوى -->
    <div 
      class="content" 
      ref="contentEl"
      :class="{ 'visible': isFullscreen && isContentVisible && !shouldBeBehindContent }"
      style="pointer-events: auto;"
    >
      <div class="top">
        <!-- العنوان -->
        <div class="title-wrapper">
          <div class="title">
            <span class="title-text">{{ title }}</span>
            <span class="title-shadow">{{ title }}</span>
            <span class="title-glow">{{ title }}</span>
          </div>
          <div class="title-underline"></div>
        </div>

        <!-- العنوان الفرعي -->
        <div class="subtitle-wrapper">
          <div class="subtitle">
            <span class="subtitle-text">{{ subtitle }}</span>
            <span class="subtitle-decoration">✧</span>
          </div>
          <div class="subtitle-line"></div>
        </div>

        <!-- الوصف -->
        <div 
          v-if="showDescription && description" 
          class="description-wrapper"
        >
          <div class="description">
            <span class="description-text">{{ description }}</span>
          </div>
          <div class="description-line"></div>
        </div>
      </div>

      <!-- الزر -->
      <a 
        :href="buttonLink" 
        target="_blank" 
        class="btn-wrapper"
        @mouseenter="handleButtonHover"
        @mouseleave="handleButtonLeave"
      >
        <div class="btn">
          <span class="btn-text">{{ finalButtonText }}</span>
          <div class="btn-glow"></div>
          <div class="btn-border"></div>
          <div class="btn-shine"></div>
        </div>
      </a>
    </div>

    <!-- طبقة الانتقال -->
    <div 
      class="transition-overlay" 
      :class="{ 'active': isTransitioning }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// تعريف الـ props
const props = defineProps({
  videoSrc: {
    type: String,
    required: true
  },
  videoPoster: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  workKey: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'btn-watch'
  },
  buttonLink: {
    type: String,
    default: '#'
  },
  showDescription: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  },
  isFirstItem: {
    type: Boolean,
    default: false
  }
});

// Refs
const galleryItem = ref(null);
const tvContainer = ref(null);
const videoContainer = ref(null);
const tvFrame = ref(null);
const tvScreen = ref(null);
const videoEl = ref(null);
const contentEl = ref(null);

// الحالة
const isVideoLoaded = ref(false);
const isVisible = ref(false);
const isExpanding = ref(false);
const isFullscreen = ref(false);
const isContentVisible = ref(false);
const isTransitioning = ref(false);
const isPlaying = ref(true);
const isMuted = ref(true);
const scrollProgress = ref(0);
const isFirstVideoCompleted = ref(false);
const isButtonHovered = ref(false);
const videoLoadAttempted = ref(false);
const isVideoPlaying = ref(false);
const userInteracted = ref(false);
const keepFirstVideoFullscreen = ref(false);
const shouldBeBehindContent = ref(false);
const shouldBeBehind = ref(false);
const isAppearing = ref(false);

// === جديد: تتبع ما إذا كان المستخدم وصل قرب نهاية الصفحة ===
const isNearEnd = ref(false);

// Computed Properties
const finalButtonText = computed(() => {
  return props.buttonText === 'btn-watch' ? t('btn-watch', 'Watch Full Session') : props.buttonText;
});

const description = computed(() => {
  if (props.workKey) {
    return t(`featuredWorks.${props.workKey}.description`, '');
  }
  return '';
});

const getZIndex = () => {
  if (shouldBeBehindContent.value) return 10;
  if (isFullscreen.value && !shouldBeBehind.value) return 9999;
  if (isVisible.value) return 1000 + props.index;
  return 100 + props.index;
};

// دوال التفاعل مع الزر
const handleButtonHover = () => {
  isButtonHovered.value = true;
};

const handleButtonLeave = () => {
  isButtonHovered.value = false;
};

// دالة معالجة أخطاء الفيديو
const onVideoError = (e) => {
  console.error('Video error:', e);
  if (videoEl.value && props.isFirstItem) {
    setTimeout(() => {
      videoEl.value.load();
      setTimeout(safePlayVideo, 1000);
    }, 2000);
  }
};

const onVideoPlaying = () => {
  isVideoPlaying.value = true;
};

const onVideoLoaded = () => {
  isVideoLoaded.value = true;
  if (videoEl.value) {
    videoEl.value.classList.add('loaded');
    videoEl.value.style.opacity = '1';
    videoEl.value.style.visibility = 'visible';
    
    if (props.isFirstItem) {
      if (tvScreen.value) {
        setTimeout(() => {
          if (tvScreen.value) tvScreen.value.classList.add('appearing');
        }, 100);
      }
      
      if ((isVisible.value || isFullscreen.value)) {
        setTimeout(() => {
          if (videoEl.value) {
            videoEl.value.classList.add('playing');
            safePlayVideo();
          }
        }, 300);
      }
    }
  }
};

const onVideoEnded = () => {
  if (props.isFirstItem) {
    restartVideo();
  }
};

const onVideoPause = () => {
  isVideoPlaying.value = false;
};

const safePlayVideo = async () => {
  if (!videoEl.value || videoLoadAttempted.value) return;
  
  videoLoadAttempted.value = true;
  
  try {
    videoEl.value.classList.add('playing');
    
    if (videoEl.value.readyState >= 3) {
      const playPromise = videoEl.value.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isVideoPlaying.value = true;
            setTimeout(() => {
              videoEl.value.classList.remove('playing');
            }, 1500);
          })
          .catch((error) => {
            console.log('Auto-play prevented:', error);
            setupUserInteractionPlay();
          });
      }
    } else {
      const waitForReady = () => {
        if (videoEl.value.readyState >= 3) {
          safePlayVideo();
        } else {
          setTimeout(waitForReady, 100);
        }
      };
      waitForReady();
    }
  } catch (error) {
    console.error('Error playing video:', error);
    setupUserInteractionPlay();
  }
};

const setupUserInteractionPlay = () => {
  const playOnInteraction = () => {
    userInteracted.value = true;
    if (videoEl.value && !isVideoPlaying.value) {
      videoEl.value.play()
        .then(() => { isVideoPlaying.value = true; })
        .catch(e => console.log('Still cannot play:', e));
    }
  };
  
  document.addEventListener('click', playOnInteraction, { once: true });
  document.addEventListener('touchstart', playOnInteraction, { once: true });
  document.addEventListener('keydown', playOnInteraction, { once: true });
};

const togglePlay = () => {
  if (!videoEl.value) return;
  userInteracted.value = true;
  
  if (videoEl.value.paused) {
    videoEl.value.play().then(() => {
      isPlaying.value = true;
      isVideoPlaying.value = true;
    });
  } else {
    videoEl.value.pause();
    isPlaying.value = false;
    isVideoPlaying.value = false;
  }
};

const toggleSound = () => {
  if (!videoEl.value) return;
  userInteracted.value = true;
  videoEl.value.muted = !videoEl.value.muted;
  isMuted.value = videoEl.value.muted;
};

const restartVideo = () => {
  if (!videoEl.value) return;
  userInteracted.value = true;
  videoEl.value.currentTime = 0;
  videoEl.value.play().then(() => {
    isPlaying.value = true;
    isVideoPlaying.value = true;
  });
};

// === جديد: فحص ما إذا كان المستخدم قريبًا من نهاية الصفحة ===
const checkIfNearPageEnd = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // إذا بقي أقل من 1.5 شاشة حتى النهاية → نعتبره وصل للنهاية
  const remaining = documentHeight - (scrollTop + windowHeight);
  const threshold = windowHeight * 1.5;

  if (remaining <= threshold && !isNearEnd.value) {
    isNearEnd.value = true;
    forceFirstVideoToFullscreen();
  }
};

// === جديد: إجبار الفيديو الأول على fullscreen عند الوصول لنهاية الصفحة ===
const forceFirstVideoToFullscreen = () => {
  if (!props.isFirstItem || isFullscreen.value || window.innerWidth <= 768) return;

  console.log('🟢 Forcing first video to fullscreen – user near page end');

  isFullscreen.value = true;
  isContentVisible.value = true;
  keepFirstVideoFullscreen.value = true;

  nextTick(() => {
    if (tvContainer.value) {
      applyFullscreenStyles();
      tvContainer.value.classList.add('fullscreen', 'keep-fullscreen');
    }

    if (videoEl.value) {
      videoEl.value.style.opacity = '1';
      videoEl.value.style.visibility = 'visible';
      videoEl.value.style.objectFit = 'cover';
      if (videoEl.value.paused) {
        videoEl.value.play().catch(() => {});
      }
    }
  });
};

const updateItemPosition = () => {
  if (!galleryItem.value) return;
  
  const rect = galleryItem.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const elementTop = rect.top;
  const elementBottom = rect.bottom;
  const elementHeight = rect.height;
  
  let progress = 0;
  
  if (elementTop < windowHeight && elementBottom > 0) {
    const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
    progress = visibleHeight / windowHeight;
  }
  
  scrollProgress.value = progress;
  
  if (props.isFirstItem) {
    updateFirstItem(progress, elementTop, elementBottom, elementHeight, windowHeight);
  } else {
    updateOtherItems(progress, elementTop, elementBottom, elementHeight, windowHeight);
  }
};

const updateFirstItem = (progress, elementTop, elementBottom, elementHeight, windowHeight) => {
  const elementCenter = elementTop + elementHeight / 2;
  const viewportCenter = windowHeight / 2;
  const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
  
  let progressNormalized = progress;
  
  if (elementTop < windowHeight && elementBottom > 0) {
    const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
    progressNormalized = visibleHeight / windowHeight;
  }
  
  scrollProgress.value = progressNormalized;
  
  // === إزالة شروط الموبايل من المنطق ===
  const visibilityThreshold = 0.10;
  const isVisibleEnough = progressNormalized >= visibilityThreshold;
  
  const isAtMiddle = distanceFromCenter < windowHeight * 0.3;
  const isAtTop = elementTop < windowHeight * 0.2 && elementTop > -windowHeight * 0.2;
  
  // === التعديل: إزالة !isMobile ===
  if (isVisibleEnough && !isVisible.value && props.isFirstItem) {
    startVideoAppearance();
  }
  
  if (isAtMiddle && isVisible.value && !isExpanding.value && !isFullscreen.value && props.isFirstItem) {
    expandVideo();
  }
  
  if (isAtTop && isExpanding.value && !isFullscreen.value && props.isFirstItem) {
    startVideoExit();
  }
  
  if ((isVisible.value || isExpanding.value || isFullscreen.value) && props.isFirstItem && videoEl.value) {
    ensureVideoVisibility();
  }
  const shouldBeVisible = progressNormalized > 0.05;
  const shouldBeExpanding = distanceFromCenter < windowHeight * 0.4 && progressNormalized > 0.2;
  const shouldBeFullscreen = distanceFromCenter < windowHeight * 0.2 && progressNormalized > 0.4;
  
  if (shouldBeVisible !== isVisible.value) {
    isVisible.value = shouldBeVisible;
  }
  
  if (shouldBeExpanding !== isExpanding.value) {
    isExpanding.value = shouldBeExpanding;
  }
  
  const scrollThreshold = 0.2;
  const isScrolledPast = elementTop < -windowHeight * 1.5;
  
  if (isScrolledPast) {
    shouldBeBehindContent.value = true;
    shouldBeBehind.value = true;
    isContentVisible.value = false;
    keepFirstVideoFullscreen.value = false;
    
    if (tvContainer.value) {
      tvContainer.value.style.opacity = '0.15';
      tvContainer.value.style.pointerEvents = 'none';
    }
  } else {
    shouldBeBehindContent.value = false;
    shouldBeBehind.value = false;
    
    if (elementTop < windowHeight * scrollThreshold && elementBottom > windowHeight * (1 - scrollThreshold)) {
      if (shouldBeFullscreen && !isFullscreen.value) {
        enterFirstVideoFullscreen();
      }
      
      if (shouldBeExpanding && !isExpanding.value && !isFullscreen.value) {
        isExpanding.value = true;
      }
    } else {
      if (isExpanding.value && !isFullscreen.value) {
        isExpanding.value = false;
      }
    }
    
    if (isFullscreen.value && !shouldBeFullscreen && elementTop < -windowHeight * 0.2) {
      keepFirstVideoFullscreen.value = true;
      isContentVisible.value = false;
      
      if (tvContainer.value) {
        tvContainer.value.style.opacity = '0.8';
      }
    }
    
    if (keepFirstVideoFullscreen.value && elementTop > -windowHeight * 0.05) {
      keepFirstVideoFullscreen.value = false;
      if (shouldBeFullscreen || elementTop > -windowHeight * 0.01) {
        isContentVisible.value = true;
      }
      if (tvContainer.value) {
        tvContainer.value.style.opacity = '1';
      }
    }
    
    if (isFullscreen.value && elementTop > windowHeight * 0.1) {
      exitFullscreen();
    }
  }
  
  if (tvContainer.value && tvFrame.value && tvScreen.value) {
    if (isScrolledPast) {
      applyBehindContentStyles();
    } else if (isFullscreen.value || keepFirstVideoFullscreen.value) {
      applyFullscreenStyles();
    } else if (shouldBeExpanding || isExpanding.value) {
      applyExpandingStyles(progressNormalized);
    } else {
      applyNormalStyles(progressNormalized);
    }
  }
  
  if (videoEl.value && props.isFirstItem) {
    if (isScrolledPast) {
      if (!videoEl.value.paused) {
        videoEl.value.pause();
        videoEl.value.style.opacity = '0.5';
      }
    } else if ((shouldBeFullscreen || keepFirstVideoFullscreen.value) && !isVideoPlaying.value) {
      if (isVideoLoaded.value || userInteracted.value) {
        safePlayVideo();
        ensureVideoVisibility();
      }
    } else if (shouldBeFullscreen || keepFirstVideoFullscreen.value) {
      if (videoEl.value.paused && !videoEl.value.ended) {
        videoEl.value.play().catch(() => {});
      }
      videoEl.value.style.opacity = '1';
    } else if (!shouldBeFullscreen && !shouldBeExpanding) {
      if (!videoEl.value.paused) {
        videoEl.value.pause();
      }
    }
  }
};

const startVideoAppearance = () => {
  if (!props.isFirstItem || isAppearing.value) return; // إزالة شرط الموبايل
  
  isAppearing.value = true;
  isVisible.value = true;
  
  if (tvContainer.value) {
    tvContainer.value.style.opacity = '0';
    tvContainer.value.style.transform = 'translate(-50%, 70%) scale(0.4)';
    tvContainer.value.style.pointerEvents = 'none';
    tvContainer.value.style.transition = 'all 1s cubic-bezier(0.215, 0.61, 0.355, 1)';
    
    setTimeout(() => {
      tvContainer.value.style.opacity = '0.8';
      tvContainer.value.style.transform = 'translate(-50%, 30%) scale(0.6)';
      tvContainer.value.style.pointerEvents = 'auto';
      
      if (tvScreen.value) {
        tvScreen.value.classList.add('appearing');
      }
      
      if (videoEl.value) {
        if (!isVideoLoaded.value) videoEl.value.load();
        
        setTimeout(() => {
          videoEl.value.style.opacity = '1';
          videoEl.value.style.visibility = 'visible';
          videoEl.value.classList.add('playing');
          safePlayVideo();
        }, 300);
      }
    }, 100);
  }
};

const expandVideo = () => {
  if (!props.isFirstItem || isExpanding.value || isFullscreen.value) return; // إزالة شرط الموبايل
  
  isExpanding.value = true;
  
  if (tvContainer.value) {
    tvContainer.value.style.transition = 'all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)';
    tvContainer.value.style.opacity = '1';
    tvContainer.value.style.transform = 'translate(-50%, 5%) scale(0.8)';
    
    if (videoEl.value) {
      videoEl.value.style.opacity = '1';
      videoEl.value.style.transition = 'opacity 0.3s ease';
      
      if (videoEl.value.paused) {
        setTimeout(() => {
          videoEl.value.classList.add('playing');
          safePlayVideo();
        }, 400);
      }
    }
  }
};

const startVideoExit = () => {
  if (!props.isFirstItem || !isExpanding.value || isFullscreen.value) return; // إزالة شرط الموبايل
  
  if (tvContainer.value) {
    tvContainer.value.style.transition = 'all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)';
    tvContainer.value.style.opacity = '1';
    tvContainer.value.style.transform = 'translate(-50%, -5%) scale(0.95)';
    
    setTimeout(() => {
      enterFirstVideoFullscreen();
    }, 300);
  }
};
const applyBehindContentStyles = () => {
  if (!tvContainer.value) return;
  tvContainer.value.style.position = 'fixed';
  tvContainer.value.style.top = '0';
  tvContainer.value.style.left = '0';
  tvContainer.value.style.width = '100vw';
  tvContainer.value.style.height = '100vh';
  tvContainer.value.style.transform = 'none';
  tvContainer.value.style.opacity = '0.15';
  tvContainer.value.style.zIndex = '10';
  tvContainer.value.style.transition = 'all 0.5s ease';
  tvContainer.value.style.pointerEvents = 'none';
  tvContainer.value.style.filter = 'blur(2px)';
  
  if (tvFrame.value) {
    tvFrame.value.style.borderRadius = '0';
    tvFrame.value.style.padding = '0';
    tvFrame.value.style.background = 'transparent';
    tvFrame.value.style.boxShadow = 'none';
    tvFrame.value.style.transform = 'none';
  }
  
  if (tvScreen.value) {
    tvScreen.value.style.borderRadius = '0';
    tvScreen.value.style.width = '100%';
    tvScreen.value.style.height = '100%';
  }
  
  const tvBezel = tvFrame.value?.querySelector('.tv-bezel');
  const tvStand = tvFrame.value?.querySelector('.tv-stand');
  if (tvBezel) tvBezel.style.display = 'none';
  if (tvStand) tvStand.style.display = 'none';
};

const applyFullscreenStyles = () => {
  if (!tvContainer.value) return;
  
  tvContainer.value.style.position = 'fixed';
  tvContainer.value.style.top = '0';
  tvContainer.value.style.left = '0';
  tvContainer.value.style.width = '100vw';
  tvContainer.value.style.height = '100vh';
  tvContainer.value.style.transform = 'none';
  tvContainer.value.style.opacity = '1';
  tvContainer.value.style.zIndex = '9998';
  tvContainer.value.style.transition = 'all 0.5s ease';
  tvContainer.value.style.pointerEvents = 'auto';
  tvContainer.value.style.filter = 'none';
  tvContainer.value.style.background = 'transparent';
  
  if (tvFrame.value) {
    tvFrame.value.style.borderRadius = '0';
    tvFrame.value.style.padding = '0';
    tvFrame.value.style.background = 'transparent';
    tvFrame.value.style.boxShadow = 'none';
    tvFrame.value.style.transform = 'none';
    tvFrame.value.style.border = 'none';
  }
  
  if (tvScreen.value) {
    tvScreen.value.style.borderRadius = '0';
    tvScreen.value.style.width = '100%';
    tvScreen.value.style.height = '100%';
    tvScreen.value.style.background = 'transparent';
    tvScreen.value.style.border = 'none';
  }
  
  if (videoEl.value) {
    videoEl.value.style.opacity = '1';
    videoEl.value.style.visibility = 'visible';
    videoEl.value.style.objectFit = 'cover';
    videoEl.value.style.width = '100%';
    videoEl.value.style.height = '100%';
    videoEl.value.style.position = 'absolute';
    videoEl.value.style.top = '0';
    videoEl.value.style.left = '0';
    videoEl.value.style.zIndex = '9999';
  }
  
  const tvBezel = tvFrame.value?.querySelector('.tv-bezel');
  const tvStand = tvFrame.value?.querySelector('.tv-stand');
  const overlays = tvScreen.value?.querySelectorAll('.tv-screen-overlay, .tv-reflection, .tv-scanlines');
  if (tvBezel) tvBezel.style.display = 'none';
  if (tvStand) tvStand.style.display = 'none';
  if (overlays) overlays.forEach(el => el.style.display = 'none');
};

const applyExpandingStyles = (progress) => {
  const scale = 0.5 + (progress * 0.5);
  const translateY = -20 + (progress * 40);
  
  if (!tvContainer.value) return;
  tvContainer.value.style.position = 'fixed';
  tvContainer.value.style.top = '50%';
  tvContainer.value.style.left = '50%';
  tvContainer.value.style.width = `${40 + (progress * 40)}%`;
  tvContainer.value.style.transform = `translate(-50%, ${translateY}%) scale(${scale})`;
  tvContainer.value.style.opacity = `${0.5 + (progress * 0.5)}`;
  tvContainer.value.style.transition = 'all 0.3s ease';
  tvContainer.value.style.zIndex = '2000';
  tvContainer.value.style.filter = 'none';
  
  const borderRadius = 20 * (1 - progress * 0.8);
  if (tvFrame.value) {
    tvFrame.value.style.borderRadius = `${borderRadius}px`;
    tvFrame.value.style.padding = '15px';
    tvFrame.value.style.background = 'linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(45, 45, 45, 0.9) 50%, rgba(25, 25, 25, 0.95) 100%)';
    tvFrame.value.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 0 2px rgba(233, 72, 14, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.15)';
  }
  
  const tvBezel = tvFrame.value?.querySelector('.tv-bezel');
  const tvStand = tvFrame.value?.querySelector('.tv-stand');
  if (tvBezel) tvBezel.style.display = 'flex';
  if (tvStand) tvStand.style.display = 'block';
};

const applyNormalStyles = (progress) => {
  const scale = 0.3 + (progress * 0.2);
  const translateY = 50 - (progress * 50);
  
  if (!tvContainer.value) return;
  tvContainer.value.style.position = 'fixed';
  tvContainer.value.style.top = '50%';
  tvContainer.value.style.left = '50%';
  tvContainer.value.style.width = '40%';
  tvContainer.value.style.transform = `translate(-50%, ${translateY}%) scale(${scale})`;
  tvContainer.value.style.opacity = `${progress * 0.7}`;
  tvContainer.value.style.transition = 'all 0.3s ease';
  tvContainer.value.style.zIndex = '1000';
  tvContainer.value.style.filter = 'none';
  
  if (tvFrame.value) {
    tvFrame.value.style.borderRadius = '20px';
    tvFrame.value.style.padding = '15px';
    tvFrame.value.style.background = 'linear-gradient(145deg, rgba(25, 25, 25, 0.95) 0%, rgba(45, 45, 45, 0.9) 50%, rgba(25, 25, 25, 0.95) 100%)';
    tvFrame.value.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 0 2px rgba(233, 72, 14, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.15)';
  }
  
  const tvBezel = tvFrame.value?.querySelector('.tv-bezel');
  const tvStand = tvFrame.value?.querySelector('.tv-stand');
  if (tvBezel) tvBezel.style.display = 'flex';
  if (tvStand) tvStand.style.display = 'block';
};

const enterFirstVideoFullscreen = () => {
  if (isTransitioning.value || !props.isFirstItem) return;
  
  console.log('🟢 Entering fullscreen (mobile allowed)');
  requestFullscreenOnMobile();
  isTransitioning.value = true;
  isExpanding.value = false;
  
  if (tvScreen.value) {
    tvScreen.value.classList.remove('appearing');
  }
  
  if (videoEl.value) {
    videoEl.value.style.opacity = '1';
    videoEl.value.style.visibility = 'visible';
    videoEl.value.style.zIndex = '9999';
  }
  
  setTimeout(() => {
    isFullscreen.value = true;
    isFirstVideoCompleted.value = true;
    
    if (tvContainer.value && videoEl.value) {
      tvContainer.value.style.transition = 'none';
      applyFullscreenStyles();
      
      videoEl.value.style.opacity = '1';
      videoEl.value.style.visibility = 'visible';
      videoEl.value.style.objectFit = 'cover';
      videoEl.value.style.zIndex = '9999';
      
      setTimeout(() => {
        tvContainer.value.style.transition = 'all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)';
        
        if (videoEl.value.paused) {
          videoEl.value.play().catch(() => {
            setTimeout(() => { 
              if (videoEl.value) videoEl.value.play().catch(() => {}); 
            }, 300);
          });
        }
        
        setTimeout(() => {
          isContentVisible.value = true;
          isTransitioning.value = false;
        }, 300);
      }, 50);
    }
  }, 100);
};

// دالة لطلب fullscreen على الموبايل
const requestFullscreenOnMobile = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile && videoEl.value && !document.fullscreenElement) {
    // محاولة الدخول إلى fullscreen mode
    if (videoEl.value.requestFullscreen) {
      videoEl.value.requestFullscreen().catch(e => {
        console.log('Fullscreen request failed:', e);
      });
    } else if (videoEl.value.webkitRequestFullscreen) {
      videoEl.value.webkitRequestFullscreen();
    } else if (videoEl.value.mozRequestFullScreen) {
      videoEl.value.mozRequestFullScreen();
    } else if (videoEl.value.msRequestFullscreen) {
      videoEl.value.msRequestFullscreen();
    }
  }
};

const ensureVideoVisibility = () => {
  if (!videoEl.value || !props.isFirstItem) return;
  
  videoEl.value.style.opacity = '1';
  videoEl.value.style.transition = 'opacity 0.5s ease';
  
  if (videoEl.value.readyState < 3) {
    videoEl.value.load();
    setTimeout(() => { videoEl.value.style.opacity = '1'; }, 500);
  }
  
  if (videoEl.value.paused && !videoEl.value.ended) {
    videoEl.value.play().catch(() => {
      setTimeout(() => { if (videoEl.value) videoEl.value.play().catch(() => {}); }, 300);
    });
  }
};

const updateOtherItems = (progress, elementTop, elementBottom, elementHeight, windowHeight) => {
  const shouldBeFullscreen = progress > 0.2;
  const shouldBeVisible = progress > 0.05;
  const shouldTransition = progress > 0.15 && progress < 0.25;
  
  const isScrolledPast = elementTop < -windowHeight * 0.5;
  
  if (shouldBeVisible !== isVisible.value) {
    isVisible.value = shouldBeVisible;
  }
  
  if (shouldBeFullscreen !== isFullscreen.value && !isScrolledPast) {
    if (shouldBeFullscreen && !isFullscreen.value) {
      enterFullscreenWithTransition();
    } else if (!shouldBeFullscreen && isFullscreen.value) {
      exitFullscreen();
    }
  }
  
  if (shouldTransition !== isTransitioning.value) {
    isTransitioning.value = shouldTransition;
  }
  
  if (videoContainer.value) {
    const opacity = shouldBeFullscreen ? 1 : Math.min(progress * 2, 1);
    videoContainer.value.style.opacity = opacity.toString();
    
    if (isScrolledPast) {
      videoContainer.value.style.opacity = '0';
    }
  }
};

const enterFullscreenWithTransition = () => {
  isTransitioning.value = true;
  
  setTimeout(() => {
    isFullscreen.value = true;
    
    if (videoContainer.value && videoEl.value) {
      videoContainer.value.classList.add('fullscreen');
      videoEl.value.style.objectFit = 'cover';
      
      if (videoEl.value.paused && isVideoLoaded.value) {
        videoEl.value.play().catch(() => {});
      }
    }
    
    setTimeout(() => {
      isContentVisible.value = true;
      isTransitioning.value = false;
    }, 200);
  }, 150);
};

const exitFullscreen = () => {
  if (!props.isFirstItem) {
    isFullscreen.value = false;
    isContentVisible.value = false;
    isTransitioning.value = false;
    
    if (videoContainer.value) {
      videoContainer.value.classList.remove('fullscreen');
    }
    
    if (videoEl.value) {
      videoEl.value.pause();
      videoEl.value.style.opacity = '0.5';
    }
  }
};

let rafId = null;
const handleScroll = () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => {
    updateItemPosition();
    checkIfNearPageEnd(); // ← السطر الجديد المهم
  });
};

const handleResize = () => {
  updateItemPosition();
  checkIfNearPageEnd();
  
  if (props.isFirstItem) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && isFullscreen.value) {
      isFullscreen.value = false;
      isContentVisible.value = false;
      nextTick(() => {
        if (tvContainer.value) {
          tvContainer.value.style.opacity = '0';
          tvContainer.value.style.transform = 'translate(-50%, 50%) scale(0.3)';
        }
      });
    }
  }
};

onMounted(() => {
  if (videoEl.value) {
    videoEl.value.muted = true;
    isMuted.value = true;
    
    videoEl.value.addEventListener('loadeddata', () => {
      if (videoEl.value) {
        videoEl.value.style.opacity = '1';
        videoEl.value.style.visibility = 'visible';
      }
    });
    
    videoEl.value.addEventListener('canplay', () => {
      if (videoEl.value) {
        videoEl.value.style.opacity = '1';
        videoEl.value.style.visibility = 'visible';
      }
    });
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize);
  window.addEventListener('touchmove', handleScroll, { passive: true });
  
  setupUserInteractionPlay();
  
  nextTick(() => {
    // === تبسيط: نفس الإعدادات لجميع الأجهزة ===
    if (props.isFirstItem) {
      isVisible.value = false;
      isAppearing.value = false;
      isExpanding.value = false;
      isFullscreen.value = false;
      isContentVisible.value = false;
      
      if (tvContainer.value) {
        tvContainer.value.style.opacity = '0';
        tvContainer.value.style.transform = 'translate(-50%, 80%) scale(0.3)';
        tvContainer.value.style.transition = 'none';
        tvContainer.value.style.pointerEvents = 'none';
        
        setTimeout(() => {
          if (tvContainer.value) {
            tvContainer.value.style.transition = 'all 1.5s cubic-bezier(0.215, 0.61, 0.355, 1)';
          }
        }, 100);
      }
      
      if (videoEl.value) {
        setTimeout(() => { videoEl.value.load(); }, 300);
      }
    } else {
      if (videoContainer.value) {
        videoContainer.value.style.opacity = '0';
      }
    }
    
    setTimeout(() => {
      updateItemPosition();
      checkIfNearPageEnd();
    }, 100);
  });
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  
  if (videoEl.value) {
    videoEl.value.pause();
    videoEl.value.src = '';
    videoEl.value.load();
  }
});

watch(locale, () => {
  setTimeout(updateItemPosition, 100);
});
</script>


<style scoped>
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
  
  /* حاوية التلفاز */
  .tv-container {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 40%;
    max-width: 800px;
    min-width: 300px;
    aspect-ratio: 16/9;
    transform: translate(-50%, 50%) scale(0.3);
    transform-origin: center center;
    z-index: 1000;
    opacity: 0;
    pointer-events: auto;
    will-change: transform, opacity, width, height;
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tv-container.expanding {
    z-index: 2000;
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
    top: 50%;
    left: 50%;
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
    top: 4px;
    left: 4px;
    color: rgba(0, 0, 0, 0.3);
    z-index: 1;
    filter: blur(4px);
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
    font-size: clamp(18px, 2.5vw, 28px);
    font-weight: 500;
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
    .transition-overlay {
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


</style>