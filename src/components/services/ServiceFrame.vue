<template>
  <div class="frame1">
    <div class="top" :class="{ 'hidden-content': !isTop }">
      <div class="brand">
        <img :src="service.icon" class="w-[24px] h-[24px]" :alt="$t(service.name)">
        <div class="text-white name">{{ $t(service.name) }}</div>
      </div>
      <div class="data">{{ $t(service.projects) }}</div>
    </div>
    <div class="ruler" :class="{ 'justify-end': isTop, 'last-ruler': isLast && isTop }">
      <div :class="n === activeLine ? 'line-active' : 'line'" v-for="n in service.lineCount" :key="n" :style="{ animationDelay: `${n * 0.1}s` }"></div>
    </div>
    <div class="bottoms" :class="{ 'hidden-content': isTop }">
      <div class="brand">
        <img :src="service.icon" class="w-[24px] h-[24px]" :alt="$t(service.name)">
        <div class="text-white name">{{ $t(service.name) }}</div>
      </div>
      <div class="data">{{ $t(service.projects) }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  service: Object,
  activeLine: Number,
  isTop: Boolean,
  isLast: Boolean,
});
</script>

<style scoped>
.frame1 {
  width: 168px;
  height: 215px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
}

.top, .bottoms {
  width: 106px;
  min-height: 51px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.hidden-content {
  visibility: hidden;
}

.brand {
  width: 156px;
  height: 24px;
  display: flex;
  gap: 8px;
}

.ruler {
  width: 168px;
  height: 68px;
  display: flex;
  gap: 10px;
}

.ruler.justify-end {
  justify-content: flex-end;
}

.ruler.justify-end.last-ruler {
  justify-content: flex-start;
}

.ruler .line {
  width: 2px;
  height: 68px;
  border: 1px solid #DDDDDD66;
  animation: wave 1.5s ease-in-out infinite;
}

.ruler .line-active {
  width: 2px;
  height: 68px;
  border: 1px solid #E9480E;
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

.name {
  color: white;
  font-family: Rockwell;
  font-size: 16px;
  font-weight: 700;
}

.data {
  color: white;
  font-family: Georgia;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
}

[dir="rtl"] .brand {
  flex-direction: row-reverse;
}

[dir="rtl"] .ruler {
  flex-direction: row-reverse;
}

[dir="rtl"] .ruler.justify-end {
  justify-content: flex-start;
}

[dir="rtl"] .ruler.justify-end.last-ruler {
  justify-content: flex-end;
}
</style>