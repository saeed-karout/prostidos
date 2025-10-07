<template>
  <div class="frame1" :class="{ 'last-frame': isLast }">
    <!-- القسم الأيسر (يحتفظ بالمساحة دائمًا) -->
    <div class="left">
      <div class="brand" :class="{ 'hidden-content': !isRight }">
        <img :src="service.icon" class="icon" :alt="$t(service.name)">
        <div class="text-white name">{{ $t(service.name) }}</div>
      </div>
      <div class="data" :class="{ 'hidden-content': !isRight }">{{ $t(service.projects) }}</div>
    </div>
    <!-- القسم الوسطي (الخطوط الأفقية) -->
    <div class="middle">
      <div class="disable" v-for="n in disableCount" :key="'disable-' + n"></div>
      <div :class="n === service.activeLine ? 'line-active' : 'line'" v-for="n in service.lineCount" :key="'line-' + n" :style="{ animationDelay: `${n * 0.1}s` }"></div>
    </div>
    <!-- القسم الأيمن (يحتفظ بالمساحة دائمًا) -->
    <div class="right">
      <div class="brand" :class="{ 'hidden-content': isRight }">
        <img :src="service.icon" class="icon" :alt="$t(service.name)">
        <div class="text-white name">{{ $t(service.name) }}</div>
      </div>
      <div class="data" :class="{ 'hidden-content': isRight }">{{ $t(service.projects) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// تعريف الـ props بشكل صريح
const props = defineProps({
  service: Object,
  isRight: Boolean,
  isLast: Boolean, // إضافة isLast لمعالجة آخر frame
});

// حساب عدد الخطوط المعطلة لتحقيق التناسق
const disableCount = computed(() => {
  if (!props.service || !props.service.lineCount) return 0;
  const maxLines = props.isLast ? 8 : 11; // تقليل عدد الخطوط لآخر frame إذا لزم الأمر
  return Math.max(maxLines - props.service.lineCount, 0);
});

// سجل للتحقق من تمرير props
console.log('ServiceFrameMobile props:', props.service, 'isLast:', props.isLast);
</script>

<style scoped>
.frame1 {
  width: 100%;
  max-width: 360px; /* عرض ثابت لضمان التناسق */
  
  display: flex;
  flex-direction: row; /* تخطيط أفقي */
  align-items: center;
  justify-content: center; /* محاذاة مركزية للعناصر */
  gap: 10px; /* مسافة متناسقة بين العناصر */
}

.left, .right {
  width: 120px; /* عرض ثابت للحفاظ على المساحة */
  min-height: 51px; /* ارتفاع ثابت للحفاظ على التخطيط */
  display: flex;
  flex-direction: column;
  align-items: center; /* محاذاة مركزية */
  justify-content: center;
  gap: 6px; /* مسافة بين الاسم والبيانات */
}

.hidden-content {
  visibility: hidden; /* إخفاء المحتوى مع الاحتفاظ بالمساحة */
}

.brand {
  width: 100%;
  height: 20px; /* ارتفاع أصغر للتناسق */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px; /* مسافة بين الأيقونة والنص */
}

.icon {
  width: 18px; /* تصغير الأيقونة لتناسب الموبايل */
  height: 18px;
}

.name {
  color: white;
  font-family: Rockwell;
  font-size: 13px; /* حجم نص أصغر للتناسق */
  font-weight: 700;
}

.data {
  color: white;
  font-family: Georgia;
  font-size: 12px; /* حجم نص أصغر للتناسق */
  font-weight: 400;
  text-align: center;
}

.middle {
  width: 24px; /* عرض ثابت للخطوط */
  height: auto;
  display: flex;
  flex-direction: column; /* خطوط أفقية */
  gap: 10px; /* مسافة بين الخطوط */
  justify-content: center;
  align-items: center;
}

.middle .disable {
  width: 24px; /* عرض موحد مع الخطوط النشطة */
  height: 1px;
  background: #151212; /* لون الخطوط المعطلة */
}

.middle .line, .middle .line-active {
  width: 24px; /* عرض متسق */
  height: 1px;
  background: rgba(221, 221, 221, 0.4); /* شفافية خفيفة */
  animation: wave-mobile 1.2s ease-in-out infinite; /* أنيميشن أسرع */
}

.middle .line-active {
  height: 2px; /* خط نشط أكثر سماكة */
  background: #E9480E;
}

@keyframes wave-mobile {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(2); /* أنيميشن متسق */
  }
}

[dir="rtl"] .frame1 {
  flex-direction: row-reverse; /* عكس التخطيط في RTL */
}

[dir="rtl"] .brand {
  flex-direction: row-reverse; /* عكس ترتيب الأيقونة والنص */
}

[dir="rtl"] .middle {
  flex-direction: column-reverse; /* عكس ترتيب الخطوط في RTL */
}

/* أنماط إضافية لآخر frame إذا لزم الأمر */
.last-frame .middle {
  justify-content: center; /* ضمان محاذاة مركزية للخطوط */
}
</style>