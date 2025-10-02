
<script setup>
import GalleryThree from '@/components/home/GalleryThree.vue';
import GalleryFour from '@/components/home/GalleryFour.vue';
import HeroComponent from '@/components/home/HeroComponent.vue';
import Services from '@/components/home/ServicesSection.vue'; // Verify this file exists
import GalleryTwo from '@/components/home/GalleryTwo.vue'; // Renamed for clarity
import Gallery from '@/components/home/GalleryComponent.vue';
import VisualArchive from '@/components/home/VisualArchive.vue';
import LatestSection from '@/components/home/LatestSection.vue';
import OurServices from '@/components/home/OurServices.vue';
import TestimonialsComponent from '@/components/home/TestimonialsComponent.vue';
</script>

<template>
  <HeroComponent />
  <Services id="services" />
  <OurServices />
  <Gallery id="gallery" />
  <GalleryTwo /> 
  <VisualArchive />
  <GalleryThree />
  <GalleryFour />
  <TestimonialsComponent />
  <LatestSection />
</template>

<style scoped>


@media (max-width: 768px) {
  .services-wrapper {
    display: none;
  }
}
</style>
