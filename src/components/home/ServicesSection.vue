<template>
  <!-- Desktop Section -->
  <div class="main bg-cover bg-center bg-[#100E0E] h-[100vh] flex flex-col items-center justify-center gap-16 " id="services">
    <div class="title">
      <div class="text1">
        {{ $t('services.title.main') }}
      </div>
      <div class="text2">
        {{ $t('services.title.subtitle') }}
      </div>
    </div>

    <div class="map">
      <div class="frame1">
        <div class="top">
          <div class="brand">
            <img :src="icons[0]" class="w-[24px] h-[24px]" :alt="$t('services.items[0].name')">
            <div class="text-white">{{ $t('services.items[0].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[0].projects') }}
          </div>
        </div>
        <div class="ruler justify-end">
          <div :class="n === activeLine[0] ? 'line-active' : 'line'" v-for="n in 8" :key="n"></div>
        </div>
      </div>

      <div class="frame1">
        <div class="top"></div>
        <div class="ruler">
          <div :class="n === activeLine[1] ? 'line-active' : 'line'" v-for="n in 15" :key="n"></div>
        </div>
        <div class="bottoms">
          <div class="brand">
            <img :src="icons[1]" class="w-[24px] h-[24px]" :alt="$t('services.items[1].name')">
            <div class="text-white">{{ $t('services.items[1].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[1].projects') }}
          </div>
        </div>
      </div>

      <div class="frame1">
        <div class="top">
          <div class="brand">
            <img :src="icons[2]" class="w-[24px] h-[24px]" :alt="$t('services.items[2].name')">
            <div class="text-white">{{ $t('services.items[2].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[2].projects') }}
          </div>
        </div>
        <div class="ruler">
          <div :class="n === activeLine[2] ? 'line-active' : 'line'" v-for="n in 15" :key="n"></div>
        </div>
        <div class="bottoms"></div>
      </div>

      <div class="frame1">
        <div class="top"></div>
        <div class="ruler">
          <div :class="n === activeLine[3] ? 'line-active' : 'line'" v-for="n in 15" :key="n"></div>
        </div>
        <div class="bottoms">
          <div class="brand">
            <img :src="icons[3]" class="w-[24px] h-[24px]" :alt="$t('services.items[3].name')">
            <div class="text-white">{{ $t('services.items[3].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[3].projects') }}
          </div>
        </div>
      </div>

      <div class="frame1">
        <div class="top">
          <div class="brand">
            <img :src="icons[4]" class="w-[24px] h-[24px]" :alt="$t('services.items[4].name')">
            <div class="text-white">{{ $t('services.items[4].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[4].projects') }}
          </div>
        </div>
        <div class="ruler">
          <div :class="n === activeLine[4] ? 'line-active' : 'line'" v-for="n in 15" :key="n"></div>
        </div>
      </div>

      <div class="frame1">
        <div class="top"></div>
        <div class="ruler">
          <div :class="n === activeLine[5] ? 'line-active' : 'line'" v-for="n in 15" :key="n"></div>
        </div>
        <div class="bottoms">
          <div class="brand">
            <img :src="icons[5]" class="w-[24px] h-[24px]" :alt="$t('services.items[5].name')">
            <div class="text-white">{{ $t('services.items[5].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[5].projects') }}
          </div>
        </div>
      </div>

      <div class="frame1">
        <div class="top">
          <div class="brand">
            <img :src="icons[6]" class="w-[24px] h-[24px]" :alt="$t('services.items[6].name')">
            <div class="text-white">{{ $t('services.items[6].name') }}</div>
          </div>
          <div class="data">
            {{ $t('services.items[6].projects') }}
          </div>
        </div>
        <div class="ruler">
          <div :class="n === activeLine[6] ? 'line-active' : 'line'" v-for="n in 8" :key="n"></div>
        </div>
      </div>
    </div>

    <div class="section-bottom">
      <div class="p">
        {{ $t('services.description') }}
      </div>
      <div class="btns">
        <span>{{ $t('services.button') }}</span>
      </div>
    </div>
  </div>

  <!-- Mobile Section -->
  <div class="main-mobile flex md:hidden">
    <div class="top-mobile">
      <div class="title">
        {{ $t('services.title.main') }}
      </div>
      <div class="subtitle">
        {{ $t('services.title.subtitle') }}
      </div>
    </div>

    <div class="content-mobile">
      <!-- Frame 1 -->
      <div class="frame">
        <div class="right">
          <div class="top">
            <img :src="icons[0]" :alt="$t('services.items[0].name')">
            <div class="topic">{{ $t('services.items[0].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[0].projects') }}</div>
        </div>
        <div class="middle">
          <div class="disable" v-for="n in 5" :key="'disable-' + n"></div>
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 6" :key="'line-' + n"></div>
        </div>
        <div class="left"></div>
      </div>
      <!-- Frame 2 -->
      <div class="frame">
        <div class="right"></div>
        <div class="middle">
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 11" :key="'line-' + n"></div>
        </div>
        <div class="left">
          <div class="top">
            <img :src="icons[1]" :alt="$t('services.items[1].name')">
            <div class="topic">{{ $t('services.items[1].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[1].projects') }}</div>
        </div>
      </div>
      <!-- Frame 3 -->
      <div class="frame">
        <div class="right">
          <div class="top">
            <img :src="icons[2]" :alt="$t('services.items[2].name')">
            <div class="topic">{{ $t('services.items[2].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[2].projects') }}</div>
        </div>
        <div class="middle">
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 11" :key="'line-' + n"></div>
        </div>
        <div class="left"></div>
      </div>
      <!-- Frame 4 -->
      <div class="frame">
        <div class="right"></div>
        <div class="middle">
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 11" :key="'line-' + n"></div>
        </div>
        <div class="left">
          <div class="top">
            <img :src="icons[3]" :alt="$t('services.items[3].name')">
            <div class="topic">{{ $t('services.items[3].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[3].projects') }}</div>
        </div>
      </div>
      <!-- Frame 5 -->
      <div class="frame">
        <div class="right">
          <div class="top">
            <img :src="icons[4]" :alt="$t('services.items[4].name')">
            <div class="topic">{{ $t('services.items[4].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[4].projects') }}</div>
        </div>
        <div class="middle">
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 11" :key="'line-' + n"></div>
        </div>
        <div class="left"></div>
      </div>
      <!-- Frame 6 -->
      <div class="frame">
        <div class="right"></div>
        <div class="middle">
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 11" :key="'line-' + n"></div>
        </div>
        <div class="left">
          <div class="top">
            <img :src="icons[5]" :alt="$t('services.items[5].name')">
            <div class="topic">{{ $t('services.items[5].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[5].projects') }}</div>
        </div>
      </div>
      <!-- Frame 7 -->
      <div class="frame">
        <div class="right">
          <div class="top">
            <img :src="icons[6]" :alt="$t('services.items[6].name')">
            <div class="topic">{{ $t('services.items[6].name') }}</div>
          </div>
          <div class="bottom-mob">{{ $t('services.items[6].projects') }}</div>
        </div>
        <div class="middle">
          <div :class="n === 6 ? 'line active' : 'line'" v-for="n in 6" :key="'line-' + n"></div>
          <div class="disable" v-for="n in 5" :key="'disable-' + n"></div>
        </div>
        <div class="left"></div>
      </div>
    </div>

    <div class="bottom-mobile">
      <div class="description">
        {{ $t('services.description') }}
      </div>
      <div class="btn-mobile">
        <span>{{ $t('services.button') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

// Icons for each service
const icons = [
  '/icons/services/pen-tool-2.svg',
  '/icons/services/camera.svg',
  '/icons/services/video-play.svg',
  '/icons/services/shapes.svg',
  '/icons/services/lamp-charge.svg',
  '/icons/services/cpu-charge.svg',
  '/icons/services/prostdios.svg'
];

// Active line position for each ruler
const activeLine = [1, 8, 8, 8, 8, 8, 8];
</script>

<style scoped>
.title {
  max-width: 600px;
  gap: 16px;
  margin: 0 auto;
}

.text1 {
  font-family: Rockwell;
  font-weight: 700;
  font-style: bold;
  font-size: 40px;
  line-height: 125%;
  letter-spacing: 0%;
  color: white;
}

.text2 {
  font-family: Georgia;
  font-weight: 400;
  font-style: normal;
  font-size: 22px;
  line-height: 125%;
  letter-spacing: 0%;
  color: white;
  text-align: center;
}

.map {
  width: 90%;
  height: 343px;
  opacity: 1;
  padding: 64px 42px;
  gap: 12px;
  border-radius: 16px;
  background-color: #151212;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map .frame1 {
  width: 168px;
  height: 215px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
}

.frame1 .top {
  width: 106px;
  height: 51px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.frame1 .brand {
  width: 120px;
  height: 24px;
  display: flex;
  gap: 8px;
}

.bottom {
  width: 672px;
  height: 119px;
  opacity: 1;
  gap: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.p {
  width: 100%;
  height: 40px;
  opacity: 1;
  font-family: Georgia;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 125%;
  letter-spacing: 0%;
  text-align: center;
  color: white;
}

.bottom .btn {
  width: 199px;
  height: 55px;
  opacity: 1;
  padding: 16px 40px;
  gap: 8px;
  border-radius: 144px;
  background-color: #343232;
}

.btn span {
  font-family: Rockwell;
  font-weight: 700;
  font-style: bold;
  font-size: 18px;
  line-height: 125%;
  letter-spacing: 0%;
  color: white;
}

.data {
  font-family: Georgia;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 125%;
  letter-spacing: 0%;
  text-align: center;
  color: white;
}

.ruler {
  width: 168px;
  height: 68px;
  display: flex;
  gap: 10px;
}

.ruler .line {
  width: 2px;
  height: 68px;
  border: 1px solid #DDDDDD66;
}

.ruler .line-active {
  width: 2px;
  height: 68px;
  border: 1px solid #E9480E;
}

.frame1 .bottoms {
  width: 106px;
  height: 51px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.section-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.section-bottom .p {
  width: 672px;
  color: #FFF;
  text-align: center;
  font-family: Georgia;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.section-bottom .btns {
  display: flex;
  padding: 16px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 144px;
  background: #343232;
  color: #FFF;
  font-family: Rockwell;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  transition: background 0.3s ease, color 0.3s ease;
}

.section-bottom .btns:hover {
  background: white;
  color: #343232;
  cursor: pointer;
}

/* Mobile View */
.main-mobile {
  display: flex;
  padding: 64px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
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
  align-self: stretch;
  color: #FFF;
  text-align: center;
  font-family: Rockwell;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
}

.top-mobile .subtitle {
  color: #FFF;
  font-family: Georgia;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.content-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 16px;
  background: #151212;
  padding: 16px;
  width: 100%;
  overflow-x: auto; /* السماح بالتمرير الأفقي إذا لزم الأمر */
}

.content-mobile .frame {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 130px;
}

.content-mobile .frame .right,
.content-mobile .frame .left {
  display: flex;
  width: 136px;
  height: 51px;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  position: static; /* إزالة الـ position: relative */
}

.content-mobile .frame .right .top,
.content-mobile .frame .left .top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
}

.top .topic {
  color: #FFF;
  font-family: Rockwell;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
}

.content-mobile .frame .right .bottom-mob,
.content-mobile .frame .left .bottom-mob {
  align-self: stretch;
  color: #FFF;
  text-align: center;
  font-family: Georgia;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.content-mobile .frame .middle {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  align-self: stretch;
  justify-content: center;
}

.content-mobile .frame .middle .disable {
  width: 20px;
  height: 1px;
  background: #151212;
}

.content-mobile .frame .middle .line {
  width: 20px;
  height: 1px;
  background: rgba(221, 221, 221, 0.40);
}

.content-mobile .frame .middle .active {
  width: 20px;
  height: 2px;
  background: #E9480E;
}

.bottom-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  align-self: stretch;
}

.bottom-mobile .description {
  align-self: stretch;
  color: #FFF;
  text-align: center;
  font-family: Georgia;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.bottom-mobile .btn-mobile {
  display: flex;
  padding: 16px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 144px;
  background: #343232;
}

.bottom-mobile .btn-mobile span {
  color: #FFF;
  font-family: Rockwell;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
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

/* RTL Support for Arabic */
[dir="rtl"] .map .frame1 .brand {
  flex-direction: row-reverse;
}

[dir="rtl"] .content-mobile .frame .right .top,
[dir="rtl"] .content-mobile .frame .left .top {
  flex-direction: row-reverse;
}

[dir="rtl"] .ruler {
  flex-direction: row-reverse;
}

[dir="rtl"] .ruler.justify-end {
  justify-content: flex-start;
}
</style>