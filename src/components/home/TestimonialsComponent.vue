<template>
    <div class="main">
        <div class="title">
            {{ t('testimonials.title') }}
        </div>

        <div class="frame">
            <div class="content">
                <div class="description">
                    {{ currentTestimonial.description }}
                </div>
                <div class="profiles">
                    <div class="picture">
                        <img :src="currentTestimonial.image" :alt="currentTestimonial.name">
                    </div>
                    <div class="name">
                        {{ currentTestimonial.name }}
                    </div>
                    <div class="job">
                        {{ currentTestimonial.job }}
                    </div>
                </div>
            </div>

            <div class="points">
                <span 
                    v-for="(testimonial, index) in testimonials" 
                    :key="index"
                    class="point" 
                    :class="{ active: currentIndex === index }"
                    @click="goToTestimonial(index)"
                ></span>
            </div>
        </div>

        <button class="arrow arrow-left" @click="prevTestimonial" :aria-label="t('testimonials.prev')">
           <img src="/icons/arrow-right.svg" alt="">
        </button>

        <button class="arrow arrow-right" @click="nextTestimonial" :aria-label="t('testimonials.next')">
                       <img src="/icons/arrow-right.svg" alt="">

        </button>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const { t, locale } = useI18n();
const currentIndex = ref(0);
const autoPlayInterval = ref(null);

// بيانات الشهادات بناءً على اللغة
const testimonials = computed(() => {
    if (locale.value === 'ar') {
        return [
            {
                name: "أحمد محمد",
                job: "مطور ويب",
                description: "لوريم إيبسوم دولور سيت أميت، كونسيكتيتور أديبيسسينغ إليت. سيد دو أيوسمود تيمبور أنكايديديونت يوت لابوري أيت دولور ماجنا أليكوا. يوت enim ad minim veniam.",
                image: "/images/profile-picture/picture1.png"
            },
            {
                name: "فاطمة عبدالله", 
                job: "مصممة واجهات",
                description: "دوي أيسيوت irure دولور in reprehenderit in فوليبتات فيليت إيسي كيليوم دولور إيوي فوجيات نولا بارياتور. إكسسيبتيور سينت occaecat كيوبيداتات نون proident.",
                image: "/images/profile-picture/picture1.png"
            },
            {
                name: "خالد سعيد",
                job: "مطور تطبيقات",
                description: "سونت ان كيولبا كيوا أوفيسيا ديسيرونت موليت أنيم إيد est لابوروم إيت dolor magna aliqua. أت فيرو ايسي et accusam et justo duo dolores et ea rebum.",
                image: "/images/profile-picture/picture1.png"
            }
        ];
    } else {
        return [
            {
                name: "Albert Flores",
                job: "Web3 Developer",
                description: "Lorem ipsum dolor sit amet consectetur. Senectus tempus maecenas imperdiet sodales tincidunt ornare imperdiet. Nunc venenatis id pellentesque tellus ipsum. Faucibus nec diam in diam.",
                image: "/images/profile-picture/picture1.png"
            },
            {
                name: "Sarah Johnson",
                job: "UI/UX Designer", 
                description: "Elementum egestas arcu dignissim id ultrices phasellus scelerisque vulputate. Vel purus blandit sit laoreet. Turpis nisi proin egestas neque massa. Erat ipsum mollis suspendisse consectetur.",
                image: "/images/profile-picture/picture1.png"
            },
            {
                name: "Michael Chen",
                job: "Mobile Developer",
                description: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
                image: "/images/profile-picture/picture1.png"
            }
        ];
    }
});

// الشهادة الحالية
const currentTestimonial = computed(() => {
    return testimonials.value[currentIndex.value];
});

// الانتقال إلى شهادة محددة
const goToTestimonial = (index) => {
    currentIndex.value = index;
    resetAutoPlay();
};

// الشهادة التالية
const nextTestimonial = () => {
    currentIndex.value = (currentIndex.value + 1) % testimonials.value.length;
    resetAutoPlay();
};

// الشهادة السابقة  
const prevTestimonial = () => {
    currentIndex.value = (currentIndex.value - 1 + testimonials.value.length) % testimonials.value.length;
    resetAutoPlay();
};

// التشغيل التلقائي
const startAutoPlay = () => {
    autoPlayInterval.value = setInterval(() => {
        nextTestimonial();
    }, 5000); // تغيير كل 5 ثواني
};

const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value);
        autoPlayInterval.value = null;
    }
};

const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
};

// إعادة التعيين عند تغيير اللغة
watch(locale, () => {
    currentIndex.value = 0;
    resetAutoPlay();
});

onMounted(() => {
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});
</script>

<style scoped>
.main {
    display: flex;
    width: 100%;
    padding: 60px 20px;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    background: #100E0E;
    position: relative;
    min-height: 500px;
}

.title {
    color: var(--Black-black-1, #FFF);
text-align: center;
font-family: "Bebas Neue";
font-size: 80px;
font-style: normal;
font-weight: 400;
line-height: 125%; /* 100px */
text-transform: uppercase;
}

.frame {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    width: 100%;
    max-width: 800px;
}

.frame .content {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    transition: all 0.5s ease-in-out;
}

.content .description {
    color: var(--Black-black-5, #DBDBDB);
text-align: center;
font-family: Inter;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: 125%; /* 25px */
    width: 100%;
}

.content .profiles {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.profiles .picture {
    display: flex;
    align-items: center;
    justify-content: center;
}

.picture img {
    width: 80px;
    height: 80px;
    border-radius:80px;
    width: 64px;
height: 64px;
aspect-ratio: 1/1;
    object-fit: cover;
    border: 2px solid #E9480E;
}

.profiles .name {
    color: var(--Black-black-1, #FFF);
text-align: center;
font-family: "Bebas Neue";
font-size: 40px;
font-style: normal;
font-weight: 400;
line-height: 125%; /* 50px */
text-transform: uppercase;
}

.profiles .job {
   color: var(--Orange-orange-500, #E9480E);
text-align: center;
font-family: "Bebas Neue";
font-size: 28px;
font-style: normal;
font-weight: 400;
line-height: 125%; /* 35px */
}

.frame .points {
    display: flex;
    align-items: center;
    gap: 12px;
}

.point {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FFF;
    opacity: 0.3;
    cursor: pointer;
    transition: all 0.3s ease;
}

.point.active {
    background: #E9480E;
    opacity: 1;
    transform: scale(1.2);
}

.point:hover {
    opacity: 0.7;
    transform: scale(1.1);
}

.arrow {
    display: none;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
    
    transition: all 0.3s ease;
}



.arrow:active {
    transform: translateY(-50%) scale(0.95);
}

.arrow-left {
     position: absolute;
left: 80px;
bottom: 226px;
display: flex;
width: 24px;
height: 24px;
justify-content: center;
align-items: center;
rotate: 180deg;
    
}

.arrow-right {
    position: absolute;
right: 80px;
bottom: 226px;
display: flex;
width: 24px;
height: 24px;
justify-content: center;
align-items: center;
}

/* تحسينات للشاشات المتوسطة */
@media (min-width: 768px) {
    .main {
        padding: 80px 40px;
        gap: 48px;
    }

   

    .content .description {
        font-size: 1.25rem;
    }

    .profiles .name {
        font-size: 1.75rem;
    }

    .profiles .job {
        font-size: 1.25rem;
    }

    .arrow {
        display: flex;
    }

    .arrow-left {
        left: 40px;
    }

    .arrow-right {
        right: 40px;
    }
}

/* تحسينات للشاشات الكبيرة */
@media (min-width: 1024px) {
    .main {
        padding: 96px 80px;
        gap: 56px;
    }

    .frame .content {
        gap: 48px;
    }

    .content .description {
        font-size: 1.25rem;
    }

    .picture img {
        width: 64px;
        height: 64px;
    }

    .arrow-left {
        left: 80px;
    }

    .arrow-right {
        right: 80px;
    }
}

/* تحسينات للشاشات الكبيرة جداً */
@media (min-width: 1200px) {
    .frame .content {
        width: 848px;
    }
}

/* دعم للغة العربية */
:root[dir="rtl"] .arrow-left,
[dir="rtl"] .arrow-left {
    left: auto;
    right: 20px;
    transform: translateY(-50%) rotate(180deg);
}

:root[dir="rtl"] .arrow-right,
[dir="rtl"] .arrow-right {
    right: auto;
    left: 20px;
    transform: translateY(-50%) rotate(180deg);
}

@media (min-width: 768px) {
    :root[dir="rtl"] .arrow-left,
    [dir="rtl"] .arrow-left {
        right: 40px;
    }

    :root[dir="rtl"] .arrow-right,
    [dir="rtl"] .arrow-right {
        left: 40px;
    }
}

@media (min-width: 1024px) {
    :root[dir="rtl"] .arrow-left,
    [dir="rtl"] .arrow-left {
        right: 80px;
    }

    :root[dir="rtl"] .arrow-right,
    [dir="rtl"] .arrow-right {
        left: 80px;
    }
}

/* أنيميشن للانتقال بين الشهادات */
.content {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* تحسينات للأجهزة التي تدعم اللمس */
@media (pointer: coarse) {
    .arrow {
        width: 56px;
        height: 56px;
    }

    .point {
        width: 16px;
        height: 16px;
    }
}
</style>