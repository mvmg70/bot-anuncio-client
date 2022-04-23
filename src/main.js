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

import { createMetaManager } from "vue-meta";
import property from "./assets/property.json";

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
                textPrint: "",
                socialShareValues: {
                    url: "https://botanuncio.com.br/",
                    title: "BotAnuncio — Anuncie com facilidade!",
                    text: "Venda, compre, doe e muito mais! Mostre seu anúncio ao mundo",
                },
                networks: [
                    { url: "", network: "facebook", name: "Facebook", icon: "http://localhost:8100/assets/icons/facebook.png" },
                    { url: "", network: "linkedin", name: "LinkedIn", icon: "http://localhost:8100/assets/icons/linkedin.png" },
                    { url: "", network: "messenger", name: "Messenger", icon: "http://localhost:8100/assets/icons/messenger.png" },
                    { url: "", network: "telegram", name: "Telegram", icon: "http://localhost:8100/assets/icons/telegram.png" },
                    { url: "", network: "twitter", name: "Twitter", icon: "http://localhost:8100/assets/icons/twitter.png" },
                    { url: "", network: "whatsapp", name: "Whatsapp", icon: "http://localhost:8100/assets/icons/whatsapp.png" },
                ],
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

            isTypeTransaction(type, isWant = false) {
                let transactions = property.typeTransaction;
                if (type === "allArray") {
                    let index;
                    while (index != -1) {
                        index = transactions.findIndex((model) => model.onPublish == false);
                        if (index != -1) transactions.splice(index, 1);
                    }
                    return transactions;
                }
                if (type == "rent" && isWant) return transactions.find((model) => model.value == "rentWant");
                return transactions.find((model) => model.value == type);
            },
            isPaymentAccepted(type) {
                let payments = property.paymentsAccepted;
                if (type === "allArray") {
                    let index;
                    while (index != -1) {
                        index = payments.findIndex((model) => model.onPublish == false);
                        if (index != -1) payments.splice(index, 1);
                    }
                    return payments;
                }
                return payments.find((price) => price.value == type);
            },
            printMoney(money, type = false, isWant = false, isVariable = false) {
                money = money.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                if (type == "buy") money = `Compro por até ${money}`;
                if (type == "sell" && !isVariable) money = `Vendo por ${money}`;
                if (type == "sell" && isVariable) money = `A partir de ${money}`;
                if (type == "rent" && !isWant) money = `Alugo por ${money}`;
                if (type == "rent" && isWant) money = `Busco para alugar por até ${money}`;

                return money;
            },
            async socialShare(data) {
                const shareData = {
                    title: data.title,
                    text: data.text.length > 150 ? `${data.text.substr(0, 150)}...` : data.text,
                    url: data.url,
                };

                if (navigator.canShare) {
                    await navigator.share(shareData).catch((error) => console.log(error));
                } else {
                    let defaultUrl = [
                        "https://www.facebook.com/sharer/sharer.php?u=CHANGE_URL&title=CHANGE_TITILE&description=CHANGE_DESCRIPTION",
                        "https://www.linkedin.com/sharing/share-offsite/?url=CHANGE_URL",
                        "fb-messenger://share/?link=CHANGE_URL",
                        "https://t.me/share/url?url=CHANGE_URL&text=CHANGE_TITILE%0D%0ACHANGE_DESCRIPTION",
                        "https://twitter.com/intent/tweet?text=CHANGE_TITILE&url=CHANGE_URL&hashtags=@hCHANGE_TITILEu",
                        "https://api.whatsapp.com/send?text=CHANGE_TITILE%0D%0ACHANGE_URL%0D%0ACHANGE_DESCRIPTION",
                    ];
                    let index = 0;
                    defaultUrl.forEach((element) => {
                        let link = element.replace(/CHANGE_URL/g, shareData.url);
                        link = link.replace(/CHANGE_TITILE/g, shareData.title);
                        link = link.replace(/CHANGE_DESCRIPTION/g, shareData.text);
                        this.networks[index].url = link;
                        index++;
                    });

                    this.socialShareValues = shareData;
                    return true;
                }
                return false;
            },
            copyToClipboard(text) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                } else {
                    var dummy = document.createElement("textarea");
                    document.body.appendChild(dummy);
                    dummy.value = text;
                    dummy.select();
                    document.execCommand("copy");
                    document.body.removeChild(dummy);
                }
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
            if (store.state.auth.toPathAfterAuth) {
                router.replace(store.state.auth.toPathAfterAuth);
                store.dispatch("auth/deletePathAfterLogin");
            }
            store.dispatch("global/setLoadApp", false);
        });
    } else {
        store.dispatch("auth/noUser");
        store.dispatch("global/setLoadApp", false);
    }
});