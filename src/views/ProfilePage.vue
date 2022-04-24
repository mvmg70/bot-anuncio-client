<template>
  <ion-page id="ProfilePage">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" color="dark" text=""></ion-back-button>
        </ion-buttons>

        <ion-title> Perfil </ion-title>

        <ion-buttons slot="end">
          <ion-button color="light-gray" fill="none" class="only-icon">
            <ion-icon :src="getIcon('shareSocialOutline')"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="hero-background">
        <div class="container">
          <div class="buttons">
            <ion-button size="small" @click="opemCompleteProfile()" v-if="!currentUser.completed"> Complete seu perfil </ion-button>
          </div>
        </div>
      </div>

      <section class="user-info">
        <div class="container" v-if="isLoadingUser">
          <div class="grid-profile">
            <div class="picture">
              <ion-skeleton-text animated></ion-skeleton-text>
            </div>
            <div class="infos">
              <div class="name"><ion-skeleton-text animated></ion-skeleton-text></div>
              <div class="email"><ion-skeleton-text animated></ion-skeleton-text></div>
              <div class="number"><ion-skeleton-text animated></ion-skeleton-text></div>
              <div class="infos-count">
                <ion-grid class="ion-no-padding">
                  <ion-row class="ion-no-padding">
                    <ion-col size="4" v-for="item in 3" :key="item">
                      <div class="value"><ion-skeleton-text animated></ion-skeleton-text></div>
                      <div class="title"><ion-skeleton-text animated></ion-skeleton-text></div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
            </div>
          </div>
        </div>
        <div class="container" v-else>
          <div class="grid-profile">
            <div class="picture">
              <img :src="getImageLink()" referrerpolicy="no-referrer" alt="" />
            </div>
            <div class="infos">
              <div class="name">{{ currentUser.displayName }}</div>
              <div class="email">{{ currentUser.email }}</div>
              <div class="number">{{ currentUser.phone }}</div>
              <div class="infos-count">
                <ion-grid class="ion-no-padding">
                  <ion-row class="ion-no-padding">
                    <ion-col size="4">
                      <div class="value">{{ getNumberAds() }}</div>
                      <div class="title">Publicados</div>
                    </ion-col>
                    <ion-col size="4">
                      <div class="value">{{ getNumberApproved() }}</div>
                      <div class="title">Vizualizações</div>
                    </ion-col>
                    <ion-col size="4">
                      <div class="value">{{ getDaysRegister() }}</div>
                      <div class="title">Dias</div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cards-container">
        <div class="container" v-if="isLoadingMyAds">
          <ion-grid>
            <ion-row>
              <ion-col size="6" sizeSm="4" size-md="3" v-for="item in 12" :key="item">
                <ion-skeleton-text animated class="ad-card-cover"></ion-skeleton-text>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div class="container" v-else>
          <ion-grid>
            <ion-row>
              <ion-col size="6" sizeSm="4" size-md="3" v-for="ads in allMyAds" :key="ads.id">
                <div class="ad-card-cover" @click="opemViewAd(ads)">
                  <img :src="ads.images[0]" alt="" />
                  <div class="title">{{ ads.title }}</div>
                  <div class="views"><ion-icon :src="getIcon('eyeOutline')"></ion-icon> {{ ads.views }}</div>
                  <div class="isActive" :class="[ads.active]">{{ status(ads.active) }}</div>
                </div>
              </ion-col>
              <ion-col size="6" sizeSm="4" size-md="3">
                <div class="ad-card-cover" @click="$router.push({ name: 'Publish' })">
                  <div class="plus"><ion-icon :src="getIcon('addOutline')"></ion-icon> Publicar anúncio</div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </section>

      <!-- Edit Modal -->
      <ion-modal :is-open="viewOpem" @didDismiss="viewOpem = false" class="viewAD">
        <ion-content>
          <div class="content-modal">
            <section class="title-modal">
              <div class="title">{{ viewAd.title }}</div>
              <div class="close-button" @click="viewOpem = false" />
            </section>

            <section class="body-modal">
              <transition name="expand-y">
                <div v-if="viewAd && isChangeValue" class="edit">
                  <div class="container">
                    <ion-grid>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>CEP</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.cep"></ion-input>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="8">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Cidade</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.locale.localidade"></ion-input>
                            </div>
                          </ion-item>
                        </ion-col>
                        <ion-col size="4">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Estado</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.locale.uf"></ion-input>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Logradouro, Bairro</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="getAdressEdit"></ion-input>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Título</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.title"></ion-input>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Descrição</ion-label>
                            <div class="input-container">
                              <ion-textarea rows="6" type="textarea" v-model="editAD.description"></ion-textarea>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12" disabled>
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label class="large">Imagens</ion-label>
                            <div class="grid-images">
                              <div class="rect" v-for="(image, index) in editAD.images" :key="index">
                                <img :src="image" alt="" />
                              </div>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Tipo do anúncio</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.type"></ion-input>
                            </div>
                          </ion-item>

                          <transition name="expand-y">
                            <ion-item class="custon-input check no-ripple" mode="md" lines="none" v-if="editAD.type == 'rent'" disabled>
                              <ion-checkbox mode="md" v-model="editAD.wantRent"> </ion-checkbox>
                              <ion-label> Estou buscando um aluguel </ion-label>
                            </ion-item>
                          </transition>
                          <transition name="expand-y">
                            <ion-item class="custon-input check no-ripple" mode="md" lines="none" v-if="editAD.type == 'sell'" disabled>
                              <ion-checkbox mode="md" v-model="editAD.priceVariable"> </ion-checkbox>
                              <ion-label> Esse anúncio tem vários valores. </ion-label>
                            </ion-item>
                          </transition>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none">
                            <ion-label>Valor do anúncio</ion-label>
                            <p class="obs" v-if="editAD.priceVariable">Esse é o menor valor do seu produto</p>

                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.price"></ion-input>
                            </div>
                          </ion-item>

                          <ion-label class="large left">Pagametos aceitos</ion-label>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Pagametos aceitos</ion-label>
                            <div class="container-box">
                              <div
                                class="box"
                                v-for="(item, index) in editAD.paymentAccepted"
                                :key="index"
                                :style="`color: ${isPaymentAccepted(item).color}; background: ${isPaymentAccepted(item).background}`"
                              >
                                <img :src="isPaymentAccepted(item).image" alt="" />
                                {{ isPaymentAccepted(item).label }}
                              </div>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                      <ion-row>
                        <ion-col size="12">
                          <ion-item class="custon-input" mode="md" lines="none" disabled>
                            <ion-label>Visibilidade do anúncio</ion-label>
                            <div class="input-container">
                              <ion-input type="text" v-model="editAD.typeLocation"></ion-input>
                            </div>
                          </ion-item>
                        </ion-col>
                      </ion-row>
                    </ion-grid>
                  </div>
                </div>
              </transition>

              <transition name="expand-y">
                <div v-if="viewAd && !isChangeValue">
                  <div class="header-banner">
                    <Splide :options="imagesOptions">
                      <SplideSlide v-for="(image, index) in viewAd.images" :key="index">
                        <img :src="image" alt="" />
                      </SplideSlide>
                    </Splide>
                  </div>

                  <div class="container">
                    <div class="content">
                      <div class="card-superior-info">
                        <div class="title">{{ viewAd.title }}</div>
                        <div class="price" v-if="viewAd.type != 'donate' && viewAd.type != 'recommendation' && viewAd.type != 'notice'">
                          {{ printMoney(viewAd.price, viewAd.type, viewAd.wantRent, viewAd.priceVariable) }}
                        </div>
                        <div class="type" v-else>{{ isTypeTransaction(viewAd.type) }}</div>
                      </div>

                      <div class="locale">{{ getAdress(viewAd.locale) }}</div>
                      <div class="mb-4 title-page left-text small">Publicado em: {{ dateFormate(viewAd.created_at) }}</div>

                      <div v-if="viewAd.type != 'donate' && viewAd.type != 'recommendation' && viewAd.type != 'notice'">
                        <div class="title-page left-text small">Pagamentos Aceitos:</div>
                        <div class="container-box">
                          <div
                            class="box"
                            v-for="(item, index) in viewAd.paymentAccepted"
                            :key="index"
                            :style="`color: ${isPaymentAccepted(item).color}; background: ${isPaymentAccepted(item).background}`"
                          >
                            <img :src="isPaymentAccepted(item).image" alt="" />
                            {{ isPaymentAccepted(item).label }}
                          </div>
                        </div>
                      </div>

                      <div class="descriprion">
                        <p>{{ viewAd.description }}</p>
                      </div>

                      <div class="divider"></div>

                      <ion-list lines="full" class="table-list">
                        <ion-item>
                          <ion-label class="ion-text-wrap">
                            <b>Status do anúncio</b>
                            <p>{{ status(viewAd.active) }}</p>
                          </ion-label>
                        </ion-item>

                        <ion-item>
                          <ion-label class="ion-text-wrap">
                            <b>Total de vizualização</b>
                            <p>{{ viewAd.views }}</p>
                          </ion-label>
                        </ion-item>
                        <ion-item>
                          <ion-label class="ion-text-wrap">
                            <b>Última vez vizualização</b>
                            <p>{{ dateFormate(viewAd.updated_at) }}</p>
                          </ion-label>
                        </ion-item>
                        <ion-item lines="none">
                          <ion-label class="ion-text-wrap">
                            <b>Data de publicação</b>
                            <p>{{ dateFormate(viewAd.created_at) }}</p>
                          </ion-label>
                        </ion-item>
                      </ion-list>
                    </div>
                  </div>
                </div>
              </transition>
            </section>

            <section class="footer-modal">
              <ion-button color="success" size="small" @click="showEdit()" v-if="!isChangeValue"> Editar </ion-button>
              <ion-button color="dark" fill="none" size="small" @click="cancelEdit()" v-if="isChangeValue"> Cancelar </ion-button>
              <div class="spacer"></div>
              <ion-button color="success" size="small" @click="saveEdit()" v-if="isChangeValue"> Salvar </ion-button>
              <ion-button color="danger" size="small" @click="deleteAd(viewAd.id)"> Deletar </ion-button>
            </section>
          </div>
        </ion-content>
      </ion-modal>

      <!-- Complete Modal -->
      <ion-modal :is-open="completeOpem" @didDismiss="completeOpem = false">
        <ion-content>
          <div class="modal-template">
            <div class="title-area">
              <ion-title>Complete seu Perfil</ion-title>
            </div>

            <ion-progress-bar :value="percentageProfile"></ion-progress-bar>

            <div class="stepers">
              <div class="step" v-if="completeStep == 1">
                <div class="container">
                  <div class="description">Valide um número de celular para que os interessados em seus anuncios possam entrar em cotato</div>

                  <div class="center">
                    <ion-item class="custon-input" mode="md" lines="none">
                      <ion-label>Número de Celular</ion-label>
                      <div class="input-container">
                        <ion-input placeholder="Seu melhor telefone" autocomplete="tel" inputmode="tel" pattern="tel" type="tel" v-model="user.phone"> </ion-input>
                      </div>
                    </ion-item>
                    <ion-item class="custon-input check no-ripple" mode="md" lines="none">
                      <ion-checkbox mode="md" v-model="user.has_whatsapp"> </ion-checkbox>
                      <ion-label> Possui Whatsapp</ion-label>
                    </ion-item>
                    <ion-item class="custon-input check no-ripple" mode="md" lines="none">
                      <ion-checkbox mode="md" v-model="user.has_telegram"> </ion-checkbox>
                      <ion-label> Possui Telegram </ion-label>
                    </ion-item>
                  </div>
                </div>
              </div>
              <div class="step" v-if="completeStep == 2">
                <div class="container">
                  <div class="description">Você precisa ter mais que 18 anos para responder pelos anúncios</div>
                  <div class="center">
                    <ion-item class="custon-input" mode="md" lines="none">
                      <ion-label>Data de Nascimento</ion-label>
                      <div class="input-container">
                        <ion-input placeholder="Sua data de nascimento" id="bithdayInput" v-model="user.bithday" readonly> </ion-input>
                        <ion-popover trigger="bithdayInput" :show-backdrop="false" size="cover">
                          <ion-datetime locale="pt-BR" size="cover" presentation="date" @ionChange="(ev) => (user.bithday = formatDate(ev.detail.value))" />
                        </ion-popover>
                      </div>
                    </ion-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="navigation">
              <ion-button @click="completeStep = 1" v-if="completeStep == 2"> Voltar </ion-button>
              <div></div>
              <ion-button @click="nextStep()"> Proximo </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { loadingController, toastController } from "@ionic/vue";
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/splide/dist/css/themes/splide-skyblue.min.css";
import moment from "moment";
moment.locale("pt-BR");
import md5 from "md5";

export default defineComponent({
  name: "ProfilePage",
  components: { Splide, SplideSlide },
  data() {
    return {
      viewOpem: false,
      completeOpem: false,
      completeStep: 2,
      isChangeValue: false,
      viewAd: {},
      editAD: {},
      user: {
        phone: "",
        has_whatsapp: false,
        has_telegram: false,
        bithday: "",
      },
      imagesOptions: {
        speed: 400,
        height: "250px",
        autoWidth: true,
        gap: 24,
        arrows: false,
        pagination: true,
        focus: "center",
        trimSpace: true,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    };
  },
  mounted() {
    this.getMyAds();
  },
  methods: {
    ...mapActions("user", ["getMyAds", "update"]),
    ...mapActions("ad", ["deleteAds", "aditAds"]),
    getImageLink() {
      if (this.currentUser.photoURL) return this.currentUser.photoURL;

      const address = String(this.currentUser.email).trim().toLowerCase();
      const hash = md5(address);

      return `https://www.gravatar.com/avatar/${hash}?s=150`;
    },
    status(status) {
      if (status == "approved") return "Publicado";
      if (status == "reproved") return "Negado";
      return "Aguardando avaliação";
    },
    getDaysRegister() {
      var created = moment(this.currentUser.created_at, "YYYY-MM-DD");
      var now = moment().startOf("day");
      return moment.duration(now.diff(created)).asDays();
    },
    getNumberAds() {
      return this.allMyAds.length;
    },
    getNumberApproved() {
      let ads = this.allMyAds;
      let views = 0;
      ads.forEach((element) => {
        if (element.active == "approved") views += element.views;
      });
      return views;
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    opemCompleteProfile() {
      if (!this.currentUser.bithday) this.completeStep = 2;
      if (!this.currentUser.phone) this.completeStep = 1;
      this.completeOpem = true;
    },
    opemViewAd(ad) {
      this.cancelEdit();
      this.viewAd = ad;
      this.viewOpem = true;
    },
    showEdit() {
      this.editAD = JSON.parse(JSON.stringify(this.viewAd));
      this.isChangeValue = true;
    },
    cancelEdit() {
      this.editAD = {};
      this.isChangeValue = false;
    },
    async nextStep() {
      const loading = await loadingController.create({
        cssClass: "load-custom",
        spinner: "circular",
      });

      await loading.present();

      if (this.completeStep == 1) {
        if (this.user.phone) {
          let phoneChange = {
            phone: this.user.phone,
            has_whatsapp: this.user.has_whatsapp,
            has_telegram: this.user.has_telegram,
          };

          this.update(phoneChange)
            .then(
              () => {
                loading.dismiss();
              },
              (error) => {
                loading.dismiss();
                console.error(error);
                //this.$toast.error({
                //  title: "Erro ao salvar tente novamente",
                //  description: (error.response && error.response.data) || error.message || error.toString(),
                //});
              }
            )
            .catch((error) => {
              loading.dismiss();
              console.error(error.code);
              console.error(error.message);
            });
        }
      }
      if (this.completeStep == 2) {
        if (this.user.bithday) {
          let bithdayChange = {
            bithday: this.user.bithday,
            completed: true,
          };

          this.update(bithdayChange)
            .then(
              () => {
                loading.dismiss();
                this.completeOpem = false;
              },
              (error) => {
                loading.dismiss();
                console.error(error);
                // this.$toast.error({
                //   title: "Erro ao salvar, tente novamente",
                //   description: (error.response && error.response.data) || error.message || error.toString(),
                // });
              }
            )
            .catch((error) => {
              loading.dismiss();
              console.error(error.code);
              console.error(error.message);
            });
        }
      }
    },
    async saveEdit() {
      const loading = await loadingController.create({
        cssClass: "load-custom",
        spinner: "circular",
      });
      await loading.present();
      if (this.viewAd.price > 0 && Number(this.editAD.price) >= 0) {
        this.openToast("Preço inválido");
        loading.dismiss();
        return;
      }
      await this.aditAds({
        id: this.viewAd.id,
        price: Number(this.editAD.price),
      })
        .then(() => {
          this.getMyAds();
          this.cancelEdit();
          this.openToast("Anúncio editado com sucesso!");
          loading.dismiss();
        })
        .catch(() => {
          loading.dismiss();
          this.openToast("Não foi possível editar o anúncio, tente novamante mais tarde.");
        });
    },
    getAdress(locale) {
      return `${locale.logradouro}, ${locale.bairro} - ${locale.localidade}`;
    },
    dateFormate(date) {
      return moment(date).format("LLLL");
    },
    async deleteAd(id) {
      const loading = await loadingController.create({
        cssClass: "load-custom",
        spinner: "circular",
      });
      await loading.present();
      await this.deleteAds(id)
        .then(() => {
          this.getMyAds();
          this.viewOpem = false;
          this.openToast("Anúncio deletado com sucesso!");
          loading.dismiss();
        })
        .catch(() => {
          this.openToast("Não foi possível deletar o anúncio, tente novamante mais tarde.");
        });
    },
    async openToast(message) {
      const toast = await toastController.create({
        message: message,
        duration: 2500,
      });
      return toast.present();
    },
  },
  computed: {
    ...mapGetters("user", ["userLocale", "allMyAds", "isLoadingMyAds", "isLoadingUser", "currentUser"]),
    percentageProfile() {
      let progress = 0;
      if (this.currentUser.phone) progress += 0.5;
      if (this.currentUser.bithday) progress += 0.5;
      return progress;
    },
    getAdressEdit() {
      return `${this.editAD.locale.logradouro}, ${this.editAD.locale.bairro}`;
    },
  },
});
</script>

<style lang="scss" scoped>
#ProfilePage {
  ion-title {
    text-align: center;
    padding-left: unset;
    padding: 0;
    &::first-letter {
      text-transform: uppercase;
    }
  }

  .hero-background {
    height: 250px;
    width: 100%;
    background-image: url("../assets/images/bgGradient.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    .buttons {
      margin-top: 56px;
      padding: 0 16px;
    }
  }

  .user-info {
    margin-top: 115px;
    .container {
      padding: auto 21px;
    }
    .grid-profile {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-flow: row nowrap;
      min-width: 50%;
      max-width: 600px;
      margin: 0 auto;
      gap: 32px;
    }

    .picture {
      overflow: hidden;
      height: 150px;
      width: 150px;
      border-radius: 50%;
      border: 10px solid var(--ion-background-color);
      background-color: var(--ion-background-color);
      user-select: none;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      ion-skeleton-text {
        width: 100%;
        height: 100%;
      }
    }

    .infos {
      flex-grow: 1;

      display: grid;
      grid-auto-columns: 1fr;
      grid-template-rows: 1.5fr repeat(2, 1fr) 75px;
      gap: 0px 0px;
      height: 150px;
      align-content: center;
      align-items: center;

      .name {
        font-size: 1.5em;
        font-weight: 700;
        ion-skeleton-text {
          width: 75%;
          height: 24px;
        }
      }
      .email {
        font-size: 0.95em;
        font-weight: 500;
        opacity: 0.8;
        ion-skeleton-text {
          width: 55%;
          height: 14px;
        }
      }
      .number {
        font-size: 0.95em;
        font-weight: 500;
        opacity: 0.8;
        ion-skeleton-text {
          width: 30%;
          height: 14px;
        }
      }
      .infos-count {
        text-align: center;
        .value {
          font-size: 1.6em;
          font-weight: 800;
          ion-skeleton-text {
            width: 28px;
            height: 32px;
            margin: 0 auto;
          }
        }
        .title {
          font-size: 0.85em;
          font-weight: 700;
          opacity: 0.8;
          ion-skeleton-text {
            width: 70px;
            height: 12px;
            margin: 4px auto 0;
          }
        }
      }
    }

    @media screen and (max-width: 780px) {
      .grid-profile {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column nowrap;
        min-width: 100%;
        max-width: 100%;
        gap: 0;
        .infos {
          width: 100%;
          max-width: 600px;
          text-align: center;
          ion-skeleton-text {
            margin-left: auto;
            margin-right: auto;
          }
          .infos-count {
            margin-top: 24px;
          }
        }
      }
    }
  }

  .cards-container {
    margin-top: 48px;
    ion-col {
      padding: 8px;
    }
  }

  .ad-card-cover {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    margin: 0;
    padding-top: 100%;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    .title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      font-size: 0.9em;
      line-height: 100%;
      font-weight: 500;
      background-image: linear-gradient(to top, rgba(var(--ion-color-dark-rgb), 1), rgba(var(--ion-color-dark-rgb), 0));
      padding: 16px 8px 8px;
      color: var(--ion-color-dark-contrast);
      &::first-letter {
        text-transform: uppercase;
      }
    }
    .views {
      position: absolute;
      top: 8px;
      left: 8px;
      font-size: 0.8em;
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: rgba(var(--ion-color-primary-rgb), 0.75);
      color: var(--ion-color-primary-contrast);
      padding: 4px;
      border-radius: 4px;
    }
    .isActive {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 0.8em;
      background-color: rgba(var(--ion-color-input-rgb), 0.75);
      color: var(--ion-color-input-contrast);
      padding: 4px;
      border-radius: 4px;
      &.approved {
        background-color: rgba(var(--ion-color-success-rgb), 0.75);
        color: var(--ion-color-success-contrast);
      }
      &.reproved {
        background-color: rgba(var(--ion-color-danger-rgb), 0.75);
        color: var(--ion-color-danger-contrast);
      }
    }
    .plus {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column nowrap;
      cursor: pointer;
      background: rgba(var(--ion-color-dark-rgb), 0.02);
      color: rgba(var(--ion-color-dark-rgb), 0.8);
      transition: all 0.35s;
      ion-icon {
        font-size: 3em;
      }
      &:hover {
        background: rgba(var(--ion-color-dark-rgb), 0.05);
        color: rgba(var(--ion-color-dark-rgb), 1);
      }
    }
  }
}

.modal-template {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  .title-area {
    position: relative;
    width: 100%;
    text-align: center;
    height: 44px;
  }
  .stepers {
    flex-grow: 1;
    .step {
      height: 100%;
      padding: 32px 0;
    }
    .container {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      .center {
        flex-grow: 1;
        display: flex;
        align-items: stretch;
        justify-content: center;
        flex-flow: column nowrap;
        width: 100%;
      }
    }
  }
  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.viewAD {
  @media only screen and (min-width: 768px) and (min-height: 768px) {
    --width: 650px;
    --height: 90%;
  }

  .content-modal {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-flow: column nowrap;
    height: 100%;
    width: 100%;
  }

  .title-modal {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(var(--ion-color-dark-rgb), 0.1);
    padding: 0 0 16px 0;
  }

  .body-modal {
    flex-grow: 1;
    overflow-y: auto;
    padding-bottom: 24px;
    position: relative;
    .container {
      max-width: 650px;
    }
    .edit {
      padding: 24px 0;
      .container {
        max-width: 450px;
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
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -1;
          }
        }
      }
    }
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
  }

  .footer-modal {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 0 0 0;
    border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.1);
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
</style>
