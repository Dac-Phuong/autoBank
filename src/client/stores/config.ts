import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types/model/config'

export const useConfigStore = defineStore('config', () => {
  const config: IDBConfigStore = reactive({
    name: '...',
    short_name: '...',
    description: '...',
    image: {
      og: '',
      app: '',
      logo: '',
    },

    contact: {
      name: '',
      phone: '',
      email: '',
      address: '',
      prefix: '',
    },
  
    social: {
      fanpage: '',
      group: '',
      messenger: '',
      zalo: '',
      tiktok: '',
      telegram: '',
    },
  
    facebook: {
      client_id: '',
      client_version: '',
      client_verify: '',
      client_ads: '',
    },

    google: {
      client_id: '',
      client_verify: '',
      client_ads: '',
    },

    tiktok: {
      client_id: '',
      client_verify: '',
    },
    
    zalo: {
      client_id: '',
      client_verify: '',
    }
  })

  const bootConfig = async () => {
    const cfg : IDBConfigStore = await useAPI('admin/config/get')
    Object.assign(config, cfg)
  }

  return { config, bootConfig }
})