<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="container small">
        <LogoInline />
        <h1 class="title-page left-text bigger">Bem vindo de volta</h1>
        <p>Estamos felizes em te vê novamente</p>

        <div class="line-social">
          <ion-button color="light-gray" fill="solid" expand="block" @click="continueGoogle()" class="login-button">
            <ion-icon :src="getIcon('logoGoogle')"></ion-icon>
            Continuar com Google
          </ion-button>
        </div>

        <div class="form">
          <ion-item class="custon-input" mode="md" lines="none">
            <ion-label>E-mail</ion-label>
            <div class="input-container">
              <ion-input placeholder="Seu melhor -mail" autocomplete="email" inputmode="email" pattern="email" type="email" v-model="user.email"> </ion-input>
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
          <div class="line-options">
            <ion-button color="input" fill="clear" size="small" router-link="/register" class="link-buttons"> Esqueceu sua senha? </ion-button>
          </div>

          <div class="spacer"></div>

          <ion-button color="primary" expand="block" @click="login()" class="login-button">
            Entrar
            <ion-icon :src="getIcon('arrowForwardOutline')" slot="end"></ion-icon>
          </ion-button>

          <div class="line-account">
            Ainda não tem uma conta?
            <ion-button color="input" size="small" fill="clear" router-link="/auth/register" router-direction="back"> Cadastre-se grátis </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { loadingController } from "@ionic/vue";
import LogoInline from "../../components/LogoInline.vue";

export default {
  name: "PageLogin",
  components: [LogoInline],
  data() {
    return {
      user: {
        email: "",
        pass: "",
      },
      viewPass: false,
    };
  },
  methods: {
    validForm() {
      var isValid = true;
      return isValid;
    },
    async login() {
      if (this.validForm()) {
        const loading = await loadingController.create({
          cssClass: "load-custom",
          spinner: "circular",
        });

        await loading.present();
        console.log(this.$store.state.count);

        this.$store
          .dispatch("auth/login", this.user)
          .then(
            () => {
              loading.dismiss();
            },
            (error) => {
              loading.dismiss();
              this.$toast.error({
                title: "Erro ao fazer login",
                description: (error.response && error.response.data) || error.message || error.toString(),
              });
            }
          )
          .catch((error) => {
            loading.dismiss();
            console.log(error.code);
            console.log(error.message);
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
            this.$toast.error({
              title: "Erro ao fazer login",
              description: (error.response && error.response.data) || error.message || error.toString(),
            });
          }
        )
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  text-align: center;
  margin: 48px 0 17px;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-flow: column nowrap;
  width: 100%;

  .login-button {
    margin-top: 56px;
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
  .spacer {
    flex-grow: 1;
  }
}

.line-social {
  margin: 32px 0 12px;
}

.line-options {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin: -12px 0 24px;
  .link-buttons {
    margin: 0;
    text-align: right;
    --padding-end: 0;
    --padding-start: 0;
  }
}
</style>
