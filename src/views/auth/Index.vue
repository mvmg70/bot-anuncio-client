<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-no-padding">
      <div class="container-auth">
        <div class="side-left">© Copyrgth - <LogoInline color="white" /> 2022</div>
        <div class="side-right ion-padding">
          <ion-router-outlet> </ion-router-outlet>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import LogoInline from "../../components/LogoInline.vue";

export default defineComponent({
  name: "IndexAuth",
  components: { LogoInline },
  data() {
    return {
      optionsSlide: { rewind: true },
    };
  },
});
</script>

<style lang="scss">
.container-auth {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-flow: row nowrap;
  overflow: hidden;

  .side-left,
  .side-right {
    height: 100vh;
    max-height: 100vh;
    transition: all 0.35s;
  }
  .side-left {
    width: 0;
    flex-grow: 1;
    overflow: hidden;
    background: var(--ion-color-primary);
    padding: 32px;
    display: none;
    color: var(--ion-color-light);
  }
  .side-right {
    width: 100%;
    position: relative;
  }
  @media only screen and (min-width: 780px) {
    .side-left {
      width: 60%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 4px;
    }
    .side-right {
      width: 40%;
      min-width: 400px;
    }
  }
}
</style>
