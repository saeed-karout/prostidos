<template>
    <div class="main" ref="footerRef">
        <div class="content">
            <div class="one-column">
                <div class="row">{{ $t('footer.part') }}</div>
                <a href="https://www.artvel.de/" target="_blank" class="row2"> Artvel Studios </a>
            </div>
            <div class="two-column">
                <img src="/logos/logo-vertical.svg" alt="Logo" class="logo-img">
            </div>
            <div class="three-column">
                <div class="list-links">
                    <a href="https://vimeo.com/artvelmedia" target="_blank" class="link media-link">vimeo</a>
                    <a href="https://www.youtube.com/@prostdios" target="_blank" class="link media-link">youtube</a>
                    <a href="https://x.com/prostdios_sa" target="_blank" class="link media-link">twitter</a>
                    <a href="https://www.tiktok.com/@prostdios" target="_blank" class="link media-link">tiktok</a>
                    <a href="https://wa.me/966581670316" target="_blank" class="link media-link">whatsapp</a>
                </div>
                <div @click="scrollToSection('contact')" class="get">
                    {{ $t('footer.get') }}
                </div>
                <div class="data">
                    <a :href="emailHref" class="email email-link"
                        :aria-label="$t('footer.contacts.email')"> {{ cleanEmail }} </a>
                    <div class="space"></div>
                    <div class="countries"> {{ $t('footer.countries') }} </div>
                </div>
            </div>
        </div>
        <div class="under-footer">
            <div class="logo">
                <img src="/logos/Artvel_Logo.png" alt="Artvel_Logo.png" class="logo-artvel">
                <div class="space"></div>
                <img src="/logos/2030.png" alt="2030 logo" class="logo-2030">
            </div>
            <div class="by">
                <div class="text"> {{ $t('footer.copyright') }} {{ $t('footer.company') }} </div>
                <div class="space"></div>
            </div>
            <div class="policy-links">
                <div class="policy-item"> {{ $t('footer.privacyPolicy') }} </div>
                <div class="policy-item"> {{ $t('footer.terms') }} </div>
                <div class="policy-item"> {{ $t('footer.cookies') }} </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const cleanEmail = computed(() => {
    const email = t('footer.contacts.email');
    return email.replace('[at]', '@');
});

const emailHref = computed(() => {
    const email = t('footer.contacts.email');
    return `mailto:${email.replace('[at]', '@')}`;
});

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.error(`Element with ID ${sectionId} not found`);
    }
}
</script>

<style scoped>
/* =========================================== */
/* الأنماط الأساسية للديسكتوب (لا تتغير) */
/* =========================================== */
.main {
    background-color: #151212;
    color: white;
    z-index: 50;
    padding: 40px 60px;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.one-column {
    width: 29vw;
}

.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.row,
.row2 {
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: 1.2px;
    pointer-events: none;
}

.row2 {
    color: #E9480E;
    text-decoration: underline;
    cursor: pointer;
    pointer-events: all;
}

.two-column {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 25vw;
    height: 300px;
    min-height: 300px;
    position: relative;
}

.logo-img {
    width: 220px;
    height: auto;
    max-height: 100%;
}

.three-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    width: 30vw;
}

.list-links {
    display: flex;
    gap: 20px;
}

.link {
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: .9px;
    font-style: italic;
    cursor: pointer;
    position: relative;
    transition: color 0.4s ease;
}

.media-link {
    padding-bottom: 4px;
}

.media-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, #E9480E, #ff6b3a);
    transition: width 0.4s ease;
}

.media-link:hover {
    color: #E9480E;
}

.media-link:hover::after {
    width: 100%;
}

.email-link {
    position: relative;
}

.email-link::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(90deg, #E9480E, #ff8c5a);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
}

.email-link:hover {
    color: #E9480E !important;
}

.email-link:hover::before {
    transform: scaleX(1);
}

.get {
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: .9px;
    text-transform: lowercase;
    text-decoration: underline;
    cursor: pointer;
}

.data {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.space {
    min-width: 20px;
    height: 1px;
    background: #E9480E;
    flex: 1;
}

.under-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    width: 30vw;
}

.by {
    width: 20vw;
    display: flex;
    align-items: center;
    gap: 10px;
}

.text {
    font-size: 1.4rem;
}

.policy-links {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
    width: 30vw;
}

.policy-item {
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.3s ease;
}

.policy-item:hover {
    color: #E9480E;
}

.logo-artvel {
    width: 96px;
    height: auto;
}

.logo-2030 {
    width: 96px;
    height: auto;
    filter: brightness(0) invert(1);
}

/* =========================================== */
/* تعديلات بسيطة للتابلت فقط */
/* =========================================== */
@media (min-width: 769px) and (max-width: 1024px) {
    .main {
        padding: 40px 40px;
    }

    .two-column {
        height: 250px;
        /* تصغير ارتفاع الشعار */
    }

    .logo-img {
        width: 180px;
        /* تصغير حجم الشعار */
    }

    .row,
    .row2 {
        font-size: 2.5rem;
        /* تصغير النص قليلاً */
    }

    .get {
        font-size: 3rem;
        /* تصغير حجم "Get" */
    }

    .link {
        font-size: 1.3rem;
        /* تصغير الروابط الاجتماعية */
    }
}

/* =========================================== */
/* تصميم الموبايل المحسّن */
/* =========================================== */
@media (max-width: 768px) {
    .main {
        padding: 40px 24px;
        background-color: #151212;
    }

    .content {
        flex-direction: column;
        align-items: center;
        gap: 40px;
        width: 100%;
    }

    .one-column {
        width: 100%;
        text-align: center;
        order: 2;
        /* margin-top: 30px; */
    }

    .two-column {
        width: 100%;
        height: auto;
        min-height: 180px;
        order: 1;
        /* margin: 20px 0 30px 0; */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logo-img {
        width: 160px;
        height: auto;
        max-height: 180px;
        object-fit: contain;
    }

    .three-column {
        width: 100%;
        text-align: center;
        align-items: center;
        order: 3;
        /* margin-top: 20px; */
    }

    .row,
    .row2 {
        font-size: 1.8rem;
        font-weight: 600;
        line-height: 1.3;
        margin-bottom: 8px;
    }

    .row2 {
        color: #E9480E;
        text-decoration: underline;
        display: inline-block;
        margin-top: 4px;
    }

    .get {
        font-size: 2.2rem;
        font-weight: 700;
        /* margin: 25px 0; */
        text-align: center;
        width: 100%;
        text-decoration: underline;
        text-decoration-color: #E9480E;
        text-decoration-thickness: 2px;
    }

    .list-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
        /* margin-bottom: 25px; */
        /* padding: 0 10px; */
    }

    .link {
        font-size: 1.15rem;
        font-weight: 500;
        padding: 6px 0;
        display: inline-block;
    }

    .media-link::after {
        height: 1px;
        bottom: 2px;
    }

    .data {
        /* flex-direction: column; */
        align-items: center;
        gap: 20px;
        width: 100%;
        /* margin-top: 25px; */
    }

    .email {
        font-size: 1.2rem;
        font-weight: 500;
        text-align: center;
        display: block;
        /* margin-bottom: 10px; */
    }

    .countries {
        font-size: 1rem;
        text-align: center;
        opacity: 0.9;
        /* margin-top: 10px; */
    }

    .space {
        width: 80%;
        max-width: 200px;
        height: 1px;
        background: rgba(233, 72, 14, 0.5);
        margin: 15px auto;
        display: none;
    }

    .under-footer {
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
        padding-top: 30px;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
        width: 100%;
    }

    .logo {
        width: 100%;
        /* flex-direction: column; */
        align-items: center;
        gap: 25px;
        /* margin-bottom: 10px; */
    }

    .logo-artvel,
    .logo-2030 {
        width: 80px;
        height: auto;
        margin: 0 auto;
    }

    .by {
        width: 100%;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 15px;
        order: 2;
    }

    .text {
        font-size: 0.95rem;
        line-height: 1.5;
        opacity: 0.8;
        max-width: 90%;
        margin: 0 auto;
    }

    .policy-links {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-top: 10px;
        order: 1;
        padding: 0 20px;
    }

    .policy-item {
        font-size: 0.9rem;
        opacity: 0.7;
        text-align: center;
        flex: 1;
    }

    .policy-item:hover {
        opacity: 1;
        color: #E9480E;
    }

    /* تحسين التباعد العام */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* تحسين المسافات بين العناصر */
    .one-column,
    .three-column {
        padding: 0 10px;
    }

    /* جعل النصوص أكثر وضوحاً */
    .row,
    .row2,
    .get,
    .email,
    .countries {
        letter-spacing: 0.3px;
    }
}

/* تحسينات إضافية للشاشات الصغيرة جداً */
@media (max-width: 375px) {
    .main {
        padding: 30px 16px;
    }

    .row,
    .row2 {
        font-size: 1.6rem;
    }

    .get {
        font-size: 2rem;
    }

    .link {
        font-size: 1rem;
    }

    .list-links {
        gap: 14px;
    }

    .policy-links {
        padding: 0 10px;
    }

    .policy-item {
        font-size: 0.85rem;
    }
}

/* دعم RTL */
[dir="rtl"] .list-links,
[dir="rtl"] .policy-links {
    flex-direction: row;
}

[dir="rtl"] .one-column,
[dir="rtl"] .three-column {
    text-align: center;
}

[dir="rtl"] .media-link::after {
    left: auto;
    right: 0;
}
</style>