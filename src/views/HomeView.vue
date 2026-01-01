<template>
  <div class="home-page">
    <!-- Hero Section -->
    <HeroComponent class="section-layer" />

    <!-- Featured Works Section -->
    <section class="featured-works section-layer" id="works">
      <div class="section-title">
        <h2>{{ sectionTitle }}</h2>
      </div>

      <div class="gallery">
        <GalleryItem
          v-for="(work, index) in works"
          :key="`${work.workKey}-${locale}`"
          :video-src="work.videoSrc"
          :title="work.title"
          :subtitle="work.subtitle"
          :work-key="work.workKey"
          :button-link="work.buttonLink"
          :show-description="true"
          :index="index"
          :is-first-item="index === 0"
        />
      </div>
    </section>

    <!-- Timeline & Contact -->
    <TimeLineComponent class="section-layer" />
    
    <div id="contact" class="section-layer p-[20px] md:p-[50px]">
      <ContactForm />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import GalleryItem from '@/components/home/GalleryItem.vue';
import HeroComponent from '@/components/home/HeroComponent.vue';
import TimeLineComponent from '@/components/home/TimeLineComponent.vue';
import ContactForm from '@/components/home/ContactForm.vue';

// استيراد الفيديوهات
import ESTSSVideo from '@/assets/new-video/production-reel.mp4';
import zarabiVideo from '@/assets/new-video/zarabi.mp4';
import FinalEditionVideo from '@/assets/new-video/FinalEdition.mp4';
import beachyVideo from '@/assets/new-video/beachy.mp4';
import EventCoverage from '@/assets/new-video/EventCoverage.mp4';
import eventFilms from '@/assets/new-video/eventFilms.mp4';

const { t, locale } = useI18n();

const sectionTitle = computed(() => t('featuredWorksTitle', 'FEATURED WORKS'));

const works = computed(() => [
  {
    videoSrc: ESTSSVideo,
    title: t('featuredWorks.ESTSS.subtitle', 'Company Films'),
    subtitle: t('featuredWorks.ESTSS.title', 'ESTSS'),
    workKey: 'ESTSS',
    buttonLink: "https://youtu.be/CAQelKfyiZA"
  },
  {
    videoSrc: zarabiVideo,
    title: t('featuredWorks.Zarabi.subtitle', 'Commercial Films'),
    subtitle: t('featuredWorks.Zarabi.title', 'Zarabi'),
    workKey: 'Zarabi',
    buttonLink: "https://youtu.be/sMEvjaTWyGY"
  },
  {
    videoSrc: FinalEditionVideo,
    title: t('featuredWorks.FinalEdition.subtitle', 'Cars Films'),
    subtitle: t('featuredWorks.FinalEdition.title', 'Final Edition'),
    workKey: 'FinalEdition',
    buttonLink: "https://youtu.be/lNG7WZmmIAM"
  },
  {
    videoSrc: beachyVideo,
    title: t('featuredWorks.BeachyRentals.subtitle', 'Real Estate Films'),
    subtitle: t('featuredWorks.BeachyRentals.title', 'Beachy Rentals'),
    workKey: 'BeachyRentals',
    buttonLink: "https://drive.google.com/file/d/1mwaNSyN_62Co961e2bwIihLRcrqtsn3g/view"
  },
  {
    videoSrc: EventCoverage,
    title: t('featuredWorks.PodcastProduction.subtitle', 'Audio Visual'),
    subtitle: t('featuredWorks.PodcastProduction.title', 'Podcast Production'),
    workKey: 'PodcastProduction',
    buttonLink: "https://youtu.be/Y8P7k-B86VI"
  },
  {
    videoSrc: eventFilms,
    title: t('featuredWorks.EventCoverage.subtitle', 'Live Events'),
    subtitle: t('featuredWorks.EventCoverage.title', 'Event Coverage'),
    workKey: 'EventCoverage',
    buttonLink: "https://www.youtube.com/watch?v=zYWGjqvC7uc"
  }
]);

// لا نحتاج useCinematicScroll هنا لأن كل GalleryItem يتحكم بنفسه
// المنطق موجود داخل GalleryItem.vue (كما في النسخة السابقة المحسّنة)
</script>

<style scoped>
.home-page {
  background: #000;
  overflow-x: hidden;
  min-height: 100vh;
}

/* جميع الأقسام فوق التلفازات */
.section-layer {
  position: relative;
  z-index: 100; /* أعلى من التلفازات (z-index 9999 فقط في fullscreen) */
}

/* قسم الأعمال */
.featured-works {
  position: relative;
  z-index: 10;
  padding-top: 60px;
  padding-bottom: 100px;
}

.gallery {
  position: relative;
  z-index: 1;
  scroll-snap-type: y mandatory;
}

/* عنوان القسم */
.section-title {
  text-align: center;
  padding: 80px 20px 60px;
  pointer-events: none;
}

.section-title h2 {
  font-family: "Bebas Neue", sans-serif;
  font-size: clamp(60px, 8vw, 100px);
  font-weight: 400;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff, #E9480E);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* تحسينات للموبايل */
@media (max-width: 768px) {
  .section-title {
    padding: 60px 20px 40px;
  }
  
  .featured-works {
    padding-bottom: 60px;
  }
}

/* إخفاء أي تلفاز يخرج عن القسم (حماية إضافية) */
.gallery ~ * .tv-container,
.home-page > *:not(.featured-works) .tv-container {
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
}
</style>