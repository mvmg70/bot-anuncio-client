<template>
  <ion-page id="PublishPage">
    <ion-header>
      <ion-toolbar v-if="formView !== 8">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" color="dark" text="" size="small"></ion-back-button>
        </ion-buttons>
        <ion-title>Publicar Anúncio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="main-section">
        <section class="progress-section">
          <div class="container">
            <div class="progress-bar">
              <ion-progress-bar :value="porcentage"></ion-progress-bar>
            </div>
          </div>
        </section>

        <section class="form-section">
          <div class="container container-form">
            <transition name="slide-x-left">
              <div class="form-1" v-if="formView == 1">
                <ion-item class="custon-input" mode="md" lines="none">
                  <ion-label>Qual o CEP melhor localiza sua área geográfica de atuação profissional?</ion-label>
                  <div class="input-container">
                    <ion-input placeholder="#####-###" inputmode="numeric" maxlength="8" autocomplete="postal-code" type="text" v-model="form.cep" clear-input></ion-input>
                    <ion-progress-bar type="indeterminate" v-if="load.cep"></ion-progress-bar>
                  </div>
                  <div class="botton-slot">
                    <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer">Não sabe seu CEP?</a>
                  </div>
                </ion-item>
                <transition name="expand-y">
                  <ion-grid class="ion-no-padding" v-if="form.locale.localidade">
                    <ion-row class="ion-no-padding">
                      <ion-col size="8">
                        <ion-item class="custon-input" mode="md" lines="none">
                          <ion-label>Cidade</ion-label>
                          <div class="input-container">
                            <ion-input type="text" v-model="form.locale.localidade" readonly></ion-input>
                          </div>
                        </ion-item>
                      </ion-col>
                      <ion-col size="4">
                        <ion-item class="custon-input" mode="md" lines="none">
                          <ion-label>Estado</ion-label>
                          <div class="input-container">
                            <ion-input type="text" v-model="form.locale.uf" readonly></ion-input>
                          </div>
                        </ion-item>
                      </ion-col>
                      <ion-col size="12">
                        <ion-item class="custon-input" mode="md" lines="none">
                          <ion-label>Logradouro, Bairro</ion-label>
                          <div class="input-container">
                            <ion-input type="text" v-model="getAdress" readonly></ion-input>
                          </div>
                        </ion-item>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </transition>
                <transition name="expand-y">
                  <ion-grid class="ion-no-padding" v-if="error.cep">
                    <ion-row class="ion-no-padding">
                      <ion-col size="12">
                        <p class="text--danger">CEP não encontrado! Verifique se o CEP está digitado corretamente e tente novamente.</p>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </transition>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-2" v-if="formView == 2">
                <ion-item class="custon-input" mode="md" lines="none">
                  <ion-label>Título do anúncio</ion-label>
                  <div class="input-container">
                    <ion-input :placeholder="dynamicPlaceholder('title')" autocomplete="title" type="text" v-model="form.title" clear-input></ion-input>
                  </div>
                </ion-item>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-3" v-if="formView == 3">
                <ion-label class="left">Escreva sobre seu anúncio</ion-label>
                <div>
                  <TextEditor v-model="form.description" @characterCount="setSizeEditor" />
                </div>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-4" v-if="formView == 4">
                <ion-label class="large">Adicione Imagens do seu anúncio</ion-label>
                <div class="grid-images">
                  <div class="rect" v-for="(image, index) in form.images" :key="index">
                    <img :src="image" alt="" />
                    <div class="delete" @click="removeFile(index)">Remover</div>
                  </div>
                  <div class="rect plus" v-if="form.images.length < 6">
                    <input type="file" @change="loadFiles" ref="ImagesAd" accept="image/*" />
                    <ion-icon :src="getIcon('addOutline')" size="large"></ion-icon>
                    <div class="obs">Máximo 10MB</div>
                  </div>
                </div>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-5" v-if="formView == 5">
                <ion-label class="large">O que você pretende com esse anúncio?</ion-label>
                <ion-grid>
                  <ion-row>
                    <ion-col size="6" v-for="(item, index) in typeValues" :key="index">
                      <div class="button-select" :class="{ selected: form.type === item.value }" @click="form.type = item.value">{{ item.labelPublish }}</div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                <transition name="expand-y">
                  <ion-item class="custon-input check no-ripple" mode="md" lines="none" v-if="form.type == 'rent'">
                    <ion-checkbox mode="md" v-model="form.wantRent"> </ion-checkbox>
                    <ion-label> Estou buscando um aluguel </ion-label>
                  </ion-item>
                </transition>
                <transition name="expand-y">
                  <ion-item class="custon-input check no-ripple" mode="md" lines="none" v-if="form.type == 'sell'">
                    <ion-checkbox mode="md" v-model="form.priceVariable"> </ion-checkbox>
                    <ion-label> Esse anúncio tem vários valores. </ion-label>
                  </ion-item>
                </transition>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-6" v-if="formView == 6">
                <ion-item class="custon-input" mode="md" lines="none">
                  <ion-label>Qual o valor do anúncio, em Reais (R$)?</ion-label>
                  <p class="obs" v-if="form.priceVariable">Como seu anúncio tem vários valores, informe apenas o menor.</p>

                  <div class="input-container">
                    <ion-input placeholder="R$ 99,99" type="text" v-model="form.price"></ion-input>
                  </div>
                </ion-item>

                <transition name="expand-y">
                  <div v-if="form.price">
                    <ion-label class="large left">Quais pamaentos você aceita?</ion-label>
                    <ion-grid>
                      <ion-row>
                        <ion-col size="6" v-for="(item, index) in paymentsValues" :key="index">
                          <div class="button-select" :class="{ selected: paymentSelected(item.value) }" @click="toglePayment(item.value)">
                            <img :src="item.image" alt="" />
                            {{ item.label }}
                          </div>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                </transition>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-7" v-if="formView == 7">
                <ion-label class="large">O anúncio será visível em qual área geográfica?</ion-label>
                <ion-grid>
                  <ion-row>
                    <ion-col size="6" v-for="(item, index) in typeLocationValues" :key="index">
                      <div class="button-select" :class="{ selected: form.typeLocation === item.value }" @click="form.typeLocation = item.value">{{ item.title }}</div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
            </transition>

            <transition name="slide-x-left">
              <div class="finish" v-if="formView == 8">
                <div class="conatiner">
                  <div class="text-container">
                    <img src="../assets/images/check.svg" alt="" />
                    <div class="title">Concluído</div>
                    <div class="subtitle">Seu anúncio foi enviado para análise, em breve você receberá uma confirmação em seu e-mail.</div>
                  </div>
                  <ion-button router-link="/" color="secondary" expand="block" router-direction="back"> Voltar para o início </ion-button>
                </div>
              </div>
            </transition>
          </div>
        </section>

        <section class="navigation-section">
          <div class="container buttons-align">
            <ion-button @click="back()" :disabled="formView <= 1" v-if="formView > 1">
              <ion-icon :src="getIcon('chevronBackOutline')"></ion-icon>
              Voltar
            </ion-button>
            <ion-button @click="next()" :disabled="isNextDisabled"> {{ formView < 7 ? "Continuar" : "Finalizar" }} <ion-icon :src="getIcon('chevronForwardOutline')"></ion-icon> </ion-button>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { loadingController, toastController } from "@ionic/vue";
import { mapActions, mapGetters } from "vuex";
import { defineComponent } from "vue";
import { getCEP } from "@/services/api.service";
import { upload } from "../services/upload.service";
import { mask } from "vue-the-mask";
import TextEditor from "../components/TextEditor.vue";

export default defineComponent({
  name: "PublishPage",
  directives: { mask },
  components: { TextEditor },
  data() {
    return {
      load: {
        cep: false,
      },
      error: {
        cep: false,
      },
      form: {
        cep: "",
        locale: {},
        title: null,
        description: null,
        images: [],
        type: null,
        price: null,
        paymentAccepted: [],
        typeLocation: null,
        wantRent: false,
        priceVariable: false,
      },
      typeValues: [],
      paymentsValues: [],
      typeLocationValues: [
        {
          value: "proximity",
          title: "Bairros próximos",
        },
        {
          value: "county",
          title: "Meu município",
        },
        {
          value: "state",
          title: "Meu estado",
        },
        {
          value: "country",
          title: "Todo Brasil",
        },
        {
          value: "word",
          title: "Internacional",
        },
      ],
      formView: 1,
      interval: null,
      timeBound: 500,
      imagesFile: [],
      editorSize: 0,
    };
  },
  mounted() {
    this.paymentsValues = this.isPaymentAccepted("allArray");
    this.typeValues = this.isTypeTransaction("allArray");
  },
  watch: {
    "form.cep"(newValue) {
      clearInterval(this.interval);
      if (newValue.length < 8) {
        this.form.locale = {};
        return;
      }
      this.interval = setInterval(() => {
        this.getCep();
      }, this.timeBound);
    },
  },
  methods: {
    ...mapActions("ad", ["saveAds"]),
    async openToast(message) {
      const toast = await toastController.create({
        message: message,
        duration: 4000,
      });
      return toast.present();
    },
    stateLoad(model, status) {
      this.load[model] = status;
    },
    async getCep() {
      this.stateLoad("cep", true);
      clearInterval(this.interval);
      this.error.cep = false;
      await getCEP(`cep/${this.form.cep}`).then((cep) => {
        if (cep.status == 200) {
          this.form.locale = cep.data;
        } else {
          this.error.cep = true;
        }
      });

      this.stateLoad("cep", false);
    },
    async next() {
      if (this.formView == 7) {
        const loading = await loadingController.create({
          cssClass: "load-custom",
          spinner: "circular",
        });
        await loading.present();

        this.form.price = Number(this.form.price.replace(",", "."));

        var images = this.imagesFile;
        var links = [];

        for (let index in images) {
          await upload(images[index]).then((link) => {
            links.push(link);
          });
        }

        this.form.images = links;

        await this.saveAds(this.form);
        this.formView += 1;
        await loading.dismiss();
      } else if (this.formView == 5 && (this.form.type === "donate" || this.form.type === "notice" || this.form.type === "recommendation")) {
        this.formView += 2;
      } else {
        this.formView += 1;
      }
    },
    back() {
      this.formView -= 1;
    },
    dynamicPlaceholder(type) {
      if (type == "title") {
        let titles = ["Um título chamativo e direto", "Bola de vôlei", "Apartamento"];
        return titles[Math.floor(Math.random() * titles.length)];
      }
      if (type == "description") {
        let titles = ["Uma descrição mais detalhada do seu anuncio, com informaçõoes úteis para quem lê..."];
        return titles[Math.floor(Math.random() * titles.length)];
      }
      return "";
    },
    async loadFiles(e) {
      let file = e.target.files[0];

      if (file.size > 10485760) {
        this.openToast("O arquivo é muito grande, escolha outro com no máximo 10MB!");
        return;
      }

      if (this.form.images.length < 6) {
        this.form.images.push(URL.createObjectURL(file));
        this.imagesFile.push(file);
      }
    },
    removeFile(index) {
      this.form.images.splice(index, 1);
      this.imagesFile.splice(index, 1);
    },
    toglePayment(value) {
      let indexPayment = this.form.paymentAccepted.indexOf(value);
      if (indexPayment == -1) {
        this.form.paymentAccepted.push(value);
      } else {
        this.form.paymentAccepted.splice(indexPayment, 1);
      }
    },
    paymentSelected(value) {
      if (this.form.paymentAccepted.indexOf(value) != -1) return true;
      return false;
    },
    setSizeEditor(value) {
      this.editorSize = Number(value);
    },
  },
  computed: {
    ...mapGetters("user", ["currentUser"]),
    isNextDisabled() {
      if (this.formView == 1 && this.form.locale.localidade) return false;
      if (this.formView == 2 && this.form.title) return false;
      if (this.formView == 3 && this.editorSize >= 100) return false;
      if (this.formView == 4 && this.form.images.length >= 1) return false;
      if (this.formView == 5 && this.form.type) return false;
      if (this.formView == 6 && this.form.price && this.form.paymentAccepted.length >= 1) return false;
      if (this.formView == 7 && this.form.typeLocation) return false;
      return true;
    },
    getAdress() {
      return `${this.form.locale.logradouro}, ${this.form.locale.bairro}`;
    },
    porcentage() {
      return (1 / 7) * (this.form.locale.localidade ? this.formView : 0);
    },
  },
});
</script>

<style lang="scss" scoped>
#PublishPage {
  .main-section {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    .form-section {
      flex-grow: 1;
    }
  }

  .container-form {
    width: 100%;
    max-width: 700px;
    height: 100%;
    overflow-y: visible;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress-bar {
    ion-progress-bar {
      height: 10px;
      border-radius: 5px;
      .progress {
        border-radius: 5px;
      }
    }
  }

  .custon-input {
    .botton-slot {
      width: 100%;
      text-align: right;
      margin: 4px 0 0;
      font-size: 0.9em;
      opacity: 0.8;
    }
  }

  .form-section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .form-1,
    .form-2,
    .form-3,
    .form-4,
    .form-5,
    .form-6,
    .form-7 {
      width: 100%;
      flex-grow: 1;
      max-width: 400px;
    }
    .form-3 {
      max-width: none;
    }
  }

  ion-label.large {
    font-size: 1.05em;
  }
  ion-label.left {
    text-align: left;
    width: 100% !important;
    margin-left: 0;
  }

  .grid-images {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 1rem;
    .rect {
      border: 1px solid #a7b6be;
      color: #a7b6be;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 1rem;
      overflow: hidden;
      &::before {
        content: "";
        padding-bottom: 100%;
      }
      &.plus {
        &:hover {
          ion-icon {
            transition: all 0.5s;
            zoom: 1.5;
            color: var(--ion-color-primary);
          }
        }
        input {
          cursor: pointer;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          overflow: hidden;
          z-index: 9;
        }
        .obs {
          color: var(--ion-color-primary);
          position: absolute;
          bottom: 4px;
          left: 4px;
          margin: 0;
          width: calc(100% - 8px);
          text-align: center;
        }
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
      }
      .delete {
        position: absolute;
        left: 4px;
        bottom: 4px;
        width: calc(100% - 8px);
        height: 24px;
        border-radius: 8px;
        background: rgba(var(--ion-color-primary-rgb), 0.75);
        font-size: 0.8em;
        text-transform: uppercase;
        color: var(--ion-color-primary-contrast);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }

  .button-select {
    height: 48px;
    border: 1px solid rgba(var(--ion-color-medium-rgb), 0.35);
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    opacity: 0.5;
    transition: all 0.35s;
    img {
      height: 20px;
    }
    &.selected {
      border-color: var(--ion-color-primary-tint);
      background-color: rgba(var(--ion-color-primary-rgb), 0.05);
      font-weight: 700 !important;
      font-size: 1.1em;
      opacity: 1;
    }
  }

  .buttons-align {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    ion-button {
      flex-grow: 1;
      max-width: 350px;
    }
  }

  .input-container {
    border: 1px solid #a7b6be;
  }

  .finish {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background: #e31c43;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 999;
    .conatiner {
      max-width: 400px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      .text-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        flex-direction: column;
      }
      .title {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 700;
        font-size: 4em;
        line-height: 100%;
        color: #ffffff;
      }
      .subtitle {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 700;
        font-size: 1em;
        line-height: 130%;
        text-align: center;
        width: 80%;
        color: #f8f8f7;
      }
    }
    ion-button {
      position: absolute;
      bottom: 64px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      max-width: 350px;
    }
  }
}
.obs {
  margin: 0;
  font-size: 0.85em;
  opacity: 0.8;
  margin-bottom: 8px;
}
</style>
