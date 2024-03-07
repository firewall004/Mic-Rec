export default {
  ssr: false,

  sourcemap: {
    server: true,
    client: true,
  },

  devtools: { enabled: true },

  head: {
    title: "mic-rec",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: ["@nuxtjs/tailwindcss", "@nuxtjs/dotenv"],

  modules: ["@nuxtjs/pwa"],

  pwa: {
    manifest: {
      name: "Mic Rec",
      short_name: "PWA",
      display: "standalone",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      lang: "en",

      icons: [
        {
          src: "/logo.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
  },

  build: {},
};
