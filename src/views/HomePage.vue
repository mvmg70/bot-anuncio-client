<template>
  <ion-page id="HomePage">
    <ion-content :fullscreen="true" :class="{ 'page-map-mode': mode == 'map' }">
      <div class="flex-tooblar">
        <Logo :iconOnly="isMobile" />

        <SearchBar :noMargin="mode == 'map'" :noButtons="isMobile" />

        <ion-buttons>
          <ion-button color="light-gray" fill="solid" :class="{ 'only-icon': isMobile }" @click="changeMode()">
            <span v-if="!isMobile"> Alterar visualização </span>
            <ion-icon v-if="isMobile && mode == 'normal'" :src="getIcon('earthOutline')"></ion-icon>
            <ion-icon v-if="isMobile && mode == 'map'" :src="getIcon('gridOutline')"></ion-icon>
          </ion-button>
          <ion-button v-if="!currentUser" color="light-gray" fill="solid" class="only-icon" router-link="/auth">
            <ion-icon :src="getIcon('personCircleOutline')"></ion-icon>
          </ion-button>
          <ion-button v-else color="light-gray" fill="solid" class="only-avatar" router-link="/profile">
            <ion-avatar>
              <img :src="currentUser.photoURL" referrerpolicy="no-referrer" alt="" />
            </ion-avatar>
          </ion-button>
        </ion-buttons>
      </div>

      <div v-show="mode == 'normal'">
        <section>
          <div class="container">
            <div class="header-banner">
              <Splide :options="bannersOptions">
                <SplideSlide v-if="isLoadingBanners">
                  <Banner load />
                </SplideSlide>
                <SplideSlide v-else v-for="(banner, index) in allBanners" :key="index">
                  <Banner :bannerData="banner" :load="false" />
                </SplideSlide>
              </Splide>
            </div>
          </div>
        </section>

        <section>
          <div class="container">
            <div class="ads-content" v-if="isLoadingAds"><card-ads :isLoad="true" /></div>
            <div class="ads-content" v-else>
              <card-ads :adsData="allAds[0]" />
              <masonry-wall :items="allAds" :column-width="300" :gap="16">
                <template #default="{ item }">
                  <div @click="opemAd(item.id)">
                    <ion-card class="card-ad-content">
                      <ion-img :src="item.images[0]" alt=""></ion-img>

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
              </masonry-wall>
            </div>
          </div>
        </section>
      </div>

      <section class="map-mode" :class="{ visibled: mode == 'map' }" v-show="mode == 'map'" v-if="userLocale.latitude">
        <l-map :zoom="zoom" :max-zoom="maxZoom" :min-zoom="minZoom" :center="[userLocale.latitude, userLocale.longitude]">
          <l-tile-layer :url="url" :attribution="attribution" />
          <l-control-zoom position="bottomright" />
          <l-control-attribution :position="attributionPosition" />
          <l-control-scale :imperial="false" />
          <l-marker :lat-lng="[userLocale.latitude, userLocale.longitude]">
            <l-icon :icon-size="dynamicSize" :icon-anchor="dynamicAnchor" icon-url="/assets/images/pinPerson.png" />
          </l-marker>
          <l-marker v-for="(item, index) in allAds" :key="index" :lat-lng="[item.locale.lat, item.locale.lon]">
            <l-icon :icon-size="dynamicSize" :icon-anchor="dynamicAnchor" icon-url="/assets/images/pinLocation.png" />
            <l-popup> {{ item.title }} </l-popup>
          </l-marker>
        </l-map>

        <div class="ads-map-box">
          <div v-for="(item, index) in allAds" :key="index">
            <div class="card-ad-content-x" @click="opemAd(item.id)">
              <div class="cover">
                <img :src="item.images[0]" alt="" />
              </div>
              <div class="content">
                <div class="card-superior-info">
                  <div class="title">{{ item.title }}</div>
                  <div class="price" v-if="item.type != 'donate' || item.typeAd != 'recommendation' || item.typeAd != 'notice'">{{ printMoney(item.price) }}</div>
                  <div class="type" v-else>{{ isTypeTransaction(item.type) }}</div>
                </div>
                <div class="locale">{{ getAdress(item.locale) }}</div>
                <div class="descriprion">
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed" router-link="/publish">
        <ion-fab-button>
          <ion-icon :src="getIcon('addOutline')" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/splide/dist/css/themes/splide-skyblue.min.css";
import Banner from "../components/BannerSlider.vue";
import Logo from "../components/LogoInline.vue";
import SearchBar from "../components/SearchBar.vue";

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";

export default defineComponent({
  components: { Logo, Banner, Splide, SplideSlide, SearchBar, LMap, LTileLayer, LMarker, LPopup, LIcon },
  name: "HomePage",
  data() {
    return {
      zoom: 16,
      minZoom: 3,
      maxZoom: 19,
      iconWidth: 32,
      iconHeight: 32,
      zoomPosition: "bottomLeft",
      attributionPosition: "bottomright",
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      bannersOptions: {
        speed: 400,
        width: "100%",
        gap: 24,
        arrows: false,
        pagination: true,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        perPage: 1,
        perMove: 1,
        focus: "center",
      },
      mode: "normal",
    };
  },
  mounted() {
    let uf = this.userLocale.principalSubdivisionCode;
    this.getBanners();
    this.getAds(uf);
  },
  computed: {
    ...mapGetters("banner", ["allBanners", "isLoadingBanners"]),
    ...mapGetters("user", ["userLocale"]),
    ...mapGetters("auth", ["currentUser"]),
    ...mapGetters("ad", ["allAds", "isLoadingAds"]),
    dynamicSize() {
      return [this.iconWidth, this.iconHeight];
    },
    dynamicAnchor() {
      return [this.iconWidth / 2, this.iconHeight * 1];
    },
  },

  methods: {
    ...mapActions("banner", ["getBanners"]),
    ...mapActions("ad", ["getAds"]),
    log($e) {
      return $e;
    },
    opemAd(id) {
      this.$router.push({
        name: "ViewAd",
        params: { id: id },
      });
    },
    changeMode() {
      this.mode = this.mode == "normal" ? "map" : "normal";
    },
    getAdress(locale) {
      return `${locale.logradouro}, ${locale.bairro} - ${locale.localidade}`;
    },
  },
});
</script>

<style lang="scss" scoped>
#HomePage {
  .header-banner {
    border-radius: 12px;
    width: 100%;
    margin: 64px 0;
    overflow: hidden;

    .splide__track {
      border-radius: 12px;
      overflow: hidden;
    }
  }

  .map-mode {
    width: 100vw;
    height: 100vh;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    .leaflet-container {
      @media screen and (min-width: 780px) {
        width: calc(100vw - 400px) !important;
        margin-left: 400px;
        height: 100vh;
        margin-top: 0;
      }
      height: calc(100vh - 44px);
      margin-top: 44px;
    }
  }

  .flex-tooblar {
    display: grid;
    grid-auto-flow: column;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr;
    gap: 0px 12px;
    grid-template-areas: "logo search button";
    justify-items: stretch;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    z-index: 99999;
    background: var(--ion-toolbar-background);
    @media screen and (max-width: 780px) {
      grid-template-columns: auto 1fr auto;
    }
    .logo-conatiner {
      padding-left: 16px;
      justify-self: start;
      grid-area: logo;
      min-width: 40px;
      img {
        width: 24px;
        height: 24px;
      }
    }
    .container-search-bar {
      justify-self: center;
      align-self: center;
      grid-area: search;
      width: 100% !important;
    }
    ion-buttons {
      padding-right: 16px;
      justify-content: flex-end;
      justify-self: end;
      grid-area: button;
      gap: 8px;
      min-width: 88px;
      ion-button {
        margin: 0 !important;
        --border-radius: 8px;
      }
    }
  }

  .page-map-mode {
    .flex-tooblar {
      width: 100%;
      background: transparent;
      grid-template-columns: 400px 2fr 1fr;
      grid-template-areas: "search logo button";
      .container-search-bar {
        flex-grow: 1;
        background: var(--ion-toolbar-background);
        padding: auto 16px;
        box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      @media screen and (max-width: 780px) {
        background: var(--ion-toolbar-background);
        grid-template-areas: "logo search button";
        grid-template-columns: auto 1fr auto;
        .container-search-bar {
          box-shadow: none;
          padding: 0;
        }
      }
    }
  }

  .ads-map-box {
    position: absolute;
    bottom: 24px;
    left: 0;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: none;
    z-index: 9999;
    padding: 16px 16px 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;
    overflow: auto;
    gap: 16px;
    .card-ad-content-x {
      background: var(--ion-color-light-gray);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      flex-flow: row-reverse nowrap;
      gap: 12px;
      .cover {
        height: 75px;
        width: 75px;
        min-width: 83px;
        border-radius: 8px;
        overflow: hidden;
        z-index: 10;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .content {
        z-index: 9;
        flex-grow: 1;
        .card-superior-info {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          .title {
            font-family: "Mulish", sans-serif;
            font-size: 1.15em;
            line-height: 100%;
            font-weight: 800;
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
        .locale {
          font-family: "Questrial", sans-serif !important;
          font-size: 0.8em;
          font-weight: 400;
          text-transform: unset;
          opacity: 0.8;
          color: var(--ion-color-medium);
          line-height: 100%;
          margin-top: 8px;
        }
        .descriprion {
          font-style: normal;
          font-weight: 400;
          font-size: 0.9em;
          line-height: 110%;
          color: var(--ion-color-medium);
          opacity: 0.8;
          margin-top: 12px;
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
    }
    @media screen and (min-width: 780px) {
      background-color: var(--ion-background-color);
      flex-flow: column nowrap;
      width: 400px;
      height: calc(100vh - 44px);
      max-height: calc(100vh - 44px);
      bottom: 0;
      .cover {
        height: 100px;
        width: 100px;
        min-width: 112px;
        border-radius: 12px;
      }
    }
  }
}
</style>

<style lang="scss">
ion-card.card-ad-content {
  cursor: pointer;
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
