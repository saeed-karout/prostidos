<template>
    <div 
      v-if="isVisible"
      class="whatsapp-float-container"
      :class="[position, { 'rtl': isRTL }]"
      :style="containerStyle"
    >
      <!-- Tooltip -->
      <transition name="fade">
        <div 
          v-if="isHovered && settings.showTooltip"
          class="whatsapp-tooltip"
          :class="{ visible: isHovered }"
          :style="tooltipStyle"
        >
          {{ tooltipText }}
        </div>
      </transition>
      
      <!-- WhatsApp Link -->
      <a
        :href="whatsappUrl"
        class="whatsapp-float"
        :class="{ 'with-pulse': showPulse && settings.showPulse }"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="ariaLabel"
      >
        <!-- WhatsApp Icon -->
        <svg 
          class="whatsapp-icon" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.424"/>
        </svg>
        
        <!-- Pulse Animation -->
        <transition name="pulse">
          <div 
            v-if="settings.showPulse && showPulse" 
            class="whatsapp-pulse" 
            aria-hidden="true"
          ></div>
        </transition>
        
        <!-- Tap Indicator (Mobile) -->
        <div class="whatsapp-tap-indicator" aria-hidden="true"></div>
      </a>
  
      <!-- Notification Badge -->
      <transition name="notification">
        <div 
          v-if="showNotification && settings.showNotification"
          class="whatsapp-notification"
          aria-hidden="true"
        >
          <span>1</span>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  const { t, locale } = useI18n();
  
  // Props
  const props = defineProps({
    position: {
      type: String,
      default: 'bottom-right',
      validator: (value) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
    },
    phoneNumber: {
      type: String,
      default: '+1234567890' // الرقم الافتراضي
    },
    settings: {
      type: Object,
      default: () => ({
        showPulse: true,
        showTooltip: true,
        showNotification: true,
        delay: 2000,
        autoHideNotification: true,
        notificationDuration: 5000
      })
    },
    messages: {
      type: Object,
      default: () => ({
        en: 'Hello! I would like to get more information.',
        ar: 'مرحباً! أرغب في الحصول على مزيد من المعلومات.'
      })
    },
    tooltips: {
      type: Object,
      default: () => ({
        en: {
          contact: 'Contact us on WhatsApp',
          clickToChat: 'Click to start chatting'
        },
        ar: {
          contact: 'تواصل معنا عبر واتساب',
          clickToChat: 'انقر للبدء بالدردشة'
        }
      })
    }
  });
  
  // Reactive State
  const isVisible = ref(false);
  const isHovered = ref(false);
  const showPulse = ref(true);
  const showNotification = ref(false);
  const isTouching = ref(false);
  
  // Computed Properties
  const isRTL = computed(() => locale.value === 'ar');
  const currentLang = computed(() => locale.value || 'en');
  
  const whatsappUrl = computed(() => {
    const message = props.messages[currentLang.value] || props.messages.en;
    return `https://wa.me/${props.phoneNumber}?text=${encodeURIComponent(message)}`;
  });
  
  const tooltipText = computed(() => {
    if (isHovered.value) {
      return props.tooltips[currentLang.value]?.clickToChat || 
             props.tooltips.en.clickToChat;
    }
    return props.tooltips[currentLang.value]?.contact || 
           props.tooltips.en.contact;
  });
  
  const ariaLabel = computed(() => {
    return props.tooltips[currentLang.value]?.contact || 
           props.tooltips.en.contact;
  });
  
  const containerStyle = computed(() => {
    const baseStyle = {};
    
    // Adjust for RTL
    if (isRTL.value) {
      if (props.position === 'bottom-right') {
        baseStyle.right = 'auto';
        baseStyle.left = '20px';
      } else if (props.position === 'bottom-left') {
        baseStyle.left = 'auto';
        baseStyle.right = '20px';
      }
    }
    
    return baseStyle;
  });
  
  const tooltipStyle = computed(() => {
    if (isRTL.value) {
      return {
        [props.position.includes('right') ? 'left' : 'right']: '70px',
        transformOrigin: props.position.includes('right') ? 'left center' : 'right center'
      };
    }
    return {
      [props.position.includes('right') ? 'right' : 'left']: '70px',
      transformOrigin: props.position.includes('right') ? 'right center' : 'left center'
    };
  });
  
  // Methods
  const handleClick = () => {
    showNotification.value = false;
    showPulse.value = false;
    
    // إرسال حدث إذا لزم الأمر
    emit('click');
  };
  
  const handleMouseEnter = () => {
    isHovered.value = true;
  };
  
  const handleMouseLeave = () => {
    isHovered.value = false;
  };
  
  const handleTouchStart = () => {
    isTouching.value = true;
    isHovered.value = true;
  };
  
  const handleTouchEnd = () => {
    isTouching.value = false;
    setTimeout(() => {
      isHovered.value = false;
    }, 300);
  };
  
  // Timers
  let visibilityTimer;
  let notificationTimer;
  let hideNotificationTimer;
  let pulseTimer;
  
  // Lifecycle
  onMounted(() => {
    // تأخير الظهور
    visibilityTimer = setTimeout(() => {
      isVisible.value = true;
    }, props.settings.delay || 2000);
  
    // إظهار الإشعار بعد فترة
    if (props.settings.showNotification) {
      notificationTimer = setTimeout(() => {
        showNotification.value = true;
      }, 4000);
  
      // إخفاء الإشعار تلقائياً
      if (props.settings.autoHideNotification) {
        hideNotificationTimer = setTimeout(() => {
          showNotification.value = false;
        }, props.settings.notificationDuration || 9000);
      }
    }
  
    // إخفاء النبض بعد فترة
    if (props.settings.showPulse) {
      pulseTimer = setTimeout(() => {
        showPulse.value = false;
      }, 20000);
    }
  });
  
  onUnmounted(() => {
    // تنظيف التايمرات
    clearTimeout(visibilityTimer);
    clearTimeout(notificationTimer);
    clearTimeout(hideNotificationTimer);
    clearTimeout(pulseTimer);
  });
  
  // Watch for language changes
  watch(locale, () => {
    // إعادة تعيين الـ tooltip عند تغيير اللغة
    isHovered.value = false;
  });
  
  // Emit events
  const emit = defineEmits(['click']);
  </script>
  
  <style scoped>
  .whatsapp-float-container {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;
  }
  
  /* Positions */
  .whatsapp-float-container.bottom-right {
    bottom: 20px;
    right: 20px;
  }
  
  .whatsapp-float-container.bottom-left {
    bottom: 20px;
    left: 20px;
  }
  
  .whatsapp-float-container.top-right {
    top: 20px;
    right: 20px;
  }
  
  .whatsapp-float-container.top-left {
    top: 20px;
    left: 20px;
  }
  
  /* RTL Support */
  .whatsapp-float-container.rtl.bottom-right {
    right: auto;
    left: 20px;
  }
  
  .whatsapp-float-container.rtl.bottom-left {
    left: auto;
    right: 20px;
  }
  
  /* WhatsApp Float Button */
  .whatsapp-float {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #25D366, #128C7E);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  .whatsapp-float:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.5);
  }
  
  .whatsapp-float:active {
    transform: scale(0.95);
  }
  
  /* WhatsApp Icon */
  .whatsapp-icon {
    width: 32px;
    height: 32px;
    color: white;
    z-index: 2;
    transition: transform 0.3s ease;
  }
  
  .whatsapp-float:hover .whatsapp-icon {
    transform: scale(1.1);
  }
  
  /* Tooltip */
  .whatsapp-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    z-index: 10000;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .whatsapp-tooltip.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  /* Position Tooltip */
  .bottom-right .whatsapp-tooltip,
  .top-right .whatsapp-tooltip {
    right: 70px;
  }
  
  .bottom-left .whatsapp-tooltip,
  .top-left .whatsapp-tooltip {
    left: 70px;
  }
  
  /* RTL Tooltip */
  .rtl.bottom-right .whatsapp-tooltip,
  .rtl.top-right .whatsapp-tooltip {
    right: auto;
    left: 70px;
    transform-origin: left center;
  }
  
  .rtl.bottom-left .whatsapp-tooltip,
  .rtl.top-left .whatsapp-tooltip {
    left: auto;
    right: 70px;
    transform-origin: right center;
  }
  
  /* Pulse Animation */
  .whatsapp-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #25D366, #128C7E);
    animation: pulse 2s infinite;
    z-index: 1;
    opacity: 0.7;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  
  /* Notification Badge */
  .whatsapp-notification {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #FF3B30;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 2px 8px rgba(255, 59, 48, 0.4);
    z-index: 3;
  }
  
  /* RTL Notification */
  .rtl .whatsapp-notification {
    right: auto;
    left: -8px;
  }
  
  /* Tap Indicator */
  .whatsapp-tap-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .whatsapp-float:active .whatsapp-tap-indicator {
    opacity: 1;
    animation: tapEffect 0.4s ease;
  }
  
  @keyframes tapEffect {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  /* Animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .pulse-enter-active,
  .pulse-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .pulse-enter-from,
  .pulse-leave-to {
    opacity: 0;
  }
  
  .notification-enter-active {
    animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .notification-leave-active {
    animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse;
  }
  
  @keyframes bounceIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  /* Mobile Optimizations */
  @media (max-width: 768px) {
    .whatsapp-float-container {
      bottom: 15px !important;
      right: 15px !important;
      left: auto !important;
    }
    
    .whatsapp-float-container.rtl {
      right: auto !important;
      left: 15px !important;
    }
    
    .whatsapp-float {
      width: 56px;
      height: 56px;
    }
    
    .whatsapp-icon {
      width: 28px;
      height: 28px;
    }
    
    .whatsapp-tooltip {
      font-size: 12px;
      padding: 6px 10px;
      max-width: 140px;
      white-space: normal;
      text-align: center;
    }
    
    .bottom-right .whatsapp-tooltip,
    .top-right .whatsapp-tooltip {
      right: 65px;
    }
    
    .rtl.bottom-right .whatsapp-tooltip,
    .rtl.top-right .whatsapp-tooltip {
      left: 65px;
    }
  }
  
  /* Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    .whatsapp-float-container {
      bottom: 25px !important;
      right: 25px !important;
    }
    
    .whatsapp-float-container.rtl {
      right: auto !important;
      left: 25px !important;
    }
  }
  
  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .whatsapp-float,
    .whatsapp-tooltip,
    .whatsapp-pulse,
    .whatsapp-notification {
      transition: none !important;
      animation: none !important;
    }
  }
  
  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .whatsapp-tooltip {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  }
  
  /* Print Styles */
  @media print {
    .whatsapp-float-container {
      display: none !important;
    }
  }
  </style>