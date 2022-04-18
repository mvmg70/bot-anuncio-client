/* Firebase */
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDCIScemvvy1mt49Bo3lavFxr7BRBBBuTQ",
  authDomain: "botanuncio-3951d.firebaseapp.com",
  projectId: "botanuncio-3951d",
  storageBucket: "botanuncio-3951d.appspot.com",
  messagingSenderId: "628593537932",
  appId: "1:628593537932:web:2d986efa9aec53f8211ca9",
  measurementId: "G-0S1CW2JYRK",
};
initializeApp(firebaseConfig);

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Storage } from "@ionic/storage";

import { IonicVue } from "@ionic/vue";

import * as IonComponents from "@ionic/vue";
import * as allIcons from "ionicons/icons";

import Maska from "maska";
import { createMetaManager } from "vue-meta";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./style/main.scss";

import "./registerServiceWorker";

const NODE_ENV = process.env.NODE_ENV;

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(Maska)
  .use(createMetaManager())
  .mixin({
    data() {
      return {
        node_env_mode: NODE_ENV,
        localStorage: new Storage(),
        i: allIcons,
        theme: "light",
        setting: {
          themeDevice: false,
          saveLogin: false,
        },
        themes: [
          { value: "light", name: "light", background: "#FCFDFC" },
          { value: "dark", name: "Dark", background: "#0a2239" },
        ],
        windowSize: {
          width: 0,
          height: 0,
        },
      };
    },
    created() {
      window.addEventListener("resize", this.handleResize);
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener("resize", this.handleResize);
    },
    methods: {
      getIcon(name) {
        return this.i[name];
      },

      handleResize() {
        this.windowSize.width = window.innerWidth;
        this.windowSize.height = window.innerHeight;
      },

      async changeTheme() {
        this.toggleClassTheme(this.theme);
        await this.setLocalStorage("theme", this.theme);
      },
      toggleClassTheme(theme) {
        this.themes.forEach((theme) => {
          document.body.classList.remove(theme.value);
        });
        document.body.classList.add(theme);
      },

      async deslogar() {
        this.setting.saveLogin = false;
        this.saveSettings();
        this.$router.replace("/");
        store.dispatch("auth/logout");
      },

      isTypeTransaction(type) {
        if (type == "buy") return "Compra";
        if (type == "sell") return "Venda";
        if (type == "rent") return "Aluguel";
        if (type == "change") return "Troca";
        if (type == "donate") return "Doação";
        if (type == "recommendation") return "Indicação";
        if (type == "request") return "Pedido";
        if (type == "notice") return "Aviso";
        return "";
      },
      isPaymentAccepted(type) {
        if (type == "pix") return "Pix";
        if (type == "money") return "Dinheiro";
        if (type == "card") return "Crédito ou Débito";
        if (type == "bitcoin") return "Bitcoin";
        if (type == "etherium") return "Etherium";
        if (type == "others") return "Outros";
        return "";
      },
      printMoney(money, type = false) {
        money = money.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        if (type == "buy") money = `Compro por até ${money}`;
        if (type == "sell") money = `Vendo por ${money}`;
        if (type == "rent") money = `Alugo por ${money}`;

        return money;
      },
      async saveSettings() {
        await this.setLocalStorage("config", this.setting);
      },

      async setLocalStorage(index, value) {
        await this.localStorage.set(index, JSON.stringify(value));
      },
      async getLocalStorage(index) {
        return JSON.parse(await this.localStorage.get(index));
      },
      async removeLocalStorage(index) {
        await this.localStorage.remove(index);
      },
      async clearLocalStorage() {
        await this.localStorage.clear();
      },
    },
    computed: {
      isMobile() {
        return this.windowSize.width <= 1024;
      },
    },
  });

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("L");

Object.keys(IonComponents).forEach((key) => {
  if (/^Ion[A-Z]\w+$/.test(key)) {
    app.component(key, IonComponents[key]);
  }
});

router.isReady().then(() => {
  app.mount("#app");
});

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch("auth/fetchUser", user).then(() => {
      store.state.auth.toPathAfterAuth ? router.replace(store.state.auth.toPathAfterAuth) : router.replace("/");
      store.dispatch("global/setLoadApp", false);
    });
  } else {
    store.dispatch("auth/noUser");
    store.dispatch("global/setLoadApp", false);
  }
});
