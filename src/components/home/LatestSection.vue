<template>
  <div class="main">
    <div class="frame">
      <div class="logo">
        <img src="/logo.svg" alt="">
      </div>

      <div class="content">
        <div class="title">
          {{ $t('contacts.title') }}
        </div>

        <div class="subtitle">
          {{ $t('contacts.subtitle') }}
        </div>
      </div>
      <router-link to="/contact">
        <div class="buttons">
          {{ $t('contacts.button') }}
        </div>
      </router-link>
    </div>
  </div>
</template>



<style scoped>
.main {
  display: flex;
  width: 100%;
  padding: 80px 64px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  background: #100E0E;
}

.frame {
  display: flex;
  height: 438px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  border-radius: 16px;
  background: linear-gradient(to bottom right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, rgba(233, 72, 14, 0.50) 0%, rgba(16, 14, 14, 0.50) 50%) top right / 50% 50% no-repeat, url(/images/bg-last-section.jpg) lightgray 50% / cover no-repeat;
}

.logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6.822px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.content .title {
  color: #FFF;
  font-family: Rockwell;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
}

.content .subtitle {
  color: #FFF;
  font-family: Georgia;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
}

.buttons {
  display: flex;
  padding: 16px 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 144px;
  background: #FFF;
  color: var(--Orange-orange-500, #E9480E);
  font-family: Rockwell;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  transition: background .3s ease, color .3s ease;
}

.buttons:hover {
  background: #E9480E;
  color: #FFF;
  cursor: pointer;
}

.logo img {
  width: 100%;
}

@media (max-width: 768px) {
  .main {
    display: flex;
    height: 680px;
    padding: 64px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  }

  .frame {
    display: flex;
    padding: 40px 16px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 32px;
    flex: 1 0 0;
    align-self: stretch;
  }

  .logo {
    width: 150px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    align-self: stretch;
  }

  .title {
    align-self: stretch;
    color: #FFF;
    text-align: center;
    font-family: Rockwell;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
  }

  .subtitle {
    color: #FFF;
    text-align: center;
    font-family: Georgia;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 125%;
  }
}

/* RTL Support for Arabic */
[dir="rtl"] .main {
  align-items: flex-end;
}

[dir="rtl"] .logo {
  align-items: flex-end;
}

[dir="rtl"] .content {
  align-items: center;
}
</style>