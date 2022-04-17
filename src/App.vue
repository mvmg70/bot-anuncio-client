<template>
  <ion-app>
    <metainfo>
      <template v-slot:title="{ content }">{{ content ? `${content} | SITE_NAME` : `SITE_NAME` }}</template>
    </metainfo>
    <div class="label-fixed-dev" v-if="node_env_mode === 'development'">Ambiente de testes</div>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  async mounted() {
    this.hasCalled = true;
    this.localStorage.create();

    var settingInit = await this.getLocalStorage("config");
    var themeInit = await this.getLocalStorage("theme");

    settingInit ? (this.setting = settingInit) : await this.setLocalStorage("config", this.setting);

    if (themeInit) {
      this.theme = themeInit;
    }
    if (this.setting.themeDevice) {
      this.setDeviceTheme();
    }

    this.$store.dispatch("user/getUserLocale");
    this.changeTheme();
  },
});
</script>

<style lang="scss" scoped>
.label-fixed-dev {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999999999999999999;
  width: 100%;
  height: 20px;
  background: var(--ion-color-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  width: auto;

  position: fixed;
  inset: 0 auto auto 0;
  transform-origin: 100% 0;
  transform: translate(-29.3%) rotate(-45deg);
  box-shadow: 0 0 0 999px var(--ion-color-danger);
  clip-path: inset(0 -100%);
  opacity: 0.5;
}
</style>
