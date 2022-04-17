<template>
  <div>
    <div class="banner-conatiner" v-if="load">
      <ion-skeleton-text animated></ion-skeleton-text>
    </div>
    <div
      class="banner-conatiner"
      v-else
      :class="{ url: bannerData.url }"
      :style="`background-image: url(${isMobile ? bannerData.image_mobile : bannerData.image}`"
      @click="opemLink(bannerData.url)"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BannerSlider",
  props: {
    bannerData: {
      type: Object,
      default: () => {},
    },
    load: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    opemLink(url) {
      if (url) {
        let id = url.split("/");
        this.$router.push({
          name: "ViewAd",
          params: { id: id[4] },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.banner-conatiner {
  width: 100%;
  padding-top: 50%;
  border-radius: 12px;
  overflow: hidden;
  border: none;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  @media screen and (min-width: 1024px) {
    padding-top: calc((350 / 1280) * 100%);
  }
  ion-skeleton-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 350px;
    border-radius: 12px;
    margin: 0;
  }
  &.url:hover {
    cursor: pointer;
  }
}
</style>
