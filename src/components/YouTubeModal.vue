<!-- components/YouTubeModal.vue -->
<template>
    <transition name="modal">
      <div v-if="isOpen" class="youtube-modal-overlay" @click.self="closeModal">
        <div class="youtube-modal-container" :class="{ 'rtl': isRTL }">
          <!-- زر الإغلاق -->
         
          
          <!-- عنوان الفيديو -->
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
          </div>
          
          <!-- حاوية الفيديو -->
          <div class="video-wrapper">
            <iframe
              ref="videoIframe"
              :src="videoUrl"
              class="youtube-video"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          
          <!-- وصف الفيديو -->
          <div class="modal-footer">
            <p class="video-description">{{ description }}</p>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'Production Reel'
    },
    description: {
      type: String,
      default: 'Watch our complete production reel showcasing our work and capabilities.'
    },
    isRTL: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['close']);
  
  const videoIframe = ref(null);
  
  const videoUrl = ref('');
  
  // إنشاء رابط YouTube مع الإعدادات
  function createVideoUrl() {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '0',
      controls: '1',
      modestbranding: '1',
      playsinline: '1',
      rel: '0',
      iv_load_policy: '3',
      fs: '1',
      enablejsapi: '1',
      origin: window.location.origin,
      widget_referrer: window.location.href,
      playsInline: '1',
      webkitPlaysInline: '1',
      // إخفاء عناصر واجهة المستخدم
      showinfo: '0',
      disablekb: '0',
      cc_load_policy: '0',
      cc_lang_pref: 'en'
    });
    
    return `https://www.youtube.com/embed/${props.videoId}?${params.toString()}`;
  }
  
  function closeModal() {
    emit('close');
  }
  
  // إغلاق المودال بـ ESC
  function handleKeydown(event) {
    if (event.key === 'Escape' && props.isOpen) {
      closeModal();
    }
  }
  
  // إضافة وإزالة event listener
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
  
  // تحديث رابط الفيديو عند فتح المودال
  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      nextTick(() => {
        videoUrl.value = createVideoUrl();
      });
    }
  }, { immediate: true });
  </script>
  
  <style scoped>
  .youtube-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    animation: overlayFadeIn 0.3s ease-out;
  }
  
  @keyframes overlayFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(10px);
    }
  }
  
  .youtube-modal-container {
    position: relative;
    width: 90vw;
    max-width: 1200px;
    background: #111;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
    animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }
  
  .close-button:hover {
    background: rgba(233, 72, 14, 0.9);
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(233, 72, 14, 0.5);
  }
  
  .rtl .close-button {
    right: auto;
    left: 20px;
  }
  
  .modal-header {
    padding: 40px 40px 20px;
    background: linear-gradient(to bottom, #111 0%, #222 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .modal-title {
    color: white;
    font-size: 28px;
    font-weight: 600;
    margin: 0;
    font-family: "Bebas Neue", sans-serif;
    letter-spacing: 1px;
  }
  
  .video-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* نسبة العرض إلى الارتفاع 16:9 */
    height: 0;
    background: #000;
    flex: 1;
  }
  
  .youtube-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .modal-footer {
    padding: 20px 40px 40px;
    background: linear-gradient(to top, #111 0%, #222 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .video-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    font-family: sans-serif;
  }
  
  /* تأثيرات الانتقال */
  .modal-enter-active .youtube-modal-container,
  .modal-leave-active .youtube-modal-container {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .modal-enter-active .youtube-modal-overlay,
  .modal-leave-active .youtube-modal-overlay {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from .youtube-modal-overlay,
  .modal-leave-to .youtube-modal-overlay {
    opacity: 0;
  }
  
  .modal-enter-from .youtube-modal-container,
  .modal-leave-to .youtube-modal-container {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  
  /* تحسينات للاستجابة */
  @media (max-width: 768px) {
    .youtube-modal-container {
      width: 95vw;
      max-height: 80vh;
    }
    
    .modal-header {
      padding: 30px 20px 15px;
    }
    
    .modal-title {
      font-size: 22px;
    }
    
    .close-button {
      top: 15px;
      right: 15px;
      width: 36px;
      height: 36px;
    }
    
    .rtl .close-button {
      left: 15px;
    }
    
    .modal-footer {
      padding: 15px 20px 30px;
    }
    
    .video-description {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .youtube-modal-overlay {
      padding: 10px;
    }
    
    .youtube-modal-container {
      width: 100vw;
      max-height: 70vh;
      border-radius: 10px;
    }
    
    .modal-header {
      padding: 20px 15px 10px;
    }
    
    .modal-title {
      font-size: 18px;
    }
    
    .modal-footer {
      padding: 10px 15px 20px;
    }
    
    .video-description {
      font-size: 13px;
    }
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .youtube-modal-overlay,
    .youtube-modal-container,
    .close-button {
      animation: none;
      transition: none;
    }
  }
  </style>