<template>
  <ion-page id="NotFoundPage">
    <ion-content :fullscreen="true">
      <div class="container">
        <h1>404</h1>
        <p v-if="type == 'ads'">Não conseguimos encontrar a página solicitada, verifique se o link está correto e tente novamente, ná pagina inicial você encontrará todas as páginas disponivéis.</p>
        <ion-button router-link="/" router-direction="back"> Voltar para a tela inicial </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFoundPage",
  data() {
    return {
      type: this.$route.params.type,
    };
  },
});
</script>

<style lang="scss" scoped>
#NotFoundPage {
  .container {
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column nowrap;
    max-width: 500px;
    h1 {
      color: var(--ion-color-primary);
      font-weight: 900;
      font-size: 7.5em;
      margin-bottom: 24px;
    }
    p {
      font-size: 1.1em;
      line-height: 120%;
      opacity: 0.8;
      margin-top: 0;
    }
  }
}
</style>
