import { join } from 'path'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  srcDir: join(__dirname, './src/client'),
  serverDir: join(__dirname, './src/server'),

  nitro: {
    output: { 
      dir: './dist/server',
      serverDir: './dist/server/core', 
      publicDir: './dist/server/public' 
    }
  },

  runtimeConfig: {
    dev: process.env.NODE_ENV === 'production' ? false : true,
    mongoURI: process.env.MONGO_URI,
    mongoDB: process.env.MONGO_DB,
    apiSecret: process.env.SECRET,
    
    public: {
      dev: process.env.NODE_ENV === 'production' ? false : true,
      clientURL: process.env.CLIENT_URL,
      domain: process.env.DOMAIN,
      cookieConfig: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
      version: process.env.VERSION
    }
  },
  modules: ['@nuxt/ui',
    '@pinia/nuxt', 
    '@nuxt/icon', 
    '@nuxt/image', 
    ['@nuxtjs/google-fonts', {
      display: 'swap',
      download: true,
      families: {
        Montserrat: [400,500,600,700]
      }
    }],
  ],
  css: [
    '@/app.sass'
  ],
  colorMode: {
    preference: 'light',
  },
})
