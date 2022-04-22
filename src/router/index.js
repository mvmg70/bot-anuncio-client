import { createRouter, createWebHistory } from "@ionic/vue-router";
import store from "@/store";

const routes = [{
        path: "/",
        name: "Home",
        component: () =>
            import ("@/views/HomePage.vue"),
    },
    {
        path: "/ads/:id",
        name: "ViewAd",
        component: () =>
            import ("@/views/ViewAd.vue"),
    },
    {
        path: "/publish",
        name: "Publish",
        meta: {
            requiresAuth: true,
        },
        component: () =>
            import ("@/views/PublishPage.vue"),
    },
    {
        path: "/profile",
        name: "Profile",
        meta: {
            requiresAuth: true,
        },
        component: () =>
            import ("@/views/ProfilePage.vue"),
    },
    {
        path: "/auth/",
        name: "AuthIndex",
        component: () =>
            import ("@/views/auth/Index.vue"),
        children: [{
                path: "",
                redirect: "/auth/login",
            },
            {
                path: "register",
                name: "Register",
                component: () =>
                    import ("@/views/auth/Register.vue"),
            },
            {
                path: "login",
                name: "Login",
                component: () =>
                    import ("@/views/auth/Login.vue"),
            },
        ],
    },
    {
        path: "/nao-encontrada",
        name: "NotFound",
        component: () =>
            import ("@/errors/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    var isAuth = store.state.auth.loggedIn;
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !isAuth) {
        store.dispatch("auth/setPathAfterLogin", to.path);
        router.replace({ path: "/auth/login" });
    } else next();
});

export default router;