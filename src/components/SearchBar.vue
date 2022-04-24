<template>
  <div id="SearchBarWithImput" class="container-search-bar" :class="{ 'no-margin': noMargin, 'no-butons': noButtons }">
    <div class="search">
      <ion-searchbar placeholder="Pesquise por um título ou descrição" v-model="searchValue" @ionInput="updateValue()"></ion-searchbar>
    </div>
    <div class="button-filters">
      <ion-button color="primary" size="small" shape="round"> {{ userLocale ? userLocale.city : "-" }} </ion-button>
      <!-- 
      <ion-button color="medium" size="small" shape="round" fill="outline" @click="filterIsOpem = !filterIsOpem">Filter</ion-button>
      -->
    </div>

    <!-- Filter Modal -->
    <ion-modal :is-open="filterIsOpem" :breakpoints="[0.1, 0.5, 1]" :initialBreakpoint="0.5" @didDismiss="filterIsOpem = false">
      <ion-content>Modal Content</ion-content>
    </ion-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SeachBarFilters",
  props: {
    noMargin: {
      type: Boolean,
      default: false,
    },
    noButtons: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue: "",
      filters: {},
      filterIsOpem: false,
      interval: null,
    };
  },
  watch: {
    searchValue(newValue) {
      clearInterval(this.interval);
      if (newValue.length == 0) {
        this.interval = setInterval(() => {
          this.search("");
        }, 500);
      } else if (newValue.length >= 3) {
        this.interval = setInterval(() => {
          this.search(newValue);
        }, 500);
      }
    },
  },
  computed: {
    ...mapGetters("user", ["userLocale"]),
    ...mapGetters("add", ["allAds"]),
  },
  methods: {
    ...mapActions("ad", ["getAds"]),
    search(value) {
      clearInterval(this.interval);
      this.getAds({ search: value });
    },
    updateValue() {
      this.$emit("input", this.searchValue);
    },
    opemFilter() {
      this.$emit("triggerFilter", true);
    },
  },
};
</script>

<style lang="scss">
#SearchBarWithImput {
  max-width: 600px;
  &.no-margin {
    padding: 8px 16px;
  }
  &.no-butons .button-filters {
    display: none;
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    ion-searchbar {
      padding: 0;
      height: 32px;
      --border-radius: 8px;
      --background: var(--ion-color-light-shade);
      .searchbar-input-container.sc-ion-searchbar-ios {
        height: 32px !important;
      }
    }
  }
  .button-filters {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    ion-button {
      flex-grow: 1;
    }
  }
  @media only screen and (min-width: 780px) {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    .search {
      flex-grow: 2;
    }
  }
}
</style>
