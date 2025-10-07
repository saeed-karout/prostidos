<template>
  <!-- Desktop Section -->
  <div class="main bg-cover bg-center bg-[#100E0E] h-[100vh] flex flex-col items-center justify-center gap-16" id="services">
    <SectionTitle :main="$t('services.title.main')" :subtitle="$t('services.title.subtitle')" />

    <div class="map overflow-auto" v-if="services.length">
      <ServiceFrame
        v-for="(service, index) in services"
        :key="index"
        :service="service"
        :active-line="service.activeLine"
        :is-top="index % 2 === 0"
        :is-last="index === services.length - 1"
      />
    </div>
    <div class="map" v-else>
      <p>Loading services...</p>
    </div>

    <SectionBottom :description="$t('services.description')" :button-text="$t('services.button')" />
  </div>

  <!-- Mobile Section -->
  <div class="main-mobile flex md:hidden overflow-hidden ">
    <SectionTitle :main="$t('services.title.main')" :subtitle="$t('services.title.subtitle')" />

    <div class="content-mobile" v-if="services.length">
      <ServiceFrameMobile
        v-for="(service, index) in services"
        :key="index"
        :service="service"
        :is-right="index % 2 === 0"
         :is-last="index === services.length - 1"
      />
    </div>
    <div class="content-mobile" v-else>
      <p>Loading services...</p>
    </div>

    <SectionBottom :description="$t('services.description')" :button-text="$t('services.button')" />
  </div>
</template>

<script setup>
import SectionTitle from '../services/SectionTitle.vue'; 
import ServiceFrame from '../services/ServiceFrame.vue';;
import ServiceFrameMobile from '../services/ServiceFrameMobile.vue';
import SectionBottom from '../services/SectionBottom.vue';

// تعريف services أولاً
const services = [
  { icon: '/icons/services/pen-tool-2.svg', name: 'services.items[0].name', projects: 'services.items[0].projects', lineCount: 8, activeLine: 1 },
  { icon: '/icons/services/camera.svg', name: 'services.items[1].name', projects: 'services.items[1].projects', lineCount: 15, activeLine: 8 },
  { icon: '/icons/services/video-play.svg', name: 'services.items[2].name', projects: 'services.items[2].projects', lineCount: 15, activeLine: 8 },
  { icon: '/icons/services/shapes.svg', name: 'services.items[3].name', projects: 'services.items[3].projects', lineCount: 15, activeLine: 8 },
  { icon: '/icons/services/lamp-charge.svg', name: 'services.items[4].name', projects: 'services.items[4].projects', lineCount: 15, activeLine: 8 },
  { icon: '/icons/services/cpu-charge.svg', name: 'services.items[5].name', projects: 'services.items[5].projects', lineCount: 15, activeLine: 8 },
  { icon: '/icons/services/prostdios.svg', name: 'services.items[6].name', projects: 'services.items[6].projects', lineCount: 8, activeLine: 8 },
];

// تصحيح أخطاء باستخدام console.log بعد تعريف services
console.log('ServicesSection services:', services);
</script>


<style scoped>

  .main, .main-mobile {
  background: var(--primary-bg);
}

.map {
  width: 90%;
  height: 343px;
  padding: 64px 42px;
  gap: 12px;
  border-radius: 16px;
  background: var(--card-bg);
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 16px;
  background: var(--card-bg);
  padding: 16px;
  width: 100%;
  overflow-x: auto;
}



/* Responsive Visibility */
@media (max-width: 1299px) {
  .main {
    display: none;
  }
  .main-mobile {
    display: flex;
    padding: 64px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    min-height: 100vh;
  }
}

@media (min-width: 1300px) {
  .main-mobile {
    display: none;
  }
  .main {
    display: flex;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
}



</style>