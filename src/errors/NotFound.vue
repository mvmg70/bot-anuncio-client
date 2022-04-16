<template>
  <ion-page id="NotFoundPage">
    <ion-content :fullscreen="true">
      <div v-if="type == 'ads'">Anúncio não encontrado</div>
      <div v-if="type == 'user'">Esse perfil não existe</div>
      <ion-button router-link="/" router-direction="back"> Voltar para a tela inicial </ion-button>
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
}
</style>
