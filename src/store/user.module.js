import axios from "axios";
import { get, path } from "@/services/api.service";

export const userStore = {
  namespaced: true,
  state: {
    current: {},
    locale: [],
    loadingUser: true,
    loadMyAds: true,
    myAds: [],
  },
  actions: {
    setUser({ commit }, user) {
      commit("saveUser", user);
      commit("FINISH_LOAD_USER");
    },
    async update({ commit, state }, data) {
      console.log(state);
      var ads = await path(`users/${state.current.id}`, data);
      console.log(ads);
      commit("FINISH_LOAD_USER");
    },
    async getUserLocale({ commit }) {
      var geolocation = null;

      await navigator.geolocation.getCurrentPosition(
        (position) => {
          geolocation = position.coords;
        },
        (error) => {
          console.error(error.message);
        }
      );

      var data = await axios
        .get(`https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=pt`)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
        });

      data.geolocationIsPermited = geolocation ? true : false;

      if (data.geolocationIsPermited) {
        data.latitude = geolocation.latitude;
        data.longitude = geolocation.longitude;
      }

      commit("saveLocale", data);
    },
    async getMyAds({ commit, state }) {
      commit("START_LOAD_ADS");
      var ads = await get(`users/${state.current.id}/advertisings`);
      commit("SET_MY_ADS", ads.data);
      commit("FINISH_LOAD_ADS");
    },
  },
  mutations: {
    saveLocale(state, locale) {
      state.locale = locale;
    },
    saveUser(state, user) {
      state.current = user;
    },
    SET_MY_ADS(state, ads) {
      state.myAds = ads;
    },
    START_LOAD_ADS(state) {
      state.loadMyAds = true;
    },
    FINISH_LOAD_ADS(state) {
      state.loadMyAds = false;
    },
    START_LOAD_USER(state) {
      state.loadingUser = true;
    },
    FINISH_LOAD_USER(state) {
      state.loadingUser = false;
    },
  },
  getters: {
    currentUser(state) {
      return state.current;
    },
    userLocale(state) {
      return state.locale;
    },

    allMyAds(state) {
      return state.myAds;
    },
    isLoadingMyAds(state) {
      return state.loadMyAds;
    },
    isLoadingUser(state) {
      return state.loadingUser;
    },
  },
};
