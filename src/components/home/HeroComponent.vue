<template>
  <div class="relative h-screen w-full overflow-hidden" >
    <!-- Video Background --> 
    <video class="absolute top-0 left-0 w-full h-full object-cover z-0" autoplay loop muted playsinline>
      <source :src="hero" type="video/mp4" />
      {{ $t('videoUnsupported') }}
    </video>

    <!-- Gradient Overlay -->
    <div class="absolute top-0 left-0 w-full h-full bg-gradient z-10"></div>

    <!-- Content -->
    <div class="absolute flex flex-col gap-[40px] w-[80%] h-full left-[70px] top-[30%]  z-20 content-small" :dir="locale === 'ar' ? 'rtl' : 'ltr'"
 >
      <div class="w-full h-[114px] flex flex-col gap-[16px]">
        <div class="text1 h-[28px]">{{ $t('hero.text1') }}</div>
        <div class="text2 h-[70px]">{{ $t('hero.text2') }}</div>
      </div>

      <div class="buttons flex gap-[24px] w-full h-[55px]">
        <div class="book">
          <span>{{ $t('hero.book') }}</span>
        </div>
        <div class="watch" @click="openModal">
          <span>{{ $t('hero.watch') }}</span>
        </div>
      </div>

      <div class="description">{{ $t('hero.descriptions') }}</div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="video-container">
            <video ref="videoPlayer" class="video-player" controls>
              <source :src="production" type="video/mp4" />
              {{ $t('videoUnsupported') }}
            </video>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import production from '@/assets/new-video/production-reel.mp4';
import hero from '@/assets/new-video/Hero.mp4';

import { useI18n } from 'vue-i18n';

const { locale } = useI18n();


// Modal and video state
const isModalOpen = ref(false);
const videoPlayer = ref(null);

// Open modal
function openModal() {
  isModalOpen.value = true;
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = 0; // Reset video to start
    videoPlayer.value.play();
  }
}

// Close modal
function closeModal() {
  isModalOpen.value = false;
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
}

// Event listeners
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isModalOpen.value) {
      closeModal();
    }
  };
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown');
  if (videoPlayer.value) {
    videoPlayer.value.pause();
  }
});
</script>

<style scoped>
/* Video container */
.relative {
  position: relative;
}

.bg-gradient {
  background: linear-gradient(to top, var(--primary, #100E0E), var(--secondary, rgba(233, 72, 14, 0.47)));
  opacity: 0.4;
  z-index: 10;
}

.text1 {
  color: #FFF;
  font-weight: 400;
  font-size: 22px;
  line-height: 125%;
}

.text2 {
  color: #FFF;
  font-family: Rockwell;
  font-weight: 700;
  font-size: 56px;
  line-height: 125%;
}

.book {
  width: 192px;
  height: 55px;
  padding: 16px 40px;
  border-radius: 144px;
  background-color: #FFF;
  color: var(--primary, #E9480E);
  transition: background 0.3s ease, color 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.book:hover {
  background: #E9480E;
  color: #FFF;
}

.book span {
  font-family: Rockwell;
  font-weight: 700;
  font-size: 18px;
  line-height: 120%;
}

.watch {
  width: 320px;
  height: 55px;
  padding: 16px 40px;
  border-radius: 144px;
  background-color: #343232;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.2s ease;
  text-align: center;
}

.watch:hover {
  background-color: #FFF;
  color: #343232;
}

.watch span {
  font-family: Rockwell;
  font-weight: 700;
  font-size: 18px;
  line-height: 120%;
}

.description {
  width: 750px;
  height: 93px;
  font-family: Georgia;
  font-weight: 400;
  font-size: 25px;
  line-height: 125%;
  color: white;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90vw;
  max-width: 920px;
  height: 70vh;
  max-height: 651px;
  border-radius: 16px;
  background: linear-gradient(to bottom right, rgba(233, 72, 14, 0.40) 0%, rgba(16, 14, 14, 0.40) 50%) bottom right / 50% 50% no-repeat,
              linear-gradient(to bottom left, rgba(233, 72, 14, 0.40) 0%, rgba(16, 14, 14, 0.40) 50%) bottom left / 50% 50% no-repeat,
              linear-gradient(to top left, rgba(233, 72, 14, 0.40) 0%, rgba(16, 14, 14, 0.40) 50%) top left / 50% 50% no-repeat,
              linear-gradient(to top right, rgba(233, 72, 14, 0.40) 0%, rgba(16, 14, 14, 0.40) 50%) top right / 50% 50% no-repeat,
              #000;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-player {
  width: 80vw;
  max-width: 384px;
  height: 70vh;
  max-height: 651px;
  object-fit: cover;
  background: #000;
}

/* Fade animation for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (max-width:1200px) {
  .text2{
    font-size: 45px;
  }
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .absolute {
    width: 100%;
height: 100%;
flex-shrink: 0;
left: 0;


    
  }
  .content-small{
    padding: 20px;
    margin: 0 auto;
  }

  .text1 {
    font-size: 18px;
  }

  .text2 {
    font-size: 36px;
    line-height: 110%;
  }

  .buttons {
    flex-direction: column;
    gap: 16px;
    height: auto;
  }

  .book,
  .watch {
    width: 100%;
    max-width: 300px;
    padding: 12px 20px;
    font-size: 16px;
  }

  .description {
    width: 100%;
    font-size: 18px;
    height: auto;
    line-height: 120%;
  }

  .modal-content {
    width: 95vw;
    height: 60vh;
  }

  .video-player {
    width: 90vw;
    height: 60vh;
  }
}


/* Responsive adjustments for screens <= 470px */
@media (max-width: 470px) {
  .absolute {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: start;
  }

  .content-small {
    width: 90%;
    padding: 16px;
    gap: 24px;
    top: 0;
    transform: translateY(20%);
  }

  .text1 {
    font-size: 16px;
    line-height: 120%;
  }

  .text2 {
    font-size: 28px;
    line-height: 110%;
  }

  .buttons {
    gap: 12px;
  }

  .book,
  .watch {
    width: 100%;
    max-width: 250px;
    padding: 10px 16px;
    font-size: 14px;
    height: 45px;
    border-radius: 100px;
  }

  .book span,
  .watch span {
    font-size: 14px;
    line-height: 160%;
  }

  .description {
    font-size: 16px;
    line-height: 115%;
    width: 100%;
    height: auto;
  }

  .modal-content {
    width: 98vw;
    height: 50vh;
    border-radius: 12px;
  }

  .video-player {
    width: 95vw;
    height: 50vh;
    max-height: 300px;
  }
}
</style>




