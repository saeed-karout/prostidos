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
        :data-safari="isSafari ? 'true' : 'false'"
      ></iframe>
      
      <!-- Fallback إذا فشل يوتيوب -->
      <div v-if="showFallback" class="youtube-fallback"></div>
    </div>

    <!-- Gradient Overlay -->
    <div class="absolute top-0 left-0 w-full h-full bg-gradient z-10 gradient-overlay" ref="gradientOverlay"></div>

    <!-- Content -->
    <div class="absolute flex flex-col gap-[40px] z-20 content-wrapper"
      :class="locale === 'ar' ? 'right-[70px] left-auto' : 'left-[70px] right-auto'" ref="contentContainer">
      <div class="w-full flex flex-col gap-[16px]">
        <!-- Text2 with animation -->
        <div class="text2 animated-text" ref="text2El">
          <div v-for="(sentence, index) in splitSentences" :key="index" class="sentence-line">
            <span class="typed-text">{{ typedTexts[index] }}</span>
            <span class="cursor" v-if="index === currentLine && isTyping">|</span>
          </div>
        </div>

        <!-- Description container -->
        <div class="flex flex-col gap-[8px]" ref="descriptionContainer">
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
              <font-awesome-icon icon="fa-brands fa-google-play " class="play-icon"/>
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
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import YouTubeModal from '@/components/YouTubeModal.vue';

const { t,locale } = useI18n();

// Refs
const heroSection = ref(null);
const youtubeContainer = ref(null);
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

const fullText = computed(() => t('hero.text2'));
const splitSentences = computed(() => {
  return fullText.value
    .split(/(?<=\.)/) // يقسم بعد النقطة مباشرة (يحتفظ بالنقطة)
    .map(s => s.trim())
    .filter(s => s.length > 0);
});


const currentLine = ref(0);
const typedTexts = ref([]); // النصوص المكتوبة حاليًا لكل سطر
const isTyping = ref(false);

async function typeWriter() {
  typedTexts.value = splitSentences.value.map(() => ''); // إعادة تهيئة

  for (let i = 0; i < splitSentences.value.length; i++) {
    currentLine.value = i;
    isTyping.value = true;

    const sentence = splitSentences.value[i];
    typedTexts.value[i] = '';

    for (let j = 0; j < sentence.length; j++) {
      typedTexts.value[i] += sentence[j];
      await nextTick(); // لتحديث الـ DOM
      await new Promise(resolve => setTimeout(resolve, 50)); // سرعة الكتابة (قابلة للتعديل)
    }

    // تأخير قصير بعد انتهاء الجملة قبل البدء بالتالية
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  isTyping.value = false;
}
// YouTube Config
const VIDEO_ID = 'XXbVgVoZ-oY';
const START_TIME = 29;
const END_TIME = 92;

// State
const showFallback = ref(false);
const isYouTubeModalOpen = ref(false);

// Computed Properties
const isSafari = computed(() => {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua) ||
         /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
});

const youtubeSrc = computed(() => {
  const params = new URLSearchParams({
    autoplay: '1',
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
    playsInline: '1',
    webkitPlaysInline: '1',
    // إضافة معلمات إضافية لإخفاء الاسم والشعار
    modestbranding: '1', // 1 لإخفاء الشعار، 0 للظهور
    showinfo: '0', // إخفاء معلومات الفيديو
    // إخفاء شعار YouTube في الزاوية
    branding: '0', // إخفاء العلامة التجارية
    // إعدادات الجودة
    vq: 'hd1080',
    quality: 'hd720',
    default: 'hd720',
    // تحسين التدفق للجودة العالية
    fmt: '37',
    // إخفاء الأزرار
    cc_load_policy: '0',
    hl: 'en',
    // إعدادات إضافية لإخفاء الواجهة
    autohide: '1', // إخفاء عناصر التحكم تلقائياً
    color: 'white', // لون مؤشر التشغيل
    wmode: 'transparent', // لمنع ظهور عناصر فوقية
  });
  
  return `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params.toString()}`;
});

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // console.error(`Element with ID ${sectionId} not found`);
  }
}

// YouTube Modal Functions
function openYouTubeModal() {
  isYouTubeModalOpen.value = true;
  // منع scroll للخلفية
  document.body.style.overflow = 'hidden';
}

function closeYouTubeModal() {
  isYouTubeModalOpen.value = false;
  // إعادة scroll للخلفية
  document.body.style.overflow = 'auto';
}

// YouTube Player للخلفية
let player = null;
let checkInterval = null;

function initYouTubePlayer() {
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
        autohide: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
        start: START_TIME,
        // إضافة إعدادات إضافية لإخفاء الاسم
        branding: 0,
        wmode: 'transparent',
        // إعدادات الجودة
        vq: 'hd720',
        quality: 'hd720'
      },
      events: {
        onReady: (event) => {
          // تعيين الجودة المفضلة
          event.target.setPlaybackQuality('hd720');
          event.target.setPlaybackRate(1);
          
          // إخفاء عناصر واجهة YouTube عبر CSS injection
          hideYouTubeUI(event.target);
          
          if (isSafari.value) {
            setTimeout(() => {
              event.target.mute();
              event.target.playVideo();
              
              setTimeout(() => {
                if (player && player.getPlayerState) {
                  const state = player.getPlayerState();
                  if (state !== YT.PlayerState.PLAYING) {
                    event.target.playVideo();
                  }
                }
              }, 1000);
            }, 500);
          } else {
            event.target.mute();
            event.target.playVideo();
          }
          
          startTimeChecking();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            showFallback.value = false;
            
            // إعادة إخفاء الواجهة عند التشغيل
            if (player) {
              hideYouTubeUI(player);
            }
            
            // عند التشغيل، تأكد من الجودة العالية
            setTimeout(() => {
              if (player && player.setPlaybackQuality) {
                player.setPlaybackQuality('hd720');
              }
            }, 1000);
            
          } else if (event.data === YT.PlayerState.ENDED) {
            event.target.seekTo(START_TIME);
            event.target.playVideo();
          } else if (event.data === YT.PlayerState.PAUSED && isSafari.value) {
            setTimeout(() => {
              if (player && player.playVideo) {
                player.playVideo();
              }
            }, 100);
          }
          
          // عند التبديل في الفيديو، تأكد من الجودة
          if (event.data === YT.PlayerState.BUFFERING) {
            if (player && player.setPlaybackQuality) {
              player.setPlaybackQuality('hd720');
            }
          }
        },
        onError: (event) => {
          // console.error('YouTube Player Error:', event.data);
          showFallback.value = true;
          
          if (event.data === 2 || event.data === 5 || event.data === 100) {
            setTimeout(() => {
              if (player && player.setPlaybackQuality) {
                player.setPlaybackQuality('hd720');
              }
            }, 2000);
          }
        },
        onPlaybackQualityChange: (event) => {
          // إذا تغيرت الجودة إلى منخفضة، حاول رفعها
          if (event.data && !event.data.includes('hd')) {
            setTimeout(() => {
              if (player && player.setPlaybackQuality) {
                player.setPlaybackQuality('hd720');
              }
            }, 1000);
          }
        }
      }
    });
  } catch (error) {
    // console.error('Error initializing YouTube player:', error);
    showFallback.value = true;
  }
}

// دالة لإخفاء واجهة YouTube عبر حقن CSS
function hideYouTubeUI(player) {
  try {
    // إضافة CSS عبر JavaScript لإخفاء العناصر
    const css = `
      .ytp-chrome-top,
      .ytp-title-channel,
      .ytp-title-text,
      .ytp-watermark,
      .ytp-show-cards-title,
      .ytp-cards-teaser,
      .ytp-chrome-top-buttons,
      .ytp-chrome-controls,
      .ytp-gradient-top,
      .ytp-gradient-bottom {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
      
      .youtube-iframe body {
        overflow: hidden !important;
      }
      
      /* إخفاء عنوان الفيديو في الزاوية اليسرى العليا */
      .ytp-title {
        display: none !important;
      }
      
      /* إخفاء شعار YouTube */
      .ytp-watermark {
        display: none !important;
      }
      
      /* إخفاء أي نصوص أو عناوين */
      .ytp-title-link,
      .ytp-title-channel-logo,
      .ytp-title-expanded-heading,
      .ytp-title-expanded-title,
      .ytp-title-expanded-overlay,
      .ytp-chrome-top .ytp-show-watch-later-title,
      .ytp-chrome-top .ytp-share-button-visible {
        display: none !important;
      }
    `;
    
    // حقن CSS في الـ iframe
    const iframe = document.getElementById('youtube-iframe');
    if (iframe && iframe.contentDocument) {
      const style = iframe.contentDocument.createElement('style');
      style.textContent = css;
      iframe.contentDocument.head.appendChild(style);
    }
    
    // محاولة أخرى عبر postMessage
    setTimeout(() => {
      if (player && player.hideVideoInfo) {
        try {
          player.hideVideoInfo();
        } catch (e) {
          // console.log('Could not hide video info via API');
        }
      }
    }, 1000);
    
  } catch (error) {
    // console.log('Error hiding YouTube UI:', error);
  }
}

function startTimeChecking() {
  if (checkInterval) clearInterval(checkInterval);
  
  checkInterval = setInterval(() => {
    if (player && player.getCurrentTime) {
      try {
        const currentTime = player.getCurrentTime();
        if (currentTime >= END_TIME) {
          player.seekTo(START_TIME);
          player.playVideo();
        }
      } catch (error) {
        // console.log('Error checking time:', error);
      }
    }
  }, 1000);
}

// Animations
const setupAnimations = () => {
  // إزالة الأنيميشن القديمة
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

  // إضافة الأزرار فوراً مع animation
  if (bookBtn.value) {
    bookBtn.value.classList.add('btn-entered');
    // إضافة floating animation بعد تأخير
    setTimeout(() => {
      bookBtn.value.classList.add('animate-float');
    }, 800);
  }

  if (watchBtn.value) {
    watchBtn.value.classList.add('btn-entered');
    // إضافة floating animation بعد تأخير
    setTimeout(() => {
      watchBtn.value.classList.add('animate-float');
    }, 900);
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
      animation: float ${duration}s linear infinite;
      animation-delay: ${delay}s;
      pointer-events: none;
      z-index: 5;
    `;
    particlesContainer.value.appendChild(p);
  }
};

let observer;
onMounted(() => {
  typeWriter();
  initYouTubePlayer();
  
  if (isSafari.value) {
    setTimeout(() => {
      const handleUserInteraction = () => {
        if (player && player.playVideo) {
          player.playVideo();
        }
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
      
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
    }, 2000);
  }
  
  // تشغيل الأنيميشن بعد تحميل الصفحة مباشرة
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
  
  // إضافة CSS إضافي بعد التحميل
  setTimeout(() => {
    addExtraYouTubeHidingCSS();
  }, 2000);
});

// دالة لإضافة CSS إضافي لإخفاء اسم الفيديو
function addExtraYouTubeHidingCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* CSS قوي لإخفاء اسم الفيديو في YouTube */
    #youtube-iframe {
      position: relative !important;
    }
    
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
    
    /* إخفاء أي نصوص في أعلى الـ iframe */
    .youtube-container iframe {
      filter: brightness(1.1) contrast(1.1);
    }
    
    /* منع ظهور أي عناصر واجهة */
    .youtube-iframe .html5-video-player * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    
    /* إخفاء المؤشرات الزرقاء */
    .youtube-iframe .ytp-watermark,
    .youtube-iframe .ytp-chrome-top,
    .youtube-iframe .ytp-title-text,
    .youtube-iframe .ytp-title-channel {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
}

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (checkInterval) clearInterval(checkInterval);
  
  if (player) {
    try {
      player.destroy();
      player = null;
    } catch (error) {
      // console.log('Error destroying player:', error);
    }
  }
  
  window.removeEventListener('resize', createFloatingParticles);
  
  // إعادة scroll عند تدمير المكون
  document.body.style.overflow = 'auto';
});
</script>

<style scoped>
/* ============================================= */
/* أنماط YouTube Container - محسنة لإخفاء الاسم */
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
  /* منع أي نصوص من الظهور */
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
  /* إخفاء شعار YouTube والاسم */
  filter: brightness(1.1) contrast(1.1) saturate(1.1) blur(0.3px);
  /* منع أي تأثيرات غير مرغوب فيها */
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  /* تحسينات لأداء سفاري */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* إخفاء الشعار */
  -webkit-mask-image: linear-gradient(to bottom, black 97%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 97%, transparent 100%);
  
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    transform: translate(-50%, -50%) scale(0.999);
  }
}

/* Overlay مزدوج لإخفاء شعار YouTube والاسم */
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

/* إضافة طبقة إضافية لإخفاء الاسم */
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

/* حلول خاصة لمتصفح سفاري لإخفاء الشعار والاسم */
@media not all and (min-resolution:.001dpcm) {
  @supports (-webkit-appearance:none) and (stroke-color:transparent) {
    .youtube-iframe {
      -webkit-transform: translate(-50%, -50%) scale(1.02);
      transform: translate(-50%, -50%) scale(1.02);
      /* إخفاء كامل للشعار والاسم في سفاري */
      -webkit-mask-image: linear-gradient(to bottom, 
        black 85%, 
        rgba(0, 0, 0, 0.95) 90%,
        rgba(0, 0, 0, 0.85) 95%,
        black 100%);
      mask-image: linear-gradient(to bottom, 
        black 85%, 
        rgba(0, 0, 0, 0.95) 90%,
        rgba(0, 0, 0, 0.85) 95%,
        black 100%);
      -webkit-clip-path: inset(10px 0 0 0);
      clip-path: inset(10px 0 0 0);
    }
    
    .youtube-overlay-top {
      height: 100px;
      background: linear-gradient(to bottom, 
        rgba(16, 14, 14, 1) 0%,
        rgba(16, 14, 14, 0.98) 40%,
        rgba(16, 14, 14, 0.9) 70%,
        transparent 100%);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    
    /* إضافة layer إضافية لسفاري */
    .youtube-container::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 90px;
      background: rgba(16, 14, 14, 0.95);
      z-index: 4;
      pointer-events: none;
      mix-blend-mode: multiply;
    }
  }
}

/* For iOS devices */
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
    height: 110px;
    background: linear-gradient(to bottom, 
      rgba(16, 14, 14, 1) 0%,
      rgba(16, 14, 14, 0.98) 50%,
      rgba(16, 14, 14, 0.85) 80%,
      transparent 100%);
  }
}

/* تحسينات للتشغيل في Chrome و Firefox */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .youtube-overlay-top {
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
}

/* إخفاء شعار YouTube في جميع المتصفحات */
.youtube-iframe iframe {
  /* إخفاء عناصر واجهة YouTube */
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

/* CSS خاص لإخفاء عنوان الفيديو */
.youtube-iframe-hider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, 
    rgba(16, 14, 14, 1) 0%,
    rgba(16, 14, 14, 0.95) 30%,
    rgba(16, 14, 14, 0.85) 60%,
    rgba(16, 14, 14, 0.7) 80%,
    transparent 100%);
  z-index: 999;
  pointer-events: none;
}

/* ============================================= */
/* الأنماط الأساسية - نفس الكود */
/* ============================================= */
.bg-gradient {
  background: linear-gradient(to top, #100E0E 0%, rgba(233, 72, 14, 0.4) 40%, transparent 100%);
}

.content-wrapper {
  top: 28%;
  max-width: 820px;
}

.text2 {
  color: #FFF;
  font-family: "Bebas Neue", sans-serif;
  font-size: 82px;
  line-height: 1.15;
  letter-spacing: 1.2px;
  position: relative;
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
}

.sub-description {
  color: #FFF;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 1px;
}

[dir="rtl"] .description,
[dir="rtl"] .sub-description {
  font-family: 'NeoSansArabic', sans-serif;
}

/* ============================================= */
/* زر التواصل - مع أنيميشن جديدة */
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
/* زر المشاهدة - مع أنيميشن جديدة */
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

/* تطبيق Floating Animation */
.btn-contact-hero.animate-float,
.btn-watch-hero.animate-float {
  animation: floating 3s ease-in-out infinite;
}

/* Hover Effects لزر التواصل */
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

/* Pulse Animation باللون البرتقالي */
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

.typed-text {
  display: inline-block;
}

.cursor {
  animation: blink 0.7s infinite;
  color: #E9480E;
  font-weight: bold;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
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
  transform: scale(1.2) ;
  color: #E9480E;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Ripple Effect */
.btn-contact-hero::before,
.btn-watch-hero::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: 1;
}

.btn-contact-hero:hover::before,
.btn-watch-hero:hover::before {
  width: 200px;
  height: 200px;
  opacity: 0;
  transition: width 0.8s ease, height 0.8s ease, opacity 0.8s ease;
}

/* Shine Effect */
.btn-contact-hero::after,
.btn-watch-hero::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: rotate(45deg);
  opacity: 0;
  z-index: 1;
}

.btn-contact-hero:hover::after,
.btn-watch-hero:hover::after {
  opacity: 1;
  animation: shine 1.5s ease-in-out;
}

@keyframes shine {
  0% {
    transform: rotate(45deg) translateX(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%);
  }
}

/* Glow Effect */
.btn-hover-glow {
  position: absolute;
  inset: -2px;
  border-radius: 0.875rem;
  background: linear-gradient(45deg, #E9480E, #FF8C42, #E9480E);
  z-index: 1;
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-contact-hero:hover .btn-hover-glow,
.btn-watch-hero:hover .btn-hover-glow {
  opacity: 0.7;
  animation: glow-rotate 3s linear infinite;
}

@keyframes glow-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* تأثيرات التعويم للجسيمات */
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

[dir="rtl"] .particle {
  animation: floatRTL 30s linear infinite;
}

/* ============================================= */
/* Responsive - نفس الشكل تماماً */
/* ============================================= */
@media (max-width: 991px) {
  .content-wrapper {
    top: 20%;
    left: 5% !important;
    right: 5% !important;
    text-align: start;
  }

  .text2 {
    font-size: 60px;
  }

  .text2::after {
    left: 0;
  }

  .buttons {
    flex-direction: column;
    align-items: start;
    gap: 20px;
  }

  .btn-contact-hero,
  .btn-watch-hero {
    width: 80%;
    max-width: 400px;
    padding: 1rem 2rem;
  }
  
  /* زيادة الـ overlay على الموبايل */
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
  
  .btn-contact-hero:hover,
  .btn-watch-hero:hover {
    transform: translateY(-3px) scale(1.03) !important;
    box-shadow: 0 12px 35px rgba(233, 72, 14, 0.5),
                0 0 20px rgba(233, 72, 14, 0.3) !important;
  }
  
  .play-icon {
    width: 20px;
    height: 20px;
  }
  
  .btn-contact-text,
  .btn-watch-text {
    font-size: 1.1rem;
  }
  
  .youtube-overlay-top {
    height: 70px;
  }
  
  .youtube-container::before {
    height: 60px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
}

@media (max-width: 575px) {
  .content-wrapper {
    top: 35%;
  }

  .text2 {
    font-size: 38px;
  }

  .btn-contact-hero,
  .btn-watch-hero {
    padding: 0.75rem 1.25rem;
    font-size: 18px;
  }
  
  .play-icon {
    width: 18px;
    height: 18px;
  }
  
  .btn-contact-hero:hover,
  .btn-watch-hero:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(233, 72, 14, 0.4),
                0 0 15px rgba(233, 72, 14, 0.2) !important;
  }
  
  .youtube-overlay-top {
    height: 60px;
  }
  
  .youtube-container::before {
    height: 50px;
  }
}

/* تحسينات للأداء */
.play-icon {
  will-change: transform;
}

/* تأثيرات عند النقر */
@keyframes clickEffect {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.btn-contact-hero:active,
.btn-watch-hero:active {
  animation: clickEffect 0.2s ease;
}

/* تحسينات للوصول Accessibility */
.btn-contact-hero:focus-visible,
.btn-watch-hero:focus-visible {
  outline: 2px solid #E9480E;
  outline-offset: 2px;
}

/* تحسينات لسفاري على الموبايل */
@supports (-webkit-touch-callout: none) and (max-width: 768px) {
  .youtube-iframe {
    -webkit-transform: translate(-50%, -50%) scale(1.02);
    transform: translate(-50%, -50%) scale(1.02);
    -webkit-mask-image: linear-gradient(to bottom, 
      black 90%, 
      rgba(0, 0, 0, 0.98) 94%,
      rgba(0, 0, 0, 0.92) 98%,
      black 100%);
    mask-image: linear-gradient(to bottom, 
      black 90%, 
      rgba(0, 0, 0, 0.98) 94%,
      rgba(0, 0, 0, 0.92) 98%,
      black 100%);
  }
  
  .youtube-overlay-top {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    height: 100px;
  }
}

/* إخفاء الشعار في Chrome */
@media screen and (-webkit-min-device-pixel-ratio:0) {
  .youtube-iframe {
    -webkit-mask-image: linear-gradient(to bottom, 
      black 85%, 
      rgba(0, 0, 0, 0.97) 90%,
      rgba(0, 0, 0, 0.92) 95%,
      black 100%);
    mask-image: linear-gradient(to bottom, 
      black 85%, 
      rgba(0, 0, 0, 0.97) 90%,
      rgba(0, 0, 0, 0.92) 95%,
      black 100%);
  }
}

/* حل نهائي لإخفاء شعار YouTube والاسم */
.youtube-iframe {
  /* إزالة أي علامات تجارية */
  .ytp-watermark,
  .ytp-title,
  .ytp-title-text,
  .ytp-title-channel,
  .ytp-chrome-top,
  .ytp-show-watch-later-title,
  .ytp-share-button-visible {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }
}

/* إضافة CSS إضافي لإخفاء الاسم */
.youtube-title-hider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, 
    rgba(16, 14, 14, 1) 0%,
    rgba(16, 14, 14, 0.98) 25%,
    rgba(16, 14, 14, 0.92) 50%,
    rgba(16, 14, 14, 0.85) 75%,
    rgba(16, 14, 14, 0.7) 90%,
    transparent 100%);
  z-index: 999;
  pointer-events: none;
}

/* Force hide all YouTube branding */
#youtube-iframe {
  /* إضافة طبقة إضافية فوق الـ iframe */
  position: relative;
}

#youtube-iframe::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, 
    rgba(16, 14, 14, 1) 0%,
    rgba(16, 14, 14, 0.96) 20%,
    rgba(16, 14, 14, 0.88) 40%,
    rgba(16, 14, 14, 0.75) 60%,
    rgba(16, 14, 14, 0.6) 80%,
    transparent 100%);
  z-index: 9999;
  pointer-events: none;
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>