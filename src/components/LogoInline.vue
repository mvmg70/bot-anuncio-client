<template>
  <div class="logo-conatiner" :class="[color, iconOnly ? 'iconOnly' : '']">
    <img src="/assets/logo/android-chrome-72x72.png" alt="" />
    <div class="app-name">
      Bot
      <span> Anúncio </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogoInline",
  props: {
    iconOnly: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "default",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.logo-conatiner {
  display: flex;
  align-items: center;
  gap: 6px;
  img {
    height: 16px;
    width: 16px;
  }
  .app-name {
    color: var(--ion-color-primary);
    span {
      margin-left: -6px;
      color: var(--ion-color-secondary);
    }
  }
  &.white {
    .app-name {
      color: var(--ion-color-light);
      span {
        color: var(--ion-color-light);
      }
    }
    img {
      filter: grayscale(1);
    }
  }
  &.iconOnly {
    gap: 0;
    .app-name {
      display: none;
    }
    img {
      height: 32px;
      width: 32px;
    }
  }
}
</style>
