<template>
  <ion-app>
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
