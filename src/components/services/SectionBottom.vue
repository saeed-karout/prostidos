<template>
  <div class="section-bottom">
    <div class="p">{{ description }}</div>
    <div class="btns">
      <span>{{ buttonText }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  description: String,
  buttonText: String,
});
</script>

<style scoped>
.section-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.p {
  width: 672px;
  color: white;
  text-align: center;
  font-family: Georgia;
  font-size: 16px;
  font-weight: 400;
  line-height: 125%;
}

.btns {
  display: flex;
  padding: 16px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 144px;
  background: #343232;
  color: white;
  font-family: Rockwell;
  font-size: 18px;
  font-weight: 700;
  line-height: 125%;
  transition: background 0.3s ease, color 0.3s ease;
}

.btns:hover {
  background: white;
  color: #343232;
  cursor: pointer;
}

@media (max-width: 1299px) {
  .p {
    width: 100%;
  }
}
</style>