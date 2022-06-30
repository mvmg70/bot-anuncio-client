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
            <masonry-wall :items="allAds" :column-width="300" :padding="16" style="display: flex; gap: 16px">
              <template #default="{ item }">
                <CardItem :adsData="item" @click="opemAd(item.id)" />
              </template>
            </masonry-wall>
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
import CardItem from "../components/CardItem.vue";

export default defineComponent({
  components: { Logo, Banner, Splide, SplideSlide, SearchBar, CardItem },
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
    box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.07), 0px 11.5911px 10.0172px rgba(0, 0, 0, 0.035);
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
.cards-content {
  margin-bottom: 48px;
  width: 100%;
  .masonry-wall {
    width: 100% !important;
    .masonry-column {
      width: 100% !important;
      .masonry-item {
        width: 100% !important;
        overflow: hidden;
      }
    }
  }
}
</style>
