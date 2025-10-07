<template>
  <div class="title">
    <div class="text1">{{ main }}</div>
    <div class="text2">{{ subtitle }}</div>
  </div>
</template>

<script setup>
defineProps({
  main: String,
  subtitle: String,
});
</script>

<style scoped>
.title {
  max-width: 600px;
  gap: 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text1 {
  font-family: Rockwell;
  font-weight: 700;
  font-size: 40px;
  line-height: 125%;
  color: white;
  text-align: center;
}

.text2 {
  font-family: Georgia;
  font-weight: 400;
  font-size: 22px;
  line-height: 125%;
  color: white;
  text-align: center;
}

@media (max-width: 1299px) {
  .text1 {
    font-size: 32px;
  }
  .text2 {
    font-size: 16px;
  }
}
</style>