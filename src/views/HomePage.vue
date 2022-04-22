<template>
  <ion-page id="HomePage">
    <ion-content :fullscreen="true">
      <div class="flex-tooblar">
        <Logo :iconOnly="isMobile" />

        <SearchBar :noButtons="isMobile" />

        <ion-buttons>
          <ion-button v-if="!currentUser" color="light-gray" fill="solid" class="only-icon" router-link="/auth">
            <ion-icon :src="getIcon('personCircleOutline')"></ion-icon>
          </ion-button>
          <ion-button v-else color="light-gray" fill="solid" class="only-avatar" router-link="/profile">
            <img :src="currentUser.photoURL" referrerpolicy="no-referrer" alt="" />
          </ion-button>
        </ion-buttons>
      </div>

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

        <div class="container" v-if="isLoadingAds">
          <div class="cards-content">
            <div v-for="item in 12" :key="item">
              <ion-skeleton-text animated style="width: 100%; height: 200px; border-radius: 12px; margin: 6px"></ion-skeleton-text>
            </div>
          </div>
        </div>

        <div class="container" v-if="allAds">
          <div class="cards-content">
            <ion-card class="card-ad-content" @click="opemAd(item.id)" v-for="item in allAds" :key="item.id">
              <div class="cover">
                <ion-img :src="item.images[0]" alt=""></ion-img>
                <div class="type" :style="`color: ${isTypeTransaction(item.type).color}; background-color: ${isTypeTransaction(item.type).bg}`">
                  {{ isTypeTransaction(item.type).labelView }}
                </div>
              </div>
              <ion-card-header>
                <div class="left-side">
                  <ion-card-title>{{ item.title }}</ion-card-title>
                  <ion-card-subtitle>{{ getAdress(item.locale) }}</ion-card-subtitle>
                </div>
                <div class="price" v-if="item.type !== 'donate' && item.type !== 'recommendation' && item.type !== 'notice'">
                  {{ printMoney(item.price) }}
                </div>
              </ion-card-header>
              <ion-card-content>
                <ion-text>
                  <p>{{ item.description }}</p>
                </ion-text>
              </ion-card-content>
            </ion-card>
          </div>
        </div>

        <div class="container no-ad" v-if="allAds.length == 0">
          <h1>Sem anúncio</h1>
          <p>Infelizmente não encontramos nenhum anúncio!</p>
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

export default defineComponent({
  components: { Logo, Banner, Splide, SplideSlide, SearchBar },
  name: "HomePage",
  data() {
    return {
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
    };
  },
  mounted() {
    this.getBanners();
    this.getAds();
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
  watch: {
    userLocale() {
      this.getAds();
    },
  },
  methods: {
    ...mapActions("banner", ["getBanners"]),
    ...mapActions("ad", ["getAds"]),
    opemAd(id) {
      this.$router.push({
        name: "ViewAd",
        params: { id: id },
      });
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
      min-width: 48px;
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
      min-width: 48px;
      ion-button {
        margin: 0 !important;
        --border-radius: 8px;
      }
    }
  }

  .cards-content {
    margin-bottom: 48px;
    column-count: 4;
    column-gap: 10px;
    @media screen and (max-width: 1120px) {
      column-count: 3;
    }
    @media screen and (max-width: 920px) {
      column-count: 2;
    }
    @media screen and (max-width: 680px) {
      column-count: 1;
    }
  }

  .no-ad {
    text-align: center;
    padding: 48px auto;
    h1 {
      color: var(--ion-color-primary);
      font-weight: 700;
      font-size: 2.5em;
    }
    p {
      font-size: 1em;
      opacity: 0.8;
    }
  }
}
</style>

<style lang="scss">
ion-card.card-ad-content {
  cursor: pointer;
  background: var(--ion-color-light-gray);
  border-radius: 12px;
  box-shadow: none;
  display: grid;
  margin: 0;
  grid-template-rows: auto;
  margin-bottom: 16px;
  break-inside: avoid;
  .cover {
    position: relative;
    ion-img {
      border-radius: 8px;
      overflow: hidden;
      max-height: 500px;
      width: 100%;
      min-height: 75px;
      background-color: rgba(var(--ion-color-dark-rgb), 0.2);
      background-image: url("https://botanuncio.com.br/assets/logo/android-chrome-72x72.png");
      background-position: center;
      background-repeat: no-repeat;
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
      -webkit-line-clamp: 3; /* number of lines to show */
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
