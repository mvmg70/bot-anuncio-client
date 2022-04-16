import { createStore } from "vuex";
import { authStore } from "./auth.module";
import { globalStore } from "./global.module";
import { bannerStore } from "./banner.module";
import { userStore } from "./user.module";
import { adStore } from "./ad.module";

export default createStore({
  modules: {
    auth: authStore,
    global: globalStore,
    banner: bannerStore,
    ad: adStore,
    user: userStore,
  },
});
