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
      let filter = {
        filter: {
          order: "order",
          where: {
            is_active: "true",
          },
        },
      };

      var banners = await get("/banners", filter);
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
