<template>
  <div v-if="showSplash" class="animated-gradient fixed inset-0 flex items-center justify-center z-50">
    <transition name="fade" mode="out-in">
      <div v-if="showLogo" key="logo" class="flex flex-col items-center">
        <!-- Replace 'loading-icon.png' with your logo path -->
        <img src="/logos/logo.svg" alt="Logo" class="w-32 h-32 mb-4 animate-spin-slow">
      </div>
      <div v-else-if="showText" key="text" class="text-center">
        <p class="text-2xl font-semibold text-white">
          www.prostdios.com
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['finished'])

const showSplash = ref(true)
const showLogo = ref(true)
const showText = ref(false)

onMounted(() => {
  if (sessionStorage.getItem('splashShown')) {
    showSplash.value = false
    emit('finished')
  } else {
    setTimeout(() => {
      showLogo.value = false
      showText.value = true
    }, 2000)

    setTimeout(() => {
      showSplash.value = false
      sessionStorage.setItem('splashShown', 'true')
      emit('finished')
    }, 4000)
  }
})
</script>

<style scoped>
/* Define a custom slower spin animation */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: scale(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

/* Animated gradient background */
.animated-gradient {
  background: linear-gradient(-45deg, var(--primary),#646262, #621E06);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
