<template class="font-league">
  <div>
    <SplashScreen v-if="showSplash" @finished="handleSplashFinished" />
    <div v-else class="min-h-screen bg-[#100E0E]">
      <Navbar />
      <RouterView />
      <FooterComp />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from './components/master/Navbar-component.vue';
import FooterComp from './components/master/FooterComponent.vue';
import SplashScreen from './components/StartedCom.vue';

// Import CSS
import 'tailwindcss/tailwind.css';
import 'quill/dist/quill.snow.css';
import 'toastr/build/toastr.min.css';

const showSplash = ref(true);

const handleSplashFinished = () => {
  showSplash.value = false;
};
</script>

<style scoped>
.warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.warning-message {
  color: white;
  font-family: 'League', sans-serif;
  font-size: 24px;
  text-align: center;
  background: #1a1616;
  padding: 20px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.min-h-screen {
  min-height: 100vh;
  background: #100E0E;
}

body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>