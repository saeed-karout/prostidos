<template>
  <section class="relative min-h-screen px-4 py-28 bg-[#0d1438] overflow-hidden">
    <div v-if="isLoading" class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>

    <div v-else>
      <h2 class="uppercase text-3xl sm:text-5xl lg:text-8xl text-white font-bold mb-12 sm:mb-16 text-center">
        Projects
      </h2>

      <div class="w-full max-w-6xl mx-auto flex flex-col gap-16">
        <div v-for="(project, index) in projects" :key="index" class="flex flex-col md:flex-row items-center gap-8">
          <div class="w-full">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="(img, imgIndex) in project.images" :key="imgIndex" class="mb-4">
                <img :src="img.image" :alt="project.title" class="w-full h-auto rounded-lg shadow-lg object-cover" loading="lazy"/>
              </div>
            </div>

            <div class="flex-1 flex flex-col pt-10 gap-4 text-white text-left px-4 md:px-0">
              <h3 class="text-4xl font-bold uppercase">
                {{ project.title }}
              </h3>
              <p class="text-2xl font-light text-pink uppercase">
                {{ project.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);
const isLoading = ref(true); // Add loading state

async function fetchProjects() {
  try {
    const response = await fetch('https://api.plateau.media/api/v1/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '0a8JIwFPYXAMhHgxCX6qTXgoI5w5hwN0GCWDXHSSiIQ'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 200) {
      projects.value = data.data.map(project => ({
        title: project.title,
        description: project.description,
        images: project.images
      }));
    } else {
      console.error("API returned an error:", data); // Log the API error for debugging
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  } finally {
    isLoading.value = false; // Set loading to false regardless of success or failure
  }
}

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.text-pink {
  color: #ff4081;
}
</style>