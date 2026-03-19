export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/image"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  ssr: false,

  pages: {
    pattern: ["**/*.vue", "!**/_*/**"],
  },

  nitro: {
    devProxy: {
      "/api": {
        target: `${process.env.NUXT_PUBLIC_API_BASE}/api`,
        changeOrigin: true,
      },
    },
  },

  components: [
    "~/components/",
    {
      path: "~/pages",
      pathPrefix: false,
      prefix: "C",
      pattern: "**/_components/**",
    },
  ],

  compatibilityDate: "2025-01-15",

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://defaultapi.com",
    },
  },
});
