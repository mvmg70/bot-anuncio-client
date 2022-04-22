import { getAuth, setPersistence, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";

import AuthService from "../services/auth.service";
import _ from "lodash";

export const authStore = {
    namespaced: true,
    state: () => ({
        toPathAfterAuth: null,
        loggedIn: null,
        user: null,
    }),
    actions: {
        login({ commit }, user) {
            const auth = getAuth();

            return signInWithEmailAndPassword(auth, user.email, user.pass)
                .then((currentUser) => {
                    return Promise.resolve(currentUser.user);
                })
                .catch((error) => {
                    commit("logout");
                    return Promise.reject(error);
                });
        },
        loginGoogle({ commit }) {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();

            var persistence = browserLocalPersistence;

            setPersistence(auth, persistence);

            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;

                    return Promise.resolve(token);
                })
                .catch((error) => {
                    commit("logout");
                    return Promise.reject(error);
                });
        },
        async register({ commit }, user) {
            const auth = getAuth();

            return await createUserWithEmailAndPassword(auth, user.email, user.pass)
                .then(async(userCredential) => {
                    var userCheck = _.merge(userCredential.user, user);
                    await AuthService.checkUser(userCheck);
                    return Promise.resolve(true);
                })
                .catch((error) => {
                    commit("logout");
                    return Promise.reject(error);
                });
        },
        async fetchUser({ dispatch, commit }, user) {
            var userLoad = await AuthService.checkUser(user);
            var currentUser = _.merge(user, userLoad);
            commit("loadUser", currentUser);
            dispatch("user/setUser", currentUser, { root: true });
            return Promise.resolve(true);
        },
        logout({ commit }) {
            const auth = getAuth();
            auth.signOut();
            commit("logout");
        },
        noUser({ commit }) {
            commit("noLogin");
        },

        setPathAfterLogin({ commit, state }, path) {
            if (state.toPathAfterAuth == null) commit("setPathAfter", path);
        },
        deletePathAfterLogin({ commit }) {
            commit("deletePathAfter");
        },
    },
    mutations: {
        loginSuccess(state) {
            state.loggedIn = true;
        },
        noLogin(state) {
            state.loggedIn = false;
        },
        logout(state) {
            state.loggedIn = false;
            state.user = null;
            state.toPathAfterAuth = null;
        },
        loadUser(state, user) {
            state.loggedIn = true;
            state.user = user;
        },
        setPathAfter(state, path) {
            state.toPathAfterAuth = path;
        },
        deletePathAfter(state) {
            state.toPathAfterAuth = null;
        },
    },
    getters: {
        currentUser(state) {
            return state.user;
        },
    },
};