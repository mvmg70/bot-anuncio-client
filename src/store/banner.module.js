import { get } from "@/services/api.service";

export const bannerStore = {
  namespaced: true,
  state: () => ({
    loadBanners: true,
    banners: [],
  }),

  actions: {
    async getBanners({ commit }) {
      commit("START_LOAD_BANNERS");
      let filter =
        "?filter=%7B%0A%20%20%22offset%22%3A%200%2C%0A%20%20%22limit%22%3A%20100%2C%0A%20%20%22skip%22%3A%200%2C%0A%20%20%22order%22%3A%20%22order%22%2C%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22is_active%22%3A%20true%0A%20%20%7D%0A%7D";
      var banners = await get("/banners" + filter);
      commit("SET_BANNERS", banners.data);
      commit("FINISH_LOAD_BANNERS");
    },
  },

  mutations: {
    SET_BANNERS(state, banners) {
      state.banners = banners;
    },
    START_LOAD_BANNERS(state) {
      state.loadBanners = true;
    },
    FINISH_LOAD_BANNERS(state) {
      state.loadBanners = false;
    },
  },

  getters: {
    allBanners(state) {
      return state.banners;
    },
    isLoadingBanners(state) {
      return state.loadBanners;
    },
  },
};
