<template>
  <!-- Case Study Modal -->
  <transition name="fade">
    <div v-if="isCaseStudyModalOpen" class="case-study-modal-overlay" @click.self="closeCaseStudyModal">
      <div class="case-study-modal-content">
        <div class="image-container">
          <div class="navigation-buttons">
            <button class="nav-button prev" @click="prevImage" :disabled="currentImageIndex === 0"
              :class="locale === 'ar' ? 'next' : 'prev'">
              <img src="/icons/arrow-right.svg" :alt="t('visualArchive.prevImage')" />
            </button>

            <div class="image-wrapper">
              <img :src="currentCaseStudyImage" class="case-study-image" :alt="t('visualArchive.imageAlt')" />
              <div class="case-study-image-overlay"></div>
            </div>

            <button class="nav-button next" @click="nextImage"
              :disabled="currentImageIndex === currentContent.images.length - 1"
              :class="locale === 'ar' ? 'prev' : 'next'">
              <img src="/icons/arrow-right.svg" :alt="t('visualArchive.nextImage')" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Desktop Section -->
  <div class="main">
    <div class="top section-top w-[657px] mx-auto flex flex-col items-center justify-center gap-4">
      <div class="title font-['Rockwell'] font-bold text-white text-[40px] leading-[125%]">
        {{ t('visualArchive.title') }}
      </div>
      <div class="subtitle font-['Georgia'] text-white text-[22px] leading-[125%]">
        {{ t('visualArchive.subtitle') }}
      </div>
    </div>

    <div class="contents relative">
      <div class="content w-[90%] h-[500px] flex flex-col md:flex-row">
        <transition name="fade" mode="out-in">
          <div class="section-img left w-full md:w-[435px] h-[499px] flex flex-col gap-6" :key="currentIndex">
            <!-- الصورة - السكرول يعمل هنا -->
            <img 
              :src="currentContent.image" 
              class="h-[500px] w-full md:min-w-[494px] object-cover rounded-[12px] scrollable-element"
              :alt="t('visualArchive.imageAlt')" 
              @wheel="handleImageWheel"
            />
            <div class="description-image w-full h-[20px] flex items-center justify-start gap-4">
              <div class="country font-['Georgia'] italic text-white text-[16px] leading-[110%]">
                {{ currentContent.country }}
              </div>
              <div class="text-white text-[16px]">|</div>
              <div class="Date font-['Georgia'] italic text-white text-[16px] leading-[125%]">
                {{ currentContent.date }}
              </div>
            </div>
          </div>
        </transition>

        <div class="right w-full md:w-[705px] h-[494px] flex flex-col gap-[30px] relative">
          <!-- العنوان الكبير (Topic) - السكرول يعمل هنا -->
          <transition name="fade" mode="out-in">
            <div
              class="topic font-['Rockwell'] italic text-white text-[224px] leading-[125%] capitalize text-center absolute scrollable-element"
              :class="locale === 'ar' ? '-right-[70px]' : '-left-[70px]'" 
              :key="`${currentContent.topic}-${locale}`"
              @wheel="handleTextWheel"
              ref="textSection">
              {{ currentContent.topic }}
            </div>
          </transition>
          
          <!-- بقية المحتوى - لا يعمل السكرول هنا -->
          <transition name="fade" mode="out-in">
            <div class="works w-full md:w-[441px] h-[176px] flex flex-col gap-4 absolute bottom-0"
              :class="locale === 'ar' ? 'md:left-0' : 'md:right-0'" 
              :key="`${currentContent.titleWork}-${locale}`">
              <div class="title-work font-['Georgia'] italic text-white/80 text-[16px] leading-[1]">
                {{ currentContent.titleWork }}
              </div>
              <div class="description-work font-['Georgia'] text-white text-[18px] leading-[125%]">
                {{ currentContent.descriptionWork }}
              </div>
              <div
                class="btns w-[226px] h-[55px] flex items-center justify-center px-10 py-4 bg-[#343232] rounded-[144px] hover:cursor-pointer hover:bg-[#FFF] duration-150 text-white hover:text-[#2D2B2B]"
                @click="openCaseStudyModal">
                <span class="font-['Rockwell'] font-bold text-[18px] leading-[0.8]">
                  {{ t('visualArchive.viewCaseStudy') }}
                </span>
              </div>
            </div>
          </transition>

          <div class="buttons flex flex-col gap-4 justify-center absolute h-[60%] right-[-90px]">
            <div v-for="(item, index) in contents" :key="index" :class="[
              'w-[3px] h-[67px] cursor-pointer',
              index === currentIndex ? 'bg-[#E9480E]' : 'bg-white/40'
            ]" @click="changeContent(index)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Section -->
  <div :class="mobileMainClasses">
    <div class="top-mobile">
      <div class="title">
        {{ t('visualArchive.title') }}
      </div>
      <div class="subtitle">
        {{ t('visualArchive.subtitle') }}
      </div>
    </div>

    <div class="content-mobile">
      <!-- مؤشرات السحب -->
      <!-- <div class="swipe-indicators">
        <div class="swipe-hint">
          <span>{{ swipeHint }}</span>
          <div class="swipe-arrows">
            <img src="/icons/arrow-right.svg" alt="swipe left" />
            <img src="/icons/arrow-right.svg" alt="swipe right" />
          </div>
        </div>
      </div> -->

      <transition :name="transitionDirection" mode="out-in">
        <div class="contents-mobile" :key="`${currentIndex}-${locale}`">
          <!-- في الجوال السكرول يعمل على الصورة فقط -->
          <div class="frame-img swipe-area" 
               @touchstart="handleTouchStart" 
               @touchmove="handleTouchMove" 
               @touchend="handleTouchEnd">
            <img :src="currentContent.image" class="h-[232px] w-full object-cover rounded-[12px]"
              :alt="t('visualArchive.imageAlt')" />
            <div class="description-image w-full h-[20px] flex items-center justify-start gap-4">
              <div class="country font-['Georgia'] italic text-white text-[16px] leading-[110%]">
                {{ currentContent.country }}
              </div>
              <div class="text-white text-[16px]">|</div>
              <div class="Date font-['Georgia'] italic text-white text-[16px] leading-[125%]">
                {{ currentContent.date }}
              </div>
            </div>
          </div>

          <div class="frame-data">
            <div class="topic-mobile">
              {{ currentContent.topic }}
            </div>

            <div class="frame3">
              <div class="frame">
                <div class="title-work-mobile">
                  {{ currentContent.titleWork }}
                </div>
                <div class="description-work-mobile">
                  {{ currentContent.descriptionWork }}
                </div>
              </div>
            </div>

            <div class="btn-mobile" @click="openCaseStudyModal">
              <span>{{ t('visualArchive.viewCaseStudy') }}</span>
            </div>
          </div>
        </div>
      </transition>

      <div class="buttons-mobile flex flex-row gap-2 justify-center">
        <div v-for="(item, index) in contents" :key="index" :class="[
          'w-[67px] h-[3px] cursor-pointer transition-all duration-300',
          index === currentIndex ? 'bg-[#E9480E] scale-110' : 'bg-white/40'
        ]" @click="changeContent(index)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();

const currentIndex = ref(0);
const isCaseStudyModalOpen = ref(false);
const currentImageIndex = ref(0);

// بيانات اللمس للجوال - المحور X
const touchStartX = ref(0);
const touchEndX = ref(0);

// اتجاه الانتقال للرسوم المتحركة
const transitionDirection = ref('slide-left');

// تتبع إذا كان المستخدم قد استخدم السحب
const hasSwiped = ref(false);

// البيانات الديناميكية التي تتغير مع اللغة
const contents = computed(() => {
  if (locale.value === 'ar') {
    return [
      {
        image: "/images/1.jpg",
        country: t('visualArchive.contents[0].country'),
        date: "٣٠ ديسمبر ٢٠٢٥",
        topic: t('visualArchive.contents[0].topic'),
        titleWork: t('visualArchive.contents[0].titleWork'),
        descriptionWork: t('visualArchive.contents[0].descriptionWork'),
        images: ["/images/Gallery/project1/1.jpg", "/images/Gallery/project1/2.jpg", "/images/Gallery/project1/3.jpg", "/images/Gallery/project1/4.jpg"],
      },
      {
        image: "/images/Gallery/project2/3.jpg",
        country: t('visualArchive.contents[1].country'),
        date: "٣٠ ديسمبر ٢٠٢٥",
        topic: t('visualArchive.contents[1].topic'),
        titleWork: t('visualArchive.contents[1].titleWork'),
        descriptionWork: t('visualArchive.contents[1].descriptionWork'),
        images: ["/images/Gallery/project2/1.jpg", "/images/Gallery/project2/2.jpg", "/images/Gallery/project2/3.jpg", "/images/Gallery/project2/4.jpg"],
      },
    ];
  } else {
    return [
      {
        image: "/images/1.jpg",
        country: t('visualArchive.contents[0].country'),
        date: "Dec 30, 2025",
        topic: t('visualArchive.contents[0].topic'),
        titleWork: t('visualArchive.contents[0].titleWork'),
        descriptionWork: t('visualArchive.contents[0].descriptionWork'),
        images: ["/images/Gallery/project1/1.jpg", "/images/Gallery/project1/2.jpg", "/images/Gallery/project1/3.jpg", "/images/Gallery/project1/4.jpg"],
      },
      {
        image: "/images/Gallery/project2/3.jpg",
        country: t('visualArchive.contents[1].country'),
        date: "Dec 30, 2025",
        topic: t('visualArchive.contents[1].topic'),
        titleWork: t('visualArchive.contents[1].titleWork'),
        descriptionWork: t('visualArchive.contents[1].descriptionWork'),
        images: ["/images/Gallery/project2/1.jpg", "/images/Gallery/project2/2.jpg", "/images/Gallery/project2/3.jpg", "/images/Gallery/project2/4.jpg"],
      }
    ];
  }
});

const currentContent = computed(() => contents.value[currentIndex.value]);
const currentCaseStudyImage = computed(() => currentContent.value.images[currentImageIndex.value]);

// // مؤشر السحب
// const swipeHint = computed(() => {
//   return locale.value === 'ar' ? 'اسحب لليسار أو اليمين للتنقل' : 'Swipe left or right to navigate';
// });

// classes للجوال
const mobileMainClasses = computed(() => {
  return {
    'main-mobile': true,
    'flex': true,
    'md:hidden': true,
    'swipe-used': hasSwiped.value
  };
});

function changeContent(index) {
  // تحديد اتجاه الانتقال
  transitionDirection.value = index > currentIndex.value ? 'slide-left' : 'slide-right';
  
  currentIndex.value = index;
  currentImageIndex.value = 0;
}

function openCaseStudyModal() {
  isCaseStudyModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeCaseStudyModal() {
  isCaseStudyModalOpen.value = false;
  currentImageIndex.value = 0;
  document.body.style.overflow = '';
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}

function nextImage() {
  if (currentImageIndex.value < currentContent.value.images.length - 1) {
    currentImageIndex.value++;
  }
}

// السكرول على الصورة فقط
function handleImageWheel(event) {
  if (!isCaseStudyModalOpen.value) {
    event.preventDefault();
    event.stopPropagation();
    
    const delta = event.deltaY;
    if (delta > 0 && currentIndex.value < contents.value.length - 1) {
      changeContent(currentIndex.value + 1);
    } else if (delta < 0 && currentIndex.value > 0) {
      changeContent(currentIndex.value - 1);
    }
  }
}

// السكرول على العنوان الكبير (Topic) فقط
function handleTextWheel(event) {
  if (!isCaseStudyModalOpen.value) {
    event.preventDefault();
    event.stopPropagation();
    
    const delta = event.deltaY;
    if (delta > 0 && currentIndex.value < contents.value.length - 1) {
      changeContent(currentIndex.value + 1);
    } else if (delta < 0 && currentIndex.value > 0) {
      changeContent(currentIndex.value - 1);
    }
  }
}

// معالجة اللمس للجوال (على الصورة فقط) - المحور X
function handleTouchStart(event) {
  touchStartX.value = event.touches[0].clientX;
  touchEndX.value = event.touches[0].clientX;
}

function handleTouchMove(event) {
  touchEndX.value = event.touches[0].clientX;
}

function handleTouchEnd() {
  const touchDiff = touchStartX.value - touchEndX.value;
  const minSwipeDistance = 50;
  
  if (Math.abs(touchDiff) > minSwipeDistance) {
    // swipe left (انتقال إلى العنصر التالي)
    if (touchDiff > minSwipeDistance && currentIndex.value < contents.value.length - 1) {
      changeContent(currentIndex.value + 1);
      hasSwiped.value = true;
    } 
    // swipe right (انتقال إلى العنصر السابق)
    else if (touchDiff < -minSwipeDistance && currentIndex.value > 0) {
      changeContent(currentIndex.value - 1);
      hasSwiped.value = true;
    }
  }
}

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* مؤشر السكرول للعناصر القابلة للسكرول فقط */
.scrollable-element {
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.scrollable-element:hover {
  transform: scale(1.02);
}

.scrollable-element::after {
  content: "↕";
  position: absolute;
  top: 20px;
  right: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.scrollable-element:hover::after {
  opacity: 1;
}

[dir="rtl"] .scrollable-element::after {
  right: auto;
  left: 20px;
}

/* تحسينات خاصة للصورة */
.section-img img.scrollable-element {
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.section-img img.scrollable-element:hover {
  border-color: rgba(233, 72, 14, 0.5);
}

/* تحسينات خاصة للعنوان الكبير */
.topic.scrollable-element {
  cursor: pointer;
  transition: all 0.3s ease;
}

.topic.scrollable-element:hover {
  text-shadow: 0 0 20px rgba(233, 72, 14, 0.3);
}

.topic.scrollable-element::after {
  top: 50%;
  transform: translateY(-50%);
  right: -60px;
}

[dir="rtl"] .topic.scrollable-element::after {
  right: auto;
  left: -60px;
}

/* رسوم متحركة للسحب الأفقي */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* منطقة السحب */
.swipe-area {
  position: relative;
  cursor: grab;
  user-select: none;
  touch-action: pan-x;
}

.swipe-area:active {
  cursor: grabbing;
}

/* مؤشرات السحب */
.swipe-indicators {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  transition: opacity 0.5s ease;
}

.swipe-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-family: Georgia;
  font-size: 14px;
  animation: pulse 2s infinite;
}

.swipe-arrows {
  display: flex;
  gap: 20px;
}

.swipe-arrows img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

[dir="rtl"] .swipe-arrows img:first-child {
  transform: rotate(180deg);
}

[dir="rtl"] .swipe-arrows img:last-child {
  transform: rotate(180deg);
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* إخفاء مؤشرات السحب بعد الاستخدام */
.main-mobile.swipe-used .swipe-indicators {
  opacity: 0;
  pointer-events: none;
}

/* تحسينات للأزرار */
.buttons-mobile div {
  transition: all 0.3s ease;
}

.buttons-mobile div.bg-\[\#E9480E\] {
  transform: scale(1.1);
}

/* إخفاء المؤشر في الجوال */
@media (max-width: 768px) {
  .scrollable-element::after {
    display: none;
  }
}

/* بقية الستايلز كما هي */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.main {
  display: flex;
  width: 100%;
  padding: 80px 64px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 64px;
  background: #100E0E;
}

.contents {
  display: flex;
  align-items: center;
  gap: 88px;
}

/* Case Study Modal styles */
.case-study-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.case-study-modal-content {
  display: flex;
  width: 90vw;
  max-width: 920px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 64px;
  background: linear-gradient(to bottom right,
      rgba(233, 72, 14, 0.4) 0%,
      rgba(16, 14, 14, 0.4) 80%) bottom right / 50% 50% no-repeat,
    linear-gradient(to bottom left, rgba(233, 72, 14, 0.4) 0%, rgba(16, 14, 14, 0.4) 80%) bottom left / 50% 50% no-repeat,
    linear-gradient(to top left, rgba(233, 72, 14, 0.4) 0%, rgba(16, 14, 14, 0.4) 80%) top left / 50% 50% no-repeat,
    linear-gradient(to top right, rgba(233, 72, 14, 0.4) 0%, rgba(16, 14, 14, 0.4) 80%) top right / 50% 50% no-repeat,
    #100E0E;
  position: relative;
  padding: 0 32px;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
}

.case-study-image {
  width: 80vw;
  max-width: 680px;
  height: 60vh;
  max-height: 455px;
  object-fit: cover;
  position: relative;
}

.case-study-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background: #E9480E;
  opacity: 15%;
  width: 100%;
  height: 100%;
  z-index: 9;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 0 50px;
}

.nav-button {
  color: #FFF;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  transition: background 0.3s ease;
  z-index: 10;
}

.nav-button:disabled {
  color: #E9480E;
  cursor: not-allowed;
  opacity: 0.5;
}

.prev {
  order: -1;
}

.next {
  order: 1;
}

.prev img {
  transform: rotate(180deg);
}

[dir="rtl"] .prev img {
  transform: rotate(0deg);
}

[dir="rtl"] .next img {
  transform: rotate(180deg);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main {
    padding: 64px 16px;
    gap: 40px;
  }

  .top {
    width: 100%;
    gap: 16px;
  }

  .top .title {
    font-size: 32px;
  }

  .top .subtitle {
    font-size: 16px;
    text-align: center;
  }

  .contents {
    height: auto;
    flex-direction: column;
    gap: 40px;
  }

  .content {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
    height: auto;
  }

  .section-img {
    gap: 24px;
  }

  .section-img img {
    height: 232px;
    min-width: 100%;
  }

  .description-image {
    gap: 16px;
  }

  .description-image > div {
    font-size: 16px;
  }

  .right {
    height: auto;
  }

  .topic {
    font-size: 64px;
    left: 0 !important;
    right: 0 !important;
    text-align: center;
    top: -20px;
  }

  .works {
    width: 100%;
    position: relative;
    top: auto;
    right: auto !important;
    left: auto !important;
    align-items: flex-start;
  }

  .title-work {
    font-size: 16px;
  }

  .description-work {
    font-size: 16px;
  }

  .btns {
    width: 100%;
    max-width: 226px;
    padding: 14px 40px;
  }

  .buttons {
    right: 0 !important;
    left: 0 !important;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    height: auto;
    top: 250px;
  }

  .buttons > div {
    width: 67px;
    height: 3px;
  }

  .case-study-modal-content {
    width: 95vw;
    padding: 0 16px;
  }

  .case-study-image {
    width: 90vw;
    height: 50vh;
  }

  .navigation-buttons {
    padding: 20px;
    gap: 8px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

/* Mobile Section styles */
.main-mobile {
  display: flex;
  padding: 64px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  align-self: stretch;
  background: #100E0E;
  min-height: 100vh;
}

.top-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.top-mobile .title {
  color: #FFF;
  font-family: Rockwell;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  text-align: center;
}

.top-mobile .subtitle {
  color: #FFF;
  font-family: Georgia;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  text-align: center;
  align-self: stretch;
}

.content-mobile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
}

.contents-mobile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}

.contents-mobile .frame-img {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.contents-mobile .frame-img img {
  height: 232px;
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.description-image {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
}

.description-image .country,
.description-image .Date {
  font-family: Georgia;
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  color: #FFF;
}

.description-image .country {
  line-height: 110%;
}

.description-image .Date {
  line-height: 125%;
}

.frame-data {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}

.topic-mobile {
  color: #FFF;
  font-family: Rockwell;
  font-size: 64px;
  font-style: italic;
  font-weight: 400;
  line-height: 125%;
  text-transform: capitalize;
  align-self: stretch;
  text-align: center;
}

.frame3 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
}

.frame3 .frame {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
}

.title-work-mobile {
  color: rgba(255, 255, 255, 0.80);
  font-family: Georgia;
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 125%;
}

.description-work-mobile {
  color: #FFF;
  font-family: Georgia;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.btn-mobile {
  display: flex;
  padding: 14px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 144px;
  background: #343232;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.btn-mobile:hover {
  background: #FFF;
  color: #2D2B2B;
}

.btn-mobile span {
  color: #FFF;
  font-family: Rockwell;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
}

.buttons-mobile {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.buttons-mobile div {
  width: 67px;
  height: 3px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.buttons-mobile div.bg-white\/40 {
  background: rgba(255, 255, 255, 0.4);
}

/* Responsive Visibility */
@media (max-width: 1299px) {
  .main {
    display: none;
  }
  .main-mobile {
    display: flex;
  }
}

@media (min-width: 1300px) {
  .main-mobile {
    display: none;
  }
  .main {
    display: flex;
  }
}
</style>