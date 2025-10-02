<template>
  <div class=" h-[65vh] w-full  overflow-hidden relative flex gap-[88px] py-[96px] justify-center items-end">
    <video
      class="absolute top-0 left-0 w-full h-full object-cover z-0 "
      autoplay
      loop
      muted
      playsinline
      
    >
      <source :src=video type="video/mp4"  />
      Your browser does not support the video tag.
    </video>

    <div class="absolute top-0 left-0 w-full h-full bg-gradient z-10"></div>

    <div class="content z-20">
          <div class="top">
            <div class="title">
              zerabi
            </div>

            <div class="subtitle">
           Furniture & Decor
            </div>
          </div>

          <div class="btn">
            <span>{{ t('btn-watch') }}</span>
          </div>
    </div>
  </div>
</template>


<script setup>
import video from '@/assets/new-video/zarabi.mp4'
import { useI18n } from 'vue-i18n';

const {  t } = useI18n();
</script>


<style scoped>
.bg-gradient {
  background: linear-gradient(var(--primary));
  opacity: .3;
  z-index: 10;
}


.content{
  width: 715px;
height: 223px;
opacity: 1;
display: flex;
flex-direction: column;
justify-content: center;
gap: 80px;
align-items: center;


}

.content .top{
  width: 100%;
height: 88px;
opacity: 1;
display: flex;
flex-direction: column;
align-items: center;

gap: 8px;

}

.top .title{
font-family: Rockwell;
font-weight: 700;
font-style: Bold;
font-size: 40px;
line-height: 125%;
letter-spacing: 0%;
color: white;
}

.top .subtitle{
  font-family: Georgia;
font-weight: 400;
font-style: Regular;
font-size: 24px;
line-height: 125%;
letter-spacing: 10px;
color: white;
}

.btn{

height: 55px;
opacity: 1;
padding-top: 16px;
padding-right: 40px;
padding-bottom: 16px;
padding-left: 40px;
gap: 8px;
border-radius: 144px;
background-color: #343232;

}

.btn span{
font-family: Rockwell;
font-weight: 700;
font-style: Bold;
font-size: 18px;
color: white;
line-height: 125%;
letter-spacing: 0%;

}
</style>
