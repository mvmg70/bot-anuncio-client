<template>
  <ion-page id="PublishPage">
    <ion-header>
      <ion-toolbar v-if="formView !== 8">
        <div class="container">
          <ion-buttons slot="start">
            <ion-button size="small" color="danger" router-link="/" router-direction="back"> cancelar </ion-button>
          </ion-buttons>
        </div>
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
                  <ion-label>Qual CEP do seu anúncio?</ion-label>
                  <div class="input-container">
                    <ion-input placeholder="00000-000" autocomplete="postal-code" type="text" v-model="form.cep" clear-input v-maska="'#####-###'"></ion-input>
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
                          <ion-label>Bairro</ion-label>
                          <div class="input-container">
                            <ion-input type="text" v-model="getAdress" readonly></ion-input>
                          </div>
                        </ion-item>
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
                    <ion-input :placeholder="dynamicPlaceholder('title')" autocomplete="title" type="text" v-model="form.title"></ion-input>
                  </div>
                </ion-item>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-3" v-if="formView == 3">
                <ion-item class="custon-input" mode="md" lines="none">
                  <ion-label>Escreva sobre seu anúncio</ion-label>
                  <div class="input-container">
                    <ion-textarea rows="6" :placeholder="dynamicPlaceholder('description')" autocomplete="textarea" type="textarea" v-model="form.description"></ion-textarea>
                  </div>
                </ion-item>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-4" v-if="formView == 4">
                <ion-label class="large">Adicione Imagens do seu anúncio</ion-label>
                <div class="grid-images">
                  <div class="rect" v-for="(image, index) in form.images" :key="index">
                    <img :src="image" />
                    <div class="delete" @click="removeFile(index)">Remover</div>
                  </div>
                  <div class="rect plus" v-if="form.images.length < 6">
                    <input type="file" @change="loadFiles" ref="ImagesAd" accept="image/*" />
                    <ion-icon :src="getIcon('addOutline')" size="large"></ion-icon>
                  </div>
                </div>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-5" v-if="formView == 5">
                <ion-label class="large">Qual tipo do seu anúncio?</ion-label>
                <ion-grid>
                  <ion-row>
                    <ion-col size="6" v-for="(item, index) in typeValues" :key="index">
                      <div class="button-select" :class="{ selected: form.type === item.value }" @click="form.type = item.value">{{ item.title }}</div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-6" v-if="formView == 6">
                <ion-item class="custon-input" mode="md" lines="none">
                  <ion-label>Qual o valor?</ion-label>
                  <div class="input-container">
                    <ion-input placeholder="R$ 99,99" type="text" v-model="form.price"></ion-input>
                  </div>
                </ion-item>

                <transition name="expand-y">
                  <div v-if="form.price">
                    <ion-label class="large left">Qual tipo do seu anúncio?</ion-label>
                    <ion-grid>
                      <ion-row>
                        <ion-col size="6" v-for="(item, index) in paymentsValues" :key="index">
                          <div class="button-select" :class="{ selected: paymentSelected(item.value) }" @click="toglePayment(item.value)">{{ item.title }}</div>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                </transition>
              </div>
            </transition>
            <transition name="slide-x-left">
              <div class="form-7" v-if="formView == 7">
                <ion-label class="large">Qual a abrangencia do anúncio?</ion-label>
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
import { loadingController } from "@ionic/vue";
import { mapActions, mapGetters } from "vuex";
import { defineComponent } from "vue";
import { getCEP } from "@/services/api.service";

export default defineComponent({
  name: "PublishPage",
  data() {
    return {
      load: {
        cep: false,
      },
      form: {
        cep: "",
        locale: {},
        title: null,
        description: null,
        images: [],
        type: null,
        price: 0,
        paymentAccepted: [],
        typeLocation: null,
      },
      typeValues: [
        {
          value: "buy",
          title: "Compra",
        },
        {
          value: "sell",
          title: "Venda",
        },
        {
          value: "rent",
          title: "Aluguel",
        },
        {
          value: "change",
          title: "Troca",
        },
        {
          value: "donate",
          title: "Doação",
        },
        {
          value: "recommendation",
          title: "Indicação",
        },
        {
          value: "request",
          title: "Pedido",
        },
        {
          value: "notice",
          title: "Aviso",
        },
      ],
      paymentsValues: [
        {
          value: "pix",
          title: "Pix",
        },
        {
          value: "money",
          title: "Dinheiro",
        },
        {
          value: "card",
          title: "Crédito ou Débito",
        },
        {
          value: "bitcoin",
          title: "Bitcoin",
        },
        {
          value: "etherium",
          title: "Etherium",
        },
        {
          value: "others",
          title: "Outros",
        },
      ],
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
    };
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
    stateLoad(model, status) {
      this.load[model] = status;
    },
    async getCep() {
      this.stateLoad("cep", true);
      clearInterval(this.interval);
      let locale = await getCEP(`cep/${this.form.cep}`);
      this.form.locale = locale.data;
      this.stateLoad("cep", false);
    },
    async next() {
      if (this.formView == 7) {
        const loading = await loadingController.create({
          cssClass: "load-custom",
          spinner: "circular",
        });
        await loading.present();
        this.form.price = parseInt(this.form.price);

        await this.saveAds({ ads: this.form, id: this.currentUser.id });
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
    loadFiles(e) {
      let file = e.target.files[0];

      if (this.form.images.length < 6) {
        const Image = new FileReader();
        Image.onload = (e) => {
          this.form.images.push(e.target.result);
        };
        Image.readAsDataURL(file);
      }
    },
    removeFile(index) {
      this.form.images.splice(index, 1);
    },
    toglePayment(value) {
      console.log(value);
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
  },
  computed: {
    ...mapGetters("user", ["currentUser"]),
    isNextDisabled() {
      if (this.formView == 1 && this.form.locale.localidade) return false;
      if (this.formView == 2 && this.form.title) return false;
      if (this.formView == 3 && this.form.description) return false;
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
    max-width: 400px;
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
      min-width: 350px;
      flex-grow: 1;
      text-align: center;
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
    opacity: 0.5;
    transition: all 0.35s;
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
</style>
