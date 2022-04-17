<template>
  <ion-page>
    <ion-content>
      <div class="container small">
        <h1 class="title-page left-text bigger">Seja bem vindo</h1>
        <p>É um prazer ter você conosco</p>

        <div class="line-social">
          <ion-button color="light-gray" fill="solid" expand="block" @click="continueGoogle()" class="login-button">
            <ion-icon :src="getIcon('logoGoogle')"></ion-icon>
            Continuar com Google
          </ion-button>
        </div>

        <div class="form">
          <ion-item class="custon-input" mode="md" lines="none">
            <ion-label>Nome</ion-label>
            <div class="input-container">
              <ion-input placeholder="Como posso lhe chamar" autocomplete="name" type="text" v-model="user.displayName"></ion-input>
            </div>
          </ion-item>

          <ion-item class="custon-input" mode="md" lines="none">
            <ion-label>E-mail</ion-label>
            <div class="input-container">
              <ion-input placeholder="Seu melhor e-mail" autocomplete="email" inputmode="email" pattern="email" type="email" v-model="user.email"> </ion-input>
            </div>
          </ion-item>

          <ion-item class="custon-input" mode="md" lines="none">
            <ion-label>Número de Celular</ion-label>
            <div class="input-container">
              <ion-input placeholder="Seu melhor telefone" autocomplete="tel" inputmode="tel" pattern="tel" type="tel" v-model="user.tel"> </ion-input>
            </div>
          </ion-item>
          <div class="line-options">
            <ion-item class="custon-input check no-ripple" mode="md" lines="none">
              <ion-checkbox mode="md"> </ion-checkbox>
              <ion-label> Possui Whatsapp</ion-label>
            </ion-item>
            <ion-item class="custon-input check no-ripple" mode="md" lines="none">
              <ion-checkbox mode="md"> </ion-checkbox>
              <ion-label> Possui Telegram </ion-label>
            </ion-item>
          </div>

          <ion-item class="custon-input" mode="md" lines="none">
            <ion-label>Data de Nascimento</ion-label>
            <div class="input-container">
              <ion-input placeholder="Sua data de nascimento" id="bithdayInput" v-model="user.bithday" readonly> </ion-input>
              <ion-popover trigger="bithdayInput" :show-backdrop="false" size="cover">
                <ion-datetime locale="pt-BR" size="cover" presentation="date" @ionChange="(ev) => (user.bithday = formatDate(ev.detail.value))" />
              </ion-popover>
            </div>
          </ion-item>

          <ion-item class="custon-input pass" mode="md" lines="none">
            <ion-label>Senha</ion-label>
            <div class="input-container">
              <ion-input placeholder="Escolha uma senha" :type="viewPass ? 'text' : 'password'" v-model="user.pass"></ion-input>
              <div class="toggle-view-pass" @click="viewPass = !viewPass">
                <ion-icon :src="getIcon(viewPass ? 'eyeOutline' : 'eyeOffOutline')"></ion-icon>
              </div>
            </div>
          </ion-item>

          <ion-item class="custon-input pass" mode="md" lines="none">
            <ion-label>Confirmar senha</ion-label>
            <div class="input-container">
              <ion-input placeholder="Confirme sua senha" :type="viewPassConfirm ? 'text' : 'password'" v-model="user.passConfirme"> </ion-input>
              <div class="toggle-view-pass" @click="viewPassConfirm = !viewPassConfirm">
                <ion-icon :src="getIcon(viewPassConfirm ? 'eyeOutline' : 'eyeOffOutline')"></ion-icon>
              </div>
            </div>
          </ion-item>

          <ion-item class="custon-input check no-ripple" mode="md" lines="none">
            <ion-checkbox mode="md"> </ion-checkbox>
            <ion-label> Concordo com os termos e políticas. </ion-label>
          </ion-item>

          <ion-button color="primary" expand="block" @click="register()" class="enter-button">
            Cadastrar
            <ion-icon :src="getIcon('arrowForwardOutline')" slot="end"></ion-icon>
          </ion-button>

          <div class="line-account">
            Já tem conta?
            <ion-button color="input" size="small" fill="clear" router-link="/auth/login"> Faça login </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { loadingController } from "@ionic/vue";
import moment from "moment";

export default {
  name: "PageRegister",
  data() {
    return {
      user: {
        displayName: "Wilker",
        email: "wilker@asdf.asdf",
        bithday: "25/03/2022",
        tel: "",
        pass: "",
        passConfirme: "",
      },
      viewPass: false,
      viewPassConfirm: false,
      scorePass: 0,
      picked: {
        day: "25",
        month: "03",
        year: "2002",
      },
    };
  },
  methods: {
    validForm() {
      var isValid = true;
      return isValid;
    },
    async register() {
      if (this.validForm()) {
        const loading = await loadingController.create({
          cssClass: "load-custom",
          spinner: "circular",
        });

        await loading.present();

        this.$store
          .dispatch("auth/register", this.user)
          .then(
            () => {
              loading.dismiss();
            },
            (error) => {
              loading.dismiss();
              this.loading = false;
              console.error(error);
              // this.$toast.error({
              //   title: "Erro ao fazer login",
              //   description: (error.response && error.response.data) || error.message || error.toString(),
              // });
            }
          )
          .catch((error) => {
            loading.dismiss();
            console.error(error);
            console.error(error.message);
          });
      }
    },
    async continueGoogle() {
      await this.$store
        .dispatch("auth/loginGoogle")
        .then(
          () => {},
          (error) => {
            this.loading = false;
            console.error(error);
            // this.$toast.error({
            //   title: "Erro ao fazer login",
            //   description: (error.response && error.response.data) || error.message || error.toString(),
            // });
          }
        )
        .catch((error) => {
          console.error(error.code);
          console.error(error.message);
        });
    },
    formatDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
  },
};
</script>

<style lang="scss" scoped>
ion-content {
  display: flex;
  align-items: center;
}
.form {
  margin: 48px 0 17px;
  .enter-button {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .line-account {
    display: flex;
    align-items: center;
    justify-content: center;
    ion-button {
      --padding-start: 6px;
      font-weight: 600;
    }
  }
}

.link-button {
  margin-top: -5px;
}

.line-options {
  display: flex;
  align-items: center;
  margin: -12px 0 16px;
  gap: 24px;
  ion-item {
    margin: 0 !important;
  }
}

.line-social {
  margin: 32px 0 12px;
}
</style>
