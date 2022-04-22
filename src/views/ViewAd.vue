<template>
  <ion-page id="ViewAdPage">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" color="dark" text=""></ion-back-button>
        </ion-buttons>

        <ion-title>
          {{ ads ? ads.title : "Carregando ..." }}
        </ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="ads"
            color="light-gray"
            fill="none"
            class="only-icon"
            @click="
              share({
                title: ads.title,
                text: ads.title,
                url: 'as',
              })
            "
          >
            <ion-icon :src="getIcon('shareSocialOutline')"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="load" v-if="isLoading">
        <div class="container">
          <div class="header-banner">
            <ion-skeleton-text animated style="width: 100%; height: 350px"></ion-skeleton-text>
          </div>

          <div class="content">
            <div class="card-superior-info">
              <div class="title">
                <ion-skeleton-text animated style="width: 250px; height: 24px"></ion-skeleton-text>
              </div>
              <div class="price">
                <ion-skeleton-text animated style="width: 70px; height: 24px"></ion-skeleton-text>
              </div>
            </div>

            <div class="locale"><ion-skeleton-text animated style="width: 200px; height: 16px"></ion-skeleton-text></div>

            <div class="title-page left-text small"><ion-skeleton-text animated style="width: 150px; height: 16px"></ion-skeleton-text></div>
            <div class="container-box">
              <ion-skeleton-text animated style="width: 100px; height: 32px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 60px; height: 32px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 120px; height: 32px"></ion-skeleton-text>
            </div>

            <div class="descriprion">
              <ion-skeleton-text animated style="width: 95%; height: 24px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 98%; height: 24px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 97%; height: 24px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 100%; height: 24px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 99%; height: 24px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 96%; height: 24px"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 60%; height: 24px"></ion-skeleton-text>
            </div>
          </div>
        </div>
      </div>

      <section v-if="ads && !isLoading">
        <div class="header-banner">
          <Splide :options="imagesOptions">
            <SplideSlide v-for="(image, index) in ads.images" :key="index">
              <img :src="image" @click="expandImage(image)" alt="" />
            </SplideSlide>
          </Splide>
        </div>

        <div class="container">
          <div class="content">
            <div class="card-superior-info">
              <div class="title">{{ ads.title }}</div>
              <div class="price" v-if="ads.type != 'donate' && ads.type != 'recommendation' && ads.type != 'notice'">{{ printMoney(ads.price, ads.type) }}</div>
              <div class="type" v-else>{{ isTypeTransaction(ads.type) }}</div>
            </div>

            <div class="locale">{{ getAdress(ads.locale) }}</div>
            <div class="mb-4 title-page left-text small">Publicado em: {{ dateFormate(ads.created_at) }}</div>

            <div v-if="ads.type != 'donate' && ads.type != 'recommendation' && ads.type != 'notice'">
              <div class="title-page left-text small">Pagamentos Aceitos:</div>
              <div class="container-box">
                <div class="box" v-for="(item, index) in ads.paymentAccepted" :key="index" :style="`color: ${isPaymentAccepted(item).color}; background: ${isPaymentAccepted(item).background}`">
                  <img :src="isPaymentAccepted(item).image" alt="" />
                  {{ isPaymentAccepted(item).label }}
                </div>
              </div>
            </div>

            <div class="descriprion">
              <p>{{ ads.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/splide/dist/css/themes/splide-skyblue.min.css";
import moment from "moment";
moment.locale("pt-BR");

export default defineComponent({
  components: { Splide, SplideSlide },
  name: "ViewAdPage",
  data() {
    return {
      imagesOptions: {
        speed: 400,
        height: "350px",
        autoWidth: true,
        gap: 24,
        arrows: false,
        pagination: true,
        focus: "center",
        trimSpace: true,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        breakpoints: {
          780: {
            height: "200px",
          },
          1024: {
            height: "250px",
          },
        },
      },
      ads: null,
      isExpand: false,
      imageExpand: null,
      isLoading: false,
      fullURL: "",
    };
  },
  async mounted() {
    this.isLoading = true;
    let req = await this.getAdsById(this.$route.params.id);
    if (req.status === 404 || (req.data && req.data.active !== "approved")) {
      this.$router.replace({ name: "NotFound" });
      return;
    }

    this.ads = req.data;
    this.fullURL = new URL(location.href).href;
    this.moreViews(this.$route.params.id);
    this.isLoading = false;
  },
  methods: {
    ...mapActions("ad", ["getAdsById", "moreViews"]),
    getAdress(locale) {
      return `${locale.logradouro}, ${locale.bairro} - ${locale.localidade}`;
    },
    expandImage(image) {
      this.imageExpand = image;
      this.isExpand = true;
    },
    dateFormate(date) {
      return moment(date).format("LLLL");
    },
  },
});
</script>

<style lang="scss" scoped>
#ViewAdPage {
  .header-banner {
    border-radius: 12px;
    width: 100%;
    margin: 32px 0 64px;

    .splide__track {
      border-radius: 12px;
      overflow: hidden;
    }
    img {
      cursor: pointer;
      height: 100%;
      margin: 0 auto;
      border-radius: 12px;
    }
  }

  .title-page {
    margin-bottom: 8px;
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
        font-size: 1.5em;
        line-height: 100%;
        font-weight: 800;
        &::first-letter {
          text-transform: uppercase;
        }
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
        padding: 4px 8px;
        text-transform: capitalize;
        color: var(--ion-color-secondary-contrast);
        font-size: 1.1em;
        font-family: "Mulish" !important;
        font-style: normal;
        font-weight: 700;
        line-height: 100%;
        text-align: right;
        border-radius: 6px;
      }
    }
    .locale {
      font-family: "Questrial", sans-serif !important;
      font-size: 1em;
      font-weight: 400;
      text-transform: unset;
      opacity: 0.8;
      color: var(--ion-color-medium);
      line-height: 100%;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .descriprion {
      font-size: 1.1em;
      line-height: 125%;
      color: var(--ion-text-color);
      opacity: 0.9;
      margin-top: 24px;
      p {
        margin: 0;
        &::first-letter {
          text-transform: uppercase;
        }
      }
    }
  }
}

.modal-imagem-expand {
  --background: transparent !important;
  --width: 90%;
  --max-width: 1024px;
  --min-height: 50vh;
  --max-height: 80vh;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    border-radius: 12px;
  }
}
</style>
