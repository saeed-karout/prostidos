<script setup>
import GalleryItem from '@/components/home/GalleryItem.vue';
import HeroComponent from '@/components/home/HeroComponent.vue';
import TimeLineComponent from '@/components/home/TimeLineComponent.vue';

import beachyVideo from '@/assets/new-video/beachy.mp4';
import FinalEditionVideo from '@/assets/new-video/FinalEdition.mp4';
import zarabiVideo from '@/assets/new-video/zarabi.mp4';
import ESTSSVideo from '@/assets/new-video/production-reel.mp4';
import eventFilms from '@/assets/new-video/eventFilms.mp4';
import EventCoverage from '@/assets/new-video/EventCoverage.mp4';
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import ContactForm from '@/components/home/ContactForm.vue';

const { t, locale } = useI18n();
const worksSection = ref(null);
const homePage = ref(null);
const galleryContainer = ref(null);
const isScrollingEnabled = ref(true);
const lastScrollTime = ref(0);

// بيانات الأعمال
const futureWorks = computed(() => [
  {
    videoSrc: ESTSSVideo,
    subtitle: t('featuredWorks.ESTSS.title', 'ESTSS'),
    title: t('featuredWorks.ESTSS.subtitle', 'Company Films'),
    workKey: 'ESTSS',
    buttonText: t('btn-watch', 'Watch Full Session'),
    buttonLink: "https://youtu.be/CAQelKfyiZA?si=HJd3WNhi9XMqxRQ0",
    showDescription: true
  },
  {
    videoSrc: zarabiVideo,
    subtitle: t('featuredWorks.Zarabi.title', 'Zarabi'),
    title: t('featuredWorks.Zarabi.subtitle', 'Commercial Films'),
    workKey: 'Zarabi',
    buttonText: t('btn-watch', 'Watch Full Session'),
    buttonLink: "https://youtu.be/sMEvjaTWyGY?si=AdFL4j2Wu8mBh7vA",
    showDescription: true
  },
  {
    videoSrc: FinalEditionVideo,
    subtitle: t('featuredWorks.FinalEdition.title', 'Final Edition'),
    title: t('featuredWorks.FinalEdition.subtitle', 'Cars Films'),
    workKey: 'FinalEdition',
    buttonText: t('btn-watch', 'Watch Full Session'),
    buttonLink: "https://youtu.be/lNG7WZmmIAM?si=hUpgegkfxf0BwUvf",
    showDescription: true
  },
  {
    videoSrc: beachyVideo,
    subtitle: t('featuredWorks.BeachyRentals.title', 'Beachy Rentals'),
    title: t('featuredWorks.BeachyRentals.subtitle', 'Real Estate Films'),
    workKey: 'BeachyRentals',
    buttonText: t('btn-watch', 'Watch Full Session'),
    buttonLink: "https://drive.google.com/file/d/1mwaNSyN_62Co961e2bwIihLRcrqtsn3g/view",
    showDescription: true
  },
  {
    videoSrc: EventCoverage,
    subtitle: t('featuredWorks.PodcastProduction.title', 'Podcast Production'),
    title: t('featuredWorks.PodcastProduction.subtitle', 'Audio Visual'),
    workKey: 'PodcastProduction',
    buttonText: t('btn-watch', 'Watch Full Session'),
    buttonLink: "https://youtu.be/Y8P7k-B86VI?si=YHL3q-1xLV3xFaOP",
    showDescription: true
  },
  {
    videoSrc: eventFilms,
    subtitle: t('featuredWorks.EventCoverage.title', 'Event Coverage'),
    title: t('featuredWorks.EventCoverage.subtitle', 'Live Events'),
    workKey: 'EventCoverage',
    buttonText: t('btn-watch', 'Watch Full Session'),
    buttonLink: "https://www.youtube.com/watch?v=zYWGjqvC7uc",
    showDescription: true
  }
]);

// عنوان القسم
const sectionTitle = computed(() => t('featuredWorksTitle', 'FEATURED WORKS'));

// إعداد ارتفاع القسم
const calculateSectionHeight = () => {
  const itemCount = futureWorks.value.length;
  // ارتفاع أقل لتسهيل التمرير للخارج
  return `${itemCount * 80}vh`;
};

const sectionHeight = ref(calculateSectionHeight());

// وظائف التمرير المحسنة
const handleWheel = (e) => {
  if (!isScrollingEnabled.value) {
    e.preventDefault();
    return;
  }

  const now = Date.now();
  if (now - lastScrollTime.value < 300) {
    return; // منع التمرير السريع
  }
  lastScrollTime.value = now;

  const deltaY = e.deltaY;
  const scrollThreshold = 50; // الحد الأدنى للتمرير

  if (Math.abs(deltaY) > scrollThreshold) {
    if (deltaY > 0) {
      // تمرير لأسفل
      handleScrollDown();
    } else {
      // تمرير لأعلى
      handleScrollUp();
    }

    // منع السلوك الافتراضي للتمرير
    e.preventDefault();
  }
};

const handleScrollDown = () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const windowHeight = window.innerHeight;
  let currentIndex = -1;

  // العثور على الفيديو الحالي
  for (let i = 0; i < galleryItems.length; i++) {
    const rect = galleryItems[i].getBoundingClientRect();
    if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex >= 0 && currentIndex < galleryItems.length - 1) {
    // التمرير للفيديو التالي
    scrollToVideo(currentIndex + 1);
  } else if (currentIndex === galleryItems.length - 1) {
  // اسمح بالسكرول الطبيعي فوراً بدون تأخير
  isScrollingEnabled.value = true;  // بدل false ثم true بعد 500ms
}
};

const handleScrollUp = () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const windowHeight = window.innerHeight;
  let currentIndex = -1;

  // العثور على الفيديو الحالي
  for (let i = 0; i < galleryItems.length; i++) {
    const rect = galleryItems[i].getBoundingClientRect();
    if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex > 0) {
    // التمرير للفيديو السابق
    scrollToVideo(currentIndex - 1);
  } else if (currentIndex === 0) {
    // إذا كنا في أول فيديو، اسمح بالتمرير للأعلى لرؤية الهيرو
    isScrollingEnabled.value = false;
    setTimeout(() => {
      isScrollingEnabled.value = true;
    }, 500);
  }
};

const scrollToVideo = (index) => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems[index]) {
    isScrollingEnabled.value = false;

    galleryItems[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // إعادة تمكين التمرير بعد اكتمال الحركة
    setTimeout(() => {
      isScrollingEnabled.value = true;
    }, 800);
  }
};

// التحقق من الموقع لإخفاء الفيديوهات
const checkAndHideVideos = () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const worksRect = worksSection.value?.getBoundingClientRect();

  if (!worksRect) return;

  const videoContainers = document.querySelectorAll('.tv-container, .video-container');

  // إذا كنا قبل قسم الفيديوهات (الهيرو)
  if (scrollY < worksRect.top) {
    // إخفاء جميع الفيديوهات
    videoContainers.forEach(container => {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '10';
    });
  }
  // إذا كنا بعد قسم الفيديوهات (التايم لاين)
  else if (scrollY > worksRect.bottom - windowHeight * 2) {
    // إخفاء جميع الفيديوهات
    videoContainers.forEach(container => {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '10';
    });
  }
  // إذا كنا داخل قسم الفيديوهات
  else if (scrollY >= worksRect.top && scrollY <= worksRect.bottom - windowHeight) {
    // إظهار الفيديوهات فقط للعناصر المرئية
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const videoContainer = item.querySelector('.tv-container, .video-container');

      if (videoContainer) {
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
          // الفيديو في المنطقة المرئية
          videoContainer.style.opacity = '';
          videoContainer.style.pointerEvents = '';
          videoContainer.style.zIndex = '';
        } else {
          // الفيديو خارج المنطقة المرئية
          videoContainer.style.opacity = '0';
          videoContainer.style.pointerEvents = 'none';
          videoContainer.style.zIndex = '10';
        }
      }
    });
  }
};

// مستمع التمرير الرئيسي
const handleScroll = () => {
  checkAndHideVideos();
};

// إعدادات أولية
onMounted(() => {
  // إضافة مستمعي الأحداث
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);

  // التأكد من أن الهيرو والتايم لاين مرئيين
  nextTick(() => {
    if (worksSection.value) {
      worksSection.value.style.zIndex = '100';
    }

    // إخفاء الفيديوهات في البداية
    setTimeout(checkAndHideVideos, 100);
  });
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>

<template>
  <div class="home-page" ref="homePage">
    <HeroComponent />

    <!-- قسم Future Works -->
    <section class="future-works-section" id="services" :style="{ minHeight: sectionHeight }" ref="worksSection">
      <!-- عنوان القسم -->
      <div class="section-header">
        <div class="section-decoration">
          <span class="decoration-line"></span>
          <h2 class="section-title">{{ sectionTitle }}</h2>
          <span class="decoration-line"></span>
        </div>
      </div>

      <!-- Gallery Items -->
      <div class="gallery-container" ref="galleryContainer">
        <GalleryItem v-for="(work, index) in futureWorks" :key="`${work.workKey}-${locale}`" :video-src="work.videoSrc"
          :title="work.title" :subtitle="work.subtitle" :work-key="work.workKey" :button-text="work.buttonText"
          :button-link="work.buttonLink" :show-description="work.showDescription" :index="index"
          :is-first-item="index === 0" />
      </div>
    </section>

    <TimeLineComponent />


    <div id="contact" class="p-[20px] md:p-[50px] ">

      <!-- <LatestSection /> -->
  
  
  
      <ContactForm  />
    </div>

  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  overflow-x: hidden;
  background: #100E0E;
  z-index: 1;
}

/* Future Works Section */
.future-works-section {
  position: relative;
  padding:  0 0;
  overflow: visible;
  z-index: 100;
  min-height: auto !important;
  height: auto;
}

.section-header {
  text-align: center;
  padding: 20px 20px;
  position: relative;
  z-index: 200;
  pointer-events: none;
  background: #100E0E;

}

.section-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  pointer-events: none;
}

.decoration-line {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg,
      transparent,
      #E9480E,
      transparent);
}

.section-title {
  color: white;
  font-family: "Bebas Neue", sans-serif;
  font-size: clamp(48px, 6vw, 64px);
  font-weight: 400;
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;
  background: linear-gradient(135deg, #FFF 0%, #E9480E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  pointer-events: none;
}

/* Gallery Container */
.gallery-container {
  position: relative;
  width: 100%;
  overflow: visible;
  z-index: 150;
  scroll-snap-type: y proximity;
}

/* إصلاحات للمحتوى الآخر */
.home-page>*:not(.future-works-section) {
  position: relative !important;
  z-index: 300 !important;
  background: #100E0E;
}

/* تحسينات للهواتف */
@media (max-width: 768px) {
  .future-works-section {
    padding: 0px 0 0;
  }

  .section-header {
    margin-bottom: 40px;
    padding-top: 40px;
  }

  .decoration-line {
    width: 60px;
  }

  .section-title {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 28px;
  }

  .decoration-line {
    width: 40px;
  }
}

/* تحسينات للأداء */
@media (prefers-reduced-motion: reduce) {
  .future-works-section {
    scroll-behavior: auto;
  }
}
</style>