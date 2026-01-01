<template>
  <div class="relative h-screen w-full overflow-hidden" ref="heroSection" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Video Background -->
    <div class="youtube-container absolute top-0 left-0 w-full h-full z-0" ref="youtubeContainer">
      <!-- Overlay مزدوج لإخفاء شعار يوتيوب -->
      <div class="youtube-overlay youtube-overlay-top"></div>
      <div class="youtube-overlay youtube-overlay-bottom"></div>
      
      <iframe 
        id="youtube-iframe"
        class="youtube-iframe"
        :src="youtubeSrc"
        title="Hero Background Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        playsinline
        webkit-playsinline
        :data-ios="isIOS ? 'true' : 'false'"
        ref="youtubeIframe"
      ></iframe>
      
      <!-- Fallback إذا فشل يوتيوب -->
      <div v-if="showFallback" class="youtube-fallback"></div>
      
      <!-- Overlay لتفعيل التشغيل على iOS -->
      <div 
        v-if="showIOSPlayOverlay" 
        class="ios-play-overlay" 
        @click="handleIOSPlayClick"
      >
        <div class="ios-play-button">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="#E9480E" fill-opacity="0.9"/>
            <path d="M25 20L40 30L25 40Z" fill="white"/>
          </svg>
          <span class="ios-play-text">{{ $t('hero.tapToPlay') || 'Tap to play video' }}</span>
        </div>
      </div>
    </div>

    <!-- Gradient Overlay -->
    <div class="absolute top-0 left-0 w-full h-full bg-gradient z-10 gradient-overlay" ref="gradientOverlay"></div>

    <!-- Content -->
    <div class="absolute flex flex-col gap-[40px] z-20 content-wrapper"
    :class="contentAlignmentClass"
    ref="contentContainer">
      <div class="w-full flex flex-col gap-[25px]">
        <!-- Text2 with animation -->
        <div class="text2 animated-text" ref="text2El">
          <div v-for="(sentence, index) in splitSentences" :key="index" class="sentence-line">
            <span class="typed-text">{{ typedTexts[index] }}</span>
            <span class="cursor" v-if="index === currentLine && isTyping">|</span>
          </div>
        </div>

        <!-- Description container -->
        <div class="flex flex-col gap-[11px]" ref="descriptionContainer">
          <div class="description animated-text" ref="descriptionEl">
            {{ $t('hero.descriptions') }}
          </div>
          <div class="sub-description animated-text" ref="subDescriptionEl">
            {{ $t('hero.sub-description') }}
          </div>
        </div>

        <!-- Buttons container -->
        <div class="buttons pt-[64px] flex gap-[24px] w-full animated-text" ref="buttonsContainer">
          <!-- زر التواصل -->
          <button @click="scrollToSection('contact')" class="btn-contact-hero" ref="bookBtn">
            <span class="btn-contact-text">{{ $t('hero.contact') }}</span>
            <div class="btn-hover-glow"></div>
          </button>

          <!-- زر المشاهدة -->
          <button class="btn-watch-hero" @click="openYouTubeModal" ref="watchBtn">
            <span class="btn-watch-text">{{ $t('hero.watch') }}</span>
            <div class="play-icon-wrapper">
              <font-awesome-icon icon="fa-brands fa-google-play" class="play-icon"/>
            </div>
            <div class="btn-hover-glow"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- YouTube Modal Component -->
    <YouTubeModal
      :is-open="isYouTubeModalOpen"
      :video-id="VIDEO_ID"
      :title="$t('hero.modalTitle') || 'Our Production Reel'"
      :description="$t('hero.modalDescription') || 'Watch our complete production reel showcasing our work and capabilities.'"
      :is-rtl="locale === 'ar'"
      @close="closeYouTubeModal"
    />

    <!-- Floating particles -->
    <div class="floating-particles" ref="particlesContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import YouTubeModal from '@/components/YouTubeModal.vue';

const { t, locale } = useI18n();

// Refs
const heroSection = ref(null);
const youtubeContainer = ref(null);
const youtubeIframe = ref(null);
const gradientOverlay = ref(null);
const contentContainer = ref(null);
const text2El = ref(null);
const descriptionEl = ref(null);
const subDescriptionEl = ref(null);
const descriptionContainer = ref(null);
const buttonsContainer = ref(null);
const bookBtn = ref(null);
const watchBtn = ref(null);
const particlesContainer = ref(null);

// حالة الكتابة
const fullText = computed(() => t('hero.text2'));
const splitSentences = computed(() => {
  return fullText.value
    .split(/(?<=\.)/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
});

const currentLine = ref(0);
const typedTexts = ref([]);
const isTyping = ref(false);

// YouTube Config
const VIDEO_ID = 'XXbVgVoZ-oY';
const START_TIME = 29;
const END_TIME = 92;

// State
const showFallback = ref(false);
const showIOSPlayOverlay = ref(false);
const isYouTubeModalOpen = ref(false);
const hasUserInteracted = ref(false);
const isVideoPlaying = ref(false);

// متغيرات جديدة للمراقبة المحسنة
const isManualSeeking = ref(false);
let safariLoopInterval = null;

// Computed
const isIOS = computed(() => {
  const platform = navigator.platform;
  return /iPad|iPhone|iPod/.test(platform) || 
         (navigator.userAgent.includes("Mac") && "ontouchend" in document);
});

const isSafari = computed(() => {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua) || isIOS.value;
});

const contentAlignmentClass = computed(() => {
  return locale.value === 'ar' 
    ? 'right-[70px] left-auto text-right' 
    : 'left-[70px] right-auto text-left';
});

const youtubeSrc = computed(() => {
  const params = new URLSearchParams({
    autoplay: hasUserInteracted.value ? '1' : '0',
    mute: '1',
    controls: '0',
    playsinline: '1',
    rel: '0',
    iv_load_policy: '3',
    disablekb: '1',
    fs: '0',
    enablejsapi: '1',
    start: START_TIME,
    origin: window.location.origin,
    widget_referrer: window.location.href,
    modestbranding: '1',
    showinfo: '0',
    branding: '0',
    vq: 'hd1080',
    quality: 'hd720',
    cc_load_policy: '0',
    hl: 'en',
    autohide: '1',
    color: 'white',
    wmode: 'transparent',
    playlist: VIDEO_ID, // هذا مهم لمنع الاقتراحات
  });
  
  // إعدادات خاصة لـ iOS/Safari
  if (isIOS.value || isSafari.value) {
    params.set('playsinline', '1');
    params.set('autoplay', hasUserInteracted.value ? '1' : '0');
    params.set('controls', '0');
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('showinfo', '0');
  }
  
  return `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params.toString()}`;
});

// دالة الكتابة
async function typeWriter() {
  typedTexts.value = splitSentences.value.map(() => '');
  currentLine.value = 0;
  isTyping.value = true;

  for (let i = 0; i < splitSentences.value.length; i++) {
    currentLine.value = i;
    const sentence = splitSentences.value[i];
    typedTexts.value[i] = '';

    for (let j = 0; j < sentence.length; j++) {
      typedTexts.value[i] += sentence[j];
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  isTyping.value = false;
}

// دالة خاصة لـiOS لتفعيل التشغيل
function handleIOSPlayClick() {
  hasUserInteracted.value = true;
  showIOSPlayOverlay.value = false;
  isVideoPlaying.value = true;
  
  if (player) {
    player.mute();
    player.playVideo();
  }
  
  // إعادة تحميل الـiframe مع autoplay=1
  if (youtubeIframe.value) {
    youtubeIframe.value.src = youtubeSrc.value;
  }
}

// دوال المودال والسكرول
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function openYouTubeModal() {
  isYouTubeModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeYouTubeModal() {
  isYouTubeModalOpen.value = false;
  document.body.style.overflow = 'auto';
}

// YouTube Player
let player = null;
let checkInterval = null;

function initYouTubePlayer() {
  // إذا كان iOS، نعرض overlay للضغط
  if (isIOS.value && !hasUserInteracted.value) {
    showIOSPlayOverlay.value = true;
    return;
  }

  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  } else {
    onYouTubeIframeAPIReady();
  }
}

function onYouTubeIframeAPIReady() {
  try {
    player = new YT.Player('youtube-iframe', {
      playerVars: {
        autoplay: hasUserInteracted.value || !isIOS.value ? 1 : 0,
        autohide: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
        start: START_TIME,
        branding: 0,
        wmode: 'transparent',
        vq: 'hd720',
        quality: 'hd720',
        playsinline: 1,
        controls: 0,
        playlist: VIDEO_ID
      },
      events: {
        onReady: (event) => {
          event.target.setPlaybackQuality('hd720');
          event.target.setPlaybackRate(1);
          hideYouTubeUI(event.target);
          
          // إعداد مراقبة النهاية المحسنة
          setupEnhancedLoop();

          if (isIOS.value && !hasUserInteracted.value) {
            showIOSPlayOverlay.value = true;
          } else {
            event.target.mute();
            event.target.playVideo().then(() => {
              isVideoPlaying.value = true;
              showIOSPlayOverlay.value = false;
              
              // بدء مراقبة الوقت المحسنة
              startEnhancedTimeMonitoring();
              
              // حل خاص لـ Safari
              if (isSafari.value) {
                setTimeout(() => {
                  startSafariLoopProtection();
                }, 2000);
              }
            }).catch((error) => {
              console.log('Auto-play prevented, showing overlay');
              showIOSPlayOverlay.value = true;
            });
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            showFallback.value = false;
            isVideoPlaying.value = true;
            showIOSPlayOverlay.value = false;
            if (player) hideYouTubeUI(player);
          } else if (event.data === YT.PlayerState.ENDED) {
            console.log('Video ended - restarting from event');
            handleVideoEnd();
          } else if (event.data === YT.PlayerState.PAUSED) {
            isVideoPlaying.value = false;
          } else if (event.data === YT.PlayerState.CUED) {
            console.log('Video cued');
          } else if (event.data === YT.PlayerState.BUFFERING) {
            console.log('Video buffering');
          }
        },
        onError: (event) => {
          console.error('YouTube Player Error:', event.data);
          showFallback.value = true;
          showIOSPlayOverlay.value = false;
        }
      }
    });
  } catch (error) {
    console.error('YouTube Player Init Error:', error);
    showFallback.value = true;
  }
}

// دالة محسنة للتعامل مع نهاية الفيديو
function handleVideoEnd() {
  if (!player || isManualSeeking.value) return;
  
  isManualSeeking.value = true;
  console.log('Handling video end...');
  
  // تأخير أطول لـ Safari
  const delay = isSafari.value ? 500 : 300;
  
  setTimeout(() => {
    try {
      player.seekTo(START_TIME, true);
      console.log(`Seeked to ${START_TIME}s`);
      
      setTimeout(() => {
        if (player && player.playVideo) {
          player.playVideo();
          console.log('Restarted video');
        }
        
        setTimeout(() => {
          isManualSeeking.value = false;
        }, 800);
      }, 200);
    } catch (error) {
      console.error('Error handling video end:', error);
      isManualSeeking.value = false;
    }
  }, delay);
}

// إعداد مراقبة النهاية المحسنة
function setupEnhancedLoop() {
  if (!player) return;
  
  // إضافة مستمع للوضع المحسن
  player.addEventListener('onStateChange', (event) => {
    if (event.data === YT.PlayerState.ENDED) {
      console.log('Enhanced loop: Video ended');
      handleVideoEnd();
    }
  });
}

// مراقبة الوقت المحسنة
function startEnhancedTimeMonitoring() {
  if (checkInterval) clearInterval(checkInterval);
  
  // فحص أكثر تكرراً
  const interval = 400; // كل 400ms
  
  checkInterval = setInterval(() => {
    if (player && player.getCurrentTime && !isManualSeeking.value) {
      try {
        const currentTime = player.getCurrentTime();
        
        // هامش زمني دقيق
        const threshold = isSafari.value ? 1.0 : 0.8;
        
        // تحقق إذا اقتربنا من نهاية الفيديو
        if (currentTime >= (END_TIME - threshold)) {
          console.log(`Time ${currentTime.toFixed(2)}s reached threshold ${END_TIME}s, seeking to ${START_TIME}s`);
          
          // إيقاف مؤقت لمنع التكرار
          isManualSeeking.value = true;
          
          // إعادة التشغيل
          player.seekTo(START_TIME, true);
          
          setTimeout(() => {
            if (player && player.playVideo) {
              player.playVideo();
            }
            
            // إعادة التمكين بعد فترة أمان
            setTimeout(() => {
              isManualSeeking.value = false;
            }, 1000);
          }, 200);
        }
        
        // تحقق إضافي لمنع تجاوز النهاية
        if (currentTime > END_TIME + 1) {
          console.log('WARNING: Video went beyond end time, forcing restart');
          player.seekTo(START_TIME, true);
          setTimeout(() => {
            if (player && player.playVideo) {
              player.playVideo();
            }
          }, 100);
        }
      } catch (error) {
        console.log('Enhanced time monitoring error:', error);
        isManualSeeking.value = false;
      }
    }
  }, interval);
}

// حل خاص لـ Safari/iOS
function startSafariLoopProtection() {
  if (!isSafari.value || !player) return;
  
  if (safariLoopInterval) clearInterval(safariLoopInterval);
  
  let lastCheckedTime = START_TIME;
  let stallCount = 0;
  
  safariLoopInterval = setInterval(() => {
    if (!player || !player.getCurrentTime) {
      clearInterval(safariLoopInterval);
      return;
    }
    
    try {
      const currentTime = player.getCurrentTime();
      
      // فحص إذا توقف الفيديو
      if (Math.abs(currentTime - lastCheckedTime) < 0.05 && isVideoPlaying.value) {
        stallCount++;
        if (stallCount > 3) {
          console.log('Safari: Video stalled, forcing play');
          player.playVideo();
          stallCount = 0;
        }
      } else {
        stallCount = 0;
      }
      
      lastCheckedTime = currentTime;
      
      // فحص دقيق عند الاقتراب من النهاية
      if (currentTime > END_TIME - 2 && currentTime < END_TIME + 2 && !isManualSeeking.value) {
        console.log('Safari: Near end time, preparing loop');
        isManualSeeking.value = true;
        player.seekTo(START_TIME, true);
        
        setTimeout(() => {
          if (player && player.playVideo) {
            player.playVideo();
          }
          
          setTimeout(() => {
            isManualSeeking.value = false;
          }, 500);
        }, 150);
      }
      
    } catch (error) {
      console.log('Safari loop protection error:', error);
    }
  }, 800);
}

function hideYouTubeUI(player) {
  try {
    const iframe = document.getElementById('youtube-iframe');
    if (iframe && iframe.contentDocument) {
      const style = iframe.contentDocument.createElement('style');
      style.textContent = `
        .ytp-chrome-top,
        .ytp-title-channel,
        .ytp-title-text,
        .ytp-watermark,
        .ytp-show-cards-title,
        .ytp-cards-teaser,
        .ytp-chrome-top-buttons,
        .ytp-chrome-controls,
        .ytp-gradient-top,
        .ytp-gradient-bottom,
        .ytp-title,
        .ytp-title-link,
        .ytp-title-channel-logo,
        .ytp-endscreen-content,
        .ytp-ce-element,
        .ytp-pause-overlay,
        .ytp-related-on-error-overlay,
        .ytp-suggestion-set,
        .ytp-endscreen-previous,
        .ytp-endscreen-next {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `;
      iframe.contentDocument.head.appendChild(style);
    }
  } catch (error) {
    console.log('YouTube UI hiding error:', error);
  }
}

// الأنيميشنز
const setupAnimations = () => {
  if (text2El.value) {
    text2El.value.style.opacity = '1';
    text2El.value.style.transform = 'translateY(0)';
    text2El.value.style.filter = 'blur(0)';
  }
  
  if (descriptionContainer.value) {
    descriptionContainer.value.style.opacity = '1';
    descriptionContainer.value.style.transform = 'translateY(0)';
    descriptionContainer.value.style.filter = 'blur(0)';
  }
  
  if (buttonsContainer.value) {
    buttonsContainer.value.style.opacity = '1';
    buttonsContainer.value.style.transform = 'translateY(0)';
    buttonsContainer.value.style.filter = 'blur(0)';
  }

  if (gradientOverlay.value) {
    gradientOverlay.value.style.opacity = '1';
  }

  if (bookBtn.value) {
    bookBtn.value.classList.add('btn-entered');
    setTimeout(() => bookBtn.value.classList.add('animate-float'), 800);
  }

  if (watchBtn.value) {
    watchBtn.value.classList.add('btn-entered');
    setTimeout(() => watchBtn.value.classList.add('animate-float'), 900);
  }

  createFloatingParticles();
};

const createFloatingParticles = () => {
  if (!particlesContainer.value) return;
  particlesContainer.value.innerHTML = '';

  const count = window.innerWidth < 768 ? 8 : 15;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 25 + 15;
    const delay = Math.random() * 10;
    const left = Math.random() * 100;
    const opacity = Math.random() * 0.3 + 0.1;

    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, ${opacity});
      border-radius: 50%;
      top: -10%;
      left: ${left}%;
      animation: ${locale.value === 'ar' ? 'floatRTL' : 'float'} ${duration}s linear infinite;
      animation-delay: ${delay}s;
      pointer-events: none;
      z-index: 5;
    `;
    particlesContainer.value.appendChild(p);
  }
};

// مراقبة تغيير اللغة
watch(locale, () => {
  nextTick(() => {
    typeWriter();
    setupAnimations();
    createFloatingParticles();
  });
});

// مراقبة تفاعل المستخدم للبدء بتشغيل الفيديو
function setupUserInteractionListeners() {
  const startVideoOnInteraction = () => {
    if (!hasUserInteracted.value) {
      hasUserInteracted.value = true;
      showIOSPlayOverlay.value = false;
      
      if (player && !isVideoPlaying.value) {
        player.mute();
        player.playVideo();
      }
      
      // إزالة المستمعات بعد التفاعل الأول
      document.removeEventListener('click', startVideoOnInteraction);
      document.removeEventListener('touchstart', startVideoOnInteraction);
      document.removeEventListener('scroll', startVideoOnInteraction);
    }
  };

  // إضافة مستمعات لتفعيل الفيديو
  document.addEventListener('click', startVideoOnInteraction);
  document.addEventListener('touchstart', startVideoOnInteraction);
  document.addEventListener('scroll', startVideoOnInteraction);
}

let observer;
onMounted(() => {
  typeWriter();
  
  // إعداد مستمعات التفاعل
  setupUserInteractionListeners();
  
  // تأخير تحميل يوتيوب لتحسين الأداء
  setTimeout(() => {
    initYouTubePlayer();
  }, 500);
  
  nextTick(() => {
    setupAnimations();
  });

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          createFloatingParticles();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (heroSection.value) observer.observe(heroSection.value);

  window.addEventListener('resize', createFloatingParticles);
  
  setTimeout(() => {
    addExtraYouTubeHidingCSS();
  }, 2000);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  
  // تنظيف جميع المقاطع الزمنية
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  
  if (safariLoopInterval) {
    clearInterval(safariLoopInterval);
    safariLoopInterval = null;
  }
  
  // تنظيف player
  if (player) {
    try {
      // إزالة جميع المستمعات أولاً
      if (player.removeEventListener) {
        player.removeEventListener('onStateChange');
      }
      
      // إيقاف الفيديو
      if (player.stopVideo) player.stopVideo();
      if (player.clearVideo) player.clearVideo();
      
      // إزالة الـ iframe
      const iframe = document.getElementById('youtube-iframe');
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      
      player.destroy();
      player = null;
    } catch (error) {
      console.log('Player cleanup error:', error);
    }
  }
  
  window.removeEventListener('resize', createFloatingParticles);
  document.body.style.overflow = 'auto';
});

function addExtraYouTubeHidingCSS() {
  const style = document.createElement('style');
  style.textContent = `
    #youtube-iframe::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: linear-gradient(to bottom, rgba(16, 14, 14, 0.95), transparent);
      z-index: 9999;
      pointer-events: none;
    }
    
    .youtube-iframe iframe {
      .ytp-endscreen-content,
      .ytp-ce-element,
      .ytp-pause-overlay,
      .ytp-related-on-error-overlay,
      .ytp-suggestion-set {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}
</script>

<style scoped>
/* ============================================= */
/* YouTube Container - محسن لكل الأجهزة والاتجاهات */
/* ============================================= */
.youtube-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  background: #000;
  isolation: isolate;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.youtube-iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  min-width: 177.78vh;
  min-height: 56.25vw;
  transform: translate(-50%, -50%);
  pointer-events: none;
  filter: brightness(1.1) contrast(1.1) saturate(1.1) blur(0.3px);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-mask-image: linear-gradient(to bottom, black 97%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 97%, transparent 100%);
}

/* Overlay لإخفاء شعار YouTube */
.youtube-overlay {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 2;
  pointer-events: none;
}

.youtube-overlay-top {
  top: 0;
  height: 80px;
  background: linear-gradient(to bottom, 
    rgba(16, 14, 14, 1) 0%,
    rgba(16, 14, 14, 0.95) 20%,
    rgba(16, 14, 14, 0.7) 50%,
    transparent 100%);
}

.youtube-overlay-bottom {
  bottom: 0;
  height: 120px;
  background: linear-gradient(to top, 
    rgba(16, 14, 14, 1) 0%,
    rgba(16, 14, 14, 0.95) 20%,
    rgba(16, 14, 14, 0.7) 50%,
    transparent 100%);
}

/* طبقة إضافية لإخفاء الاسم */
.youtube-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(to bottom, 
    rgba(16, 14, 14, 0.98) 0%,
    rgba(16, 14, 14, 0.9) 30%,
    rgba(16, 14, 14, 0.7) 60%,
    transparent 100%);
  z-index: 3;
  pointer-events: none;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* CSS لمنع اقتراحات YouTube تماماً */
.youtube-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
  background: linear-gradient(to bottom,
    transparent 0%,
    transparent 85%,
    rgba(16, 14, 14, 0.98) 90%,
    rgba(16, 14, 14, 1) 95%,
    rgba(16, 14, 14, 1) 100%
  );
}

/* Fallback styling */
.youtube-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(135deg, #100E0E 0%, #1a1a1a 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* Overlay لـiOS لتفعيل التشغيل */
.ios-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ios-play-overlay:hover {
  background: rgba(0, 0, 0, 0.8);
}

.ios-play-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  padding: 40px;
  background: rgba(16, 14, 14, 0.9);
  border-radius: 20px;
  border: 2px solid rgba(233, 72, 14, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.ios-play-text {
  color: white;
  font-family: "Bebas Neue", sans-serif;
  font-size: 24px;
  letter-spacing: 1px;
}

/* تحسينات خاصة لـiOS */
@supports (-webkit-touch-callout: none) {
  .youtube-iframe {
    -webkit-overflow-scrolling: touch;
    -webkit-mask-image: linear-gradient(to bottom, 
      black 88%, 
      rgba(0, 0, 0, 0.97) 92%,
      rgba(0, 0, 0, 0.9) 96%,
      black 100%);
    mask-image: linear-gradient(to bottom, 
      black 88%, 
      rgba(0, 0, 0, 0.97) 92%,
      rgba(0, 0, 0, 0.9) 96%,
      black 100%);
  }
  
  .youtube-overlay-top {
    height: 100px;
    background: linear-gradient(to bottom, 
      rgba(16, 14, 14, 1) 0%,
      rgba(16, 14, 14, 0.98) 50%,
      rgba(16, 14, 14, 0.85) 80%,
      transparent 100%);
  }
  
  .ios-play-overlay {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .youtube-container::after {
    background: linear-gradient(to bottom,
      transparent 0%,
      transparent 80%,
      rgba(16, 14, 14, 0.95) 85%,
      rgba(16, 14, 14, 0.98) 90%,
      rgba(16, 14, 14, 1) 95%,
      rgba(16, 14, 14, 1) 100%
    );
  }
}

/* تحسينات للتشغيل في Chrome و Firefox */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .youtube-overlay-top {
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
}

/* إخفاء شعار YouTube */
.youtube-iframe iframe {
  .ytp-chrome-top,
  .ytp-show-cards-title,
  .ytp-watermark,
  .ytp-title-text,
  .ytp-title-channel,
  .ytp-title-expanded-heading,
  .ytp-title-expanded-title {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

/* تثبيت موضع الفيديو */
.youtube-iframe,
.youtube-container,
.youtube-overlay-top,
.youtube-overlay-bottom {
  direction: ltr !important;
}

/* ============================================= */
/* Gradient Overlay */
/* ============================================= */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #100E0E 0%, rgba(233, 72, 14, 0.4) 40%, transparent 100%);
  z-index: 10;
  opacity: 1;
}

/* ============================================= */
/* Content Wrapper */
/* ============================================= */
.content-wrapper {
  position: absolute;
  top: 28%;
  max-width: 950px;
  z-index: 20;
}

.content-wrapper.text-right .buttons {
  justify-content: flex-end;
}

.content-wrapper.text-left .buttons {
  justify-content: flex-start;
}

/* تحسين المحاذاة للأزرار حسب اللغة */
[dir="rtl"] .content-wrapper .buttons {
  justify-content: flex-end;
}

[dir="ltr"] .content-wrapper .buttons {
  justify-content: flex-start;
}

/* ============================================= */
/* Text Styles */
/* ============================================= */
.text2 {
  color: #FFF;
  font-family: "Bebas Neue", sans-serif;
  font-size: 82px;
  line-height: 1.15;
  letter-spacing: 1.2px;
  position: relative;
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

[dir="rtl"] .text2 {
  font-family: 'NeoSansArabic', "Bebas Neue", sans-serif !important;
  font-weight: 700;
}

.text2::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 0;
  margin-bottom: -10px;
  height: 4px;
  background: linear-gradient(90deg, #E9480E, transparent);
  transition: width 1s ease 1.2s;
}

[dir="rtl"] .text2::after {
  left: auto;
  right: 0;
  background: linear-gradient(270deg, #E9480E, transparent);
}

.in-view .text2::after {
  width: 220px;
}

.description {
  color: #FFF;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 1.2px;
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.sub-description {
  color: #FFF;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 1px;
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

[dir="rtl"] .description,
[dir="rtl"] .sub-description {
  font-family: 'NeoSansArabic', sans-serif;
}

/* ============================================= */
/* Buttons Container */
/* ============================================= */
.buttons {
  padding-top: 64px;
  display: flex;
  gap: 24px;
  width: 100%;
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* ============================================= */
/* زر التواصل */
/* ============================================= */
.btn-contact-hero {
  display: flex;
  padding: 1rem 3rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  background: #FFF;
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 200px;
  height: 56px;
  justify-content: center;
  font-family: "Bebas Neue", sans-serif;
  font-size: 24px;
  z-index: 2;
  opacity: 1;
  transform: translateY(20px);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
}

.btn-contact-hero.btn-entered {
  animation: btn-entrance 0.8s ease-out forwards;
}

/* ============================================= */
/* زر المشاهدة */
/* ============================================= */
.btn-watch-hero {
  display: flex;
  padding: 1rem 3rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  outline: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 200px;
  height: 56px;
  justify-content: center;
  font-family: "Bebas Neue", sans-serif;
  font-size: 24px;
  z-index: 2;
  opacity: 1;
  transform: translateY(20px);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
}

.btn-watch-hero.btn-entered {
  animation: btn-entrance 0.8s ease-out 0.1s forwards;
}

/* Entrance Animation */
@keyframes btn-entrance {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  70% {
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Floating Animation */
@keyframes floating {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.02);
  }
}

.btn-contact-hero.animate-float,
.btn-watch-hero.animate-float {
  animation: floating 3s ease-in-out infinite;
}

/* Hover Effects */
.btn-contact-hero:hover,
.btn-watch-hero:hover {
  animation-play-state: paused !important;
}

.btn-contact-hero:hover {
  background: #E9480E;
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 15px 40px rgba(233, 72, 14, 0.6),
              0 0 25px rgba(233, 72, 14, 0.4),
              inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(233, 72, 14, 0.9);
  animation: pulse-orange 1.5s ease-in-out infinite !important;
}

.btn-watch-hero:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-4px) scale(1.05) !important;
  box-shadow: 0 15px 40px rgba(233, 72, 14, 0.6),
              0 0 25px rgba(233, 72, 14, 0.4),
              inset 0 0 0 1px rgba(233, 72, 14, 0.3);
  border: 2px solid rgba(233, 72, 14, 0.9);
  animation: pulse-orange 1.5s ease-in-out infinite !important;
}

@keyframes pulse-orange {
  0%, 100% {
    box-shadow: 0 15px 40px rgba(233, 72, 14, 0.6),
                0 0 25px rgba(233, 72, 14, 0.4),
                inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 20px 50px rgba(233, 72, 14, 0.8),
                0 0 35px rgba(233, 72, 14, 0.6),
                inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  }
}

.btn-contact-hero:active,
.btn-watch-hero:active {
  transform: translateY(-2px) scale(1.02) !important;
  transition: all 0.1s ease;
  box-shadow: 0 8px 25px rgba(233, 72, 14, 0.5) !important;
}

/* Button Text */
.btn-contact-text,
.btn-watch-text {
  color: #E9480E;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.6;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
  font-family: "Bebas Neue", sans-serif;
  letter-spacing: 1.2px;
}

.btn-watch-text {
  color: #FFF;
}

.btn-contact-hero:hover .btn-contact-text {
  color: #FFF;
  transform: scale(1.05);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-watch-hero:hover .btn-watch-text {
  color: #333;
  transform: scale(1.05);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Play Icon */
.play-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: all 0.3s ease;
  color: white;
}

.play-icon {
  width: 20px;
  height: auto;
  color: currentColor;
  transition: all 0.3s ease;
  transform-origin: center;
}

.btn-watch-hero:hover .play-icon {
  transform: scale(1.2);
  color: #E9480E;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Cursor for typing */
.cursor {
  animation: blink 0.7s infinite;
  color: #E9480E;
  font-weight: bold;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Floating Particles */
@keyframes float {
  from {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  to {
    transform: translateY(-20vh) translateX(80px);
    opacity: 0.4;
  }
}

@keyframes floatRTL {
  from {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  to {
    transform: translateY(-20vh) translateX(-80px);
    opacity: 0.4;
  }
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: none;
  z-index: 5;
}

/* ============================================= */
/* Responsive */
/* ============================================= */
@media (max-width: 991px) {
  .content-wrapper {
    top: 40%;
    padding: 0 5%;
  }

  .text2 {
    font-size: 60px;
  }

  .buttons {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .btn-contact-hero,
  .btn-watch-hero {
    width: 80%;
    max-width: 400px;
  }

  .youtube-overlay-top {
    height: 90px;
  }

  .youtube-container::before {
    height: 80px;
  }
}

@media (max-width: 767px) {
  .text2 {
    font-size: 48px;
  }

  .description,
  .sub-description {
    font-size: 18px;
  }

  .btn-contact-hero,
  .btn-watch-hero {
    height: 52px;
    font-size: 20px;
    padding: 0.875rem 1.5rem;
  }

  .youtube-overlay-top {
    height: 70px;
  }

  .youtube-container::before {
    height: 60px;
  }
  
  .ios-play-button {
    padding: 30px;
  }
  
  .ios-play-text {
    font-size: 20px;
  }
}

@media (max-width: 575px) {
  .content-wrapper {
    top: 32%;
    left: 0px;
    right: 0px;
  }

  .text2 {
    font-size: 40px;
    line-height: 170%;
  }

  .btn-contact-hero,
  .btn-watch-hero {
    padding: 0.75rem 1.25rem;
    font-size: 20px;
  }

  .youtube-overlay-top {
    height: 60px;
  }

  .youtube-container::before {
    height: 50px;
  }
  
  .ios-play-button {
    padding: 20px;
  }
  
  .ios-play-text {
    font-size: 18px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* تحسينات للأداء */
.play-icon {
  will-change: transform;
}
</style>