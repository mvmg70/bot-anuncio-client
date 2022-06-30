<template>
  <ion-card class="card-content">
    <div class="cover">
      <img :src="adsData.images[0]" alt="" />
      <div class="type" :style="`color: ${isTypeTransaction(adsData.type).color}; background-color: ${isTypeTransaction(adsData.type).bg}`">
        {{ isTypeTransaction(adsData.type).labelView }}
      </div>
    </div>
    <ion-card-header>
      <div class="left-side">
        <ion-card-title>{{ adsData.title }}</ion-card-title>
        <ion-card-subtitle>{{ getAdress(adsData.locale) }}</ion-card-subtitle>
        <div class="distance">
          {{ this.getDistanceFromLatLonInKm({ lat: userLocale.latitude, lng: userLocale.longitude }, { lat: adsData.locale.latitude, lng: adsData.locale.longitude }) }} Km de você
        </div>
      </div>
      <div class="price" v-if="adsData.type !== 'donate' && adsData.type !== 'recommendation' && adsData.type !== 'notice'">
        {{ printMoney(adsData.price) }}
      </div>
    </ion-card-header>
    <ion-card-content>
      <ion-text>
        <p>{{ strip(adsData.description) }}</p>
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CardItem",
  props: {
    adsData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    getAdress(locale) {
      return `${locale.logradouro}, ${locale.bairro} - ${locale.localidade}`;
    },
  },
  computed: {
    ...mapGetters("user", ["userLocale"]),
  },
};
</script>

<style lang="scss">
ion-card.card-content {
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-flow: column nowrap;
  margin: 0;
  grid-template-rows: auto;
  margin-bottom: 16px;
  width: 100% !important;
  overflow: hidden;
  .cover {
    position: relative;
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    overflow: hidden;
    img {
      border-radius: 8px;
      overflow: hidden;
      height: 100%;
      width: 100%;
      max-height: 500px;
      object-fit: cover;
      background-color: rgba(var(--ion-color-dark-rgb), 0.2);
    }
    .type {
      position: absolute;
      bottom: 12px;
      left: 0;
      padding: 4px 8px;
      text-transform: capitalize;
      background: var(--ion-color-secondary-tint);
      color: var(--ion-color-secondary-contrast);
      line-height: 90%;
      font-size: 0.95em;
      font-family: "Mulish" !important;
      font-style: normal;
      font-weight: 700;
      line-height: 100%;
      text-align: left;
      border-radius: 0 6px 6px 0;
    }
  }

  ion-card-header {
    padding: 8px 8px 12px;
    display: flex;
    flex-flow: column nowrap;
    gap: 8px;
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
      color: var(--ion-color-dark);
      line-height: 100%;
      margin-top: 6px;
    }

    .price {
      color: var(--ion-color-primary);
      font-size: 1.5em;
      font-family: "Mulish";
      font-style: normal;
      font-weight: 700;
      line-height: 100%;
      opacity: 0.85;
      text-align: left;
    }

    .distance {
      padding: 2px 8px;
      border-radius: 4px;
      display: flex;
      font-weight: 700;
      color: var(--ion-color-dark);
      background: var(--ion-color-warning);
      width: fit-content;
      margin-bottom: 8px;
    }
  }

  ion-card-content {
    font-family: "Questrial", sans-serif !important;
    font-style: normal;
    font-weight: 400;
    padding: 0 8px 12px;
    color: var(--ion-color-dark);
    p {
      opacity: 0.8;
      line-height: 110%;
      font-size: 1em;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
