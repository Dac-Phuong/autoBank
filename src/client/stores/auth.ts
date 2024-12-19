import type { IDBUserStore } from '~~/types'

export const useAuthStore = defineStore('auth', () => {
  const isLogin = ref(false)
  const isAdmin = ref(false)
  const router = useRouter()
  const profile : Ref<IDBUserStore | undefined> = ref(undefined)

  async function setAuth () {
    const auth = await useAPI('auth/get')
    isAdmin.value = auth.type > 0
    isLogin.value = true
    profile.value = auth 
  }

  async function removeAuth () {
    await useAPI('auth/sign/out')
    isAdmin.value = false
    isLogin.value = false
    profile.value = undefined
    router.push('/auth/login')
  }

  return { 
    isLogin, 
    profile, 
    isAdmin,
    setAuth, 
    removeAuth
  }
})