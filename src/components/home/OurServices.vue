<template>
    <div class="main-our-services">
        <div class="left">
            <div class="title">{{ t('OurServices.title') }}</div>
            <div class="span">
                {{ t('OurServices.span_title') }}</div>
        </div>

        <div class="right" @wheel="handleWheel" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
            @touchend="handleTouchEnd">
            <div class="services-container">
                <div v-for="(service, index) in visibleServices" :key="service.id" class="service-item"
                    :class="getServiceClass(index)" @click="scrollToIndex(currentStartIndex + index)">
                    {{ service.title }}<span> {{ service.span }}</span>
                </div>
            </div>

            <!-- مؤشرات التنقل
            <div class="navigation-indicators">
                <button class="nav-btn prev" @click="scrollToPrev" aria-label="Previous service">
                    ↑
                </button>
                <div class="dots">
                    <span 
                        v-for="i in allServices.length" 
                        :key="i"
                        class="dot"
                        :class="{ active: (currentStartIndex + 1) % allServices.length === i }"
                        @click="scrollToIndex(i - 1)"
                    ></span>
                </div>
                <button class="nav-btn next" @click="scrollToNext" aria-label="Next service">
                    ↓
                </button>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { t, locale } = useI18n();
const currentStartIndex = ref(0);
const isScrolling = ref(false);

// بيانات اللمس
const touchStartY = ref(0);
const touchEndY = ref(0);

// الحصول على جميع الخدمات من الترجمة مع دعم اللغتين
const allServices = computed(() => {
    const services = t('OurServices.service');

    // إذا كانت services نص وليست array، نستخدم البيانات الافتراضية بناءً على اللغة
    if (typeof services === 'string') {
        if (locale.value === 'ar') {
            return [
                {
                    id: "1",
                    title: "حلول تسويقية ",
                    span: "مدعومة بالذكاء الاصطناعي"
                },
                {
                    id: "2",
                    title: "استراتيجية ",
                    span: "المنتج والسوق"
                },
                {
                    id: "3",
                    title: "إنشاء ",
                    span: "الهوية التجارية"
                },
                {
                    id: "4",
                    title: "تصميم ",
                    span: "محتوى إبداعي"
                },
                {
                    id: "5",
                    title: "إنتاج ",
                    span: "صور فوتوغرافية"
                },
                {
                    id: "6",
                    title: "إنتاج ",
                    span: "فيديو"
                },
                {
                    id: "7",
                    title: "صناعة ",
                    span: "أفلام سينمائية"
                },
                {
                    id: "8",
                    title: "إدارة ",
                    span: "وسائل التواصل"
                },
                {
                    id: "9",
                    title: "إعلانات ",
                    span: "وسائل التواصل"
                },
                {
                    id: "10",
                    title: "بناء ",
                    span: "مواقع وتطبيقات ذكية"
                },
                {
                    id: "11",
                    title: "استهداف ",
                    span: "عملاء بالذكاء الاصطناعي"
                }
            ];
        } else {
            return [
                { id: "1", title: "AI-Driven ", span: "Marketing Solutions" },
                { id: "2", title: "Product ", span: "& Market Strategy" },
                { id: "3", title: "Brand ", span: "Creation" },
                { id: "4", title: "creative  ", span: "content design " },
                { id: "5", title: "Photography  ", span: "Production" },
                { id: "6", title: "Video  ", span: "Production" },
                { id: "7", title: "Cinematic  ", span: "Filmmaking" },
                { id: "8", title: "Social  ", span: "Management" },
                { id: "9", title: "Social  ", span: "ADS" },
                { id: "10", title: "Smart Web ", span: "& App Builders" },
                { id: "11", title: "AI-Driven  ", span: "Lead Targeting" },

            ];
        }
    }
    return services;
});

// الخدمات المرئية حالياً (3 خدمات فقط)
const visibleServices = computed(() => {
    if (!allServices.value || allServices.value.length === 0) {
        return [];
    }

    const services = [];
    for (let i = 0; i < 3; i++) {
        const index = (currentStartIndex.value + i) % allServices.value.length;
        services.push(allServices.value[index]);
    }
    return services;
});

const getServiceClass = (index) => {
    return {
        'text-back': index === 0,
        'show-text-center': index === 1,
        'text-next': index === 2,
        'active': index === 1 // العنصر الأوسط فقط هو النشط
    };
};

const scrollToIndex = (targetIndex) => {
    if (isScrolling.value || !allServices.value) return;

    isScrolling.value = true;
    currentStartIndex.value = (targetIndex - 1 + allServices.value.length) % allServices.value.length;

    setTimeout(() => {
        isScrolling.value = false;
    }, 600);
};

const scrollToNext = () => {
    if (isScrolling.value || !allServices.value) return;

    isScrolling.value = true;
    currentStartIndex.value = (currentStartIndex.value + 1) % allServices.value.length;

    setTimeout(() => {
        isScrolling.value = false;
    }, 600);
};

const scrollToPrev = () => {
    if (isScrolling.value || !allServices.value) return;

    isScrolling.value = true;
    currentStartIndex.value = (currentStartIndex.value - 1 + allServices.value.length) % allServices.value.length;

    setTimeout(() => {
        isScrolling.value = false;
    }, 600);
};

const handleWheel = (event) => {
    if (isScrolling.value) return;

    event.preventDefault();

    if (event.deltaY > 0) {
        scrollToNext();
    } else {
        scrollToPrev();
    }
};

// معالجة اللمس لأجهزة الموبايل
const handleTouchStart = (event) => {
    touchStartY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
    if (isScrolling.value) return;
    touchEndY.value = event.touches[0].clientY;
};

const handleTouchEnd = () => {
    if (isScrolling.value) return;

    const touchDiff = touchStartY.value - touchEndY.value;
    const minSwipeDistance = 50; // الحد الأدنى للمسافة للسكرول

    if (Math.abs(touchDiff) > minSwipeDistance) {
        if (touchDiff > 0) {
            // سحب لأعلى - التالي
            scrollToNext();
        } else {
            // سحب لأسفل - السابق
            scrollToPrev();
        }
    }
};

const handleKeydown = (event) => {
    if (isScrolling.value) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        scrollToNext();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollToPrev();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.main-our-services {
    display: flex;
    padding: 56px 64px;
    justify-content: center;
    align-items: center;
    gap: 80px;
    align-self: stretch;
    background: #151212;
}

.left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
}

.left .title {
    color: #FFF;
    font-family: Rockwell;
    font-size: 64px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
}

.left .span {
    color: #FFF;
    font-family: Georgia;
    font-size: 56px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    text-transform: capitalize;
}

.right {
    width: 658px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    /* overflow: hidden; */
    cursor: pointer;
}

.services-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 50px;
    width: 100%;
    height: 80%;
    position: relative;
    flex-grow: 1;
}

.service-item {
    cursor: pointer;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: absolute;
    width: 100%;
    text-transform: uppercase;
    font-family: Rockwell;
    font-style: normal;
    line-height: normal;
    white-space: nowrap;
    user-select: none;
}

/* العنصر العلوي (text-back) */
.text-back {
    color: #FFF;
    font-family: Rockwell;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    top: 40px;
    opacity: 0.6;
    transform: translateY(-20px) scale(0.9);
    filter: blur(4px);
}

.text-back span {
    color: #FFF;
    font-family: Rockwell;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: uppercase;
}

/* العنصر الأوسط النشط (show-text-center) */
.show-text-center {
    color: #FFF;
    font-size: 32px;
    font-weight: 400;
    top: 50%;
    transform: translateY(-50%) scale(1);
    opacity: 1;
    filter: blur(0px);
}

.show-text-center.active {
    font-size: 40px;
}

.show-text-center span {
    color: #FFF;
    font-size: 32px;
    font-weight: 700;
}

.show-text-center.active span {
    font-size: 40px;
}

/* العنصر السفلي (text-next) */
.text-next {
    color: #FFF;
    font-family: Rockwell;
    font-size: 40px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    bottom: 40px;
    opacity: 0.6;
    transform: translateY(20px) scale(0.9);
    filter: blur(4px);
}

.text-next span {
    color: #FFF;
    font-family: Rockwell;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: uppercase;
}

/* تأثيرات Hover */
.service-item:hover {
    opacity: 0.6;
    filter: blur(2px);
}

.show-text-center:hover {
    opacity: 1;
    filter: blur(0px);
}

/* مؤشرات التنقل */
.navigation-indicators {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px 0;
    width: 100%;
}

.nav-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 18px;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
}

.dots {
    display: flex;
    gap: 8px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.2);
}

.dot:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* مؤشر السكرول للشاشات الكبيرة */
@media (min-width: 769px) {
    .right::after {
        content: "↑ Scroll or use arrow keys ↓";
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: #666;
        font-family: Georgia;
        font-size: 14px;
        opacity: 0.7;
        animation: fadeInOut 2s infinite;
    }
}

@keyframes fadeInOut {

    0%,
    100% {
        opacity: 0.3;
    }

    50% {
        opacity: 0.7;
    }
}

/* تصميم متجاوب */
@media (max-width: 768px) {
    .main-our-services {
        flex-direction: column;
        padding: 32px 24px;
        gap: 40px;
    }

    .right {
        width: 100%;
        height: 350px;
    }

    .show-text-center {
        font-size: 28px;
    }

    .show-text-center.active,
    .show-text-center.active span {
        font-size: 22px;
    }

    .text-back,
    .text-next {
        font-size: 24px;
    }

    .text-back span,
    .text-next span {
        font-size: 22px;
    }

    .navigation-indicators {
        gap: 15px;
    }

    .nav-btn {
        width: 35px;
        height: 35px;
        font-size: 16px;
    }
}

/* دعم للغة العربية */
:root[dir="rtl"] .right,
[dir="rtl"] .right {
    direction: rtl;
}

:root[dir="rtl"] .services-container,
[dir="rtl"] .services-container {
    align-items: flex-end;
}

:root[dir="rtl"] .service-item,
[dir="rtl"] .service-item {
    text-align: right;
}
</style>