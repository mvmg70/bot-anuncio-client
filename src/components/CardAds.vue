<template>
  <div :class="{ skeleton: isLoad }">
    <ion-card class="card-ad-content" v-if="isLoad">
      <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>

      <ion-card-header>
        <div class="left-side">
          <ion-card-title><ion-skeleton-text animated style="width: 60%"></ion-skeleton-text></ion-card-title>
          <ion-card-subtitle><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></ion-card-subtitle>
        </div>
        <div class="price"><ion-skeleton-text animated style="width: 100%"></ion-skeleton-text></div>
      </ion-card-header>

      <ion-card-content>
        <p>
          <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 90%"></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
      </ion-card-content>
    </ion-card>

    <ion-card class="card-ad-content" v-if="!isLoad">
      <ion-img :src="item.images[0]"></ion-img>

      <ion-card-header>
        <div class="left-side">
          <ion-card-title>{{ item.title }}</ion-card-title>
          <ion-card-subtitle>{{ getAdress(item.locale) }}</ion-card-subtitle>
        </div>
        <div class="price" v-if="item.type != 'donate' || item.typeAd != 'recommendation' || item.typeAd != 'notice'">{{ printMoney(item.price) }}</div>
        <div class="type" v-else>{{ isTypeTransaction(item.type) }}</div>
      </ion-card-header>

      <ion-card-content>
        <p>
          {{ item.description }}
        </p>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script>
export default {
  name: "CardAds",
  adsData: {
    type: Object,
    default: () => {},
  },
  isLoad: {
    type: Boolean,
    default: false,
  },
};
</script>

<style lang="scss">
ion-card.card-ad-content {
  margin: 0;
  background: var(--ion-color-light-gray);
  border-radius: 12px;
  box-shadow: none;
  ion-img {
    border-radius: 12px;
    overflow: hidden;
    max-height: 350px;
  }

  ion-card-header {
    padding: 12px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    .left-side {
      flex-grow: 1;
    }
    ion-card-title {
      font-family: "Mulish", sans-serif;
      font-size: 1.5em;
      line-height: 100%;
    }
    ion-card-subtitle {
      font-family: "Questrial", sans-serif !important;
      font-size: 1em;
      font-weight: 400;
      text-transform: unset;
      opacity: 0.8;
      color: var(--ion-color-medium);
      line-height: 100%;
    }

    .price {
      color: var(--ion-color-primary);
      font-size: 1.2em;
      font-family: "Mulish";
      font-style: normal;
      font-weight: 700;
      line-height: 100%;
      opacity: 0.72;
      text-align: right;
    }

    .type {
      background: var(--ion-color-secondary-tint);
      padding: 4px 24px 4px 8px;
      text-transform: capitalize;
      color: var(--ion-color-secondary-contrast);
      font-size: 1.1em;
      font-family: "Mulish" !important;
      font-style: normal;
      font-weight: 700;
      line-height: 100%;
      text-align: right;
      border-radius: 6px;
      margin-right: -24px !important;
    }
  }

  ion-card-content {
    font-style: normal;
    font-weight: 400;
    font-size: 1.1em;
    line-height: 110%;
    color: var(--ion-color-medium);
    opacity: 0.8;
    p {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
