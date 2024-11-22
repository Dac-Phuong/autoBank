<template>
    <div class="login px-5 py-2 overflow-hidden">
        <UContainer class="p-0 xl:px-10">
            <div class="block xl:grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                <div class="hidden xl:flex flex-col min-h-screen h-full pt-5">
                    <UiLogo class="hidden xl:block" />
                    <div class="my-auto">
                        <UiImg src="/images/illustration.svg" class="mt-5 -intro-x w-1/2 -mt-16 md:-mt-10" />
                        <UiText tag="h1"
                            class="break-words text-3xl text-white dark:text-white-400 font-bold italic mt-10">
                            Giải pháp <br /> thanh toán tự động.
                        </UiText>
                        <UiText class="intro-x mt-5 text-lg text-white text-opacity-50 dark:text-gray-500">Tích hợp thanh toán tự động dễ dàng hơn</UiText>
                    </div>
                </div>
                <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                    <div class="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                        <UiText class="intro-x text-gray-800 font-bold text-2xl xl:text-3xl text-center xl:text-left">
                            Welcome to ENI AutoMB! 👋
                        </UiText>
                        <UiText class="intro-x mt-2 text-gray-500 xl:hidden text-center" size="sm">Thêm một vài cú nhấp chuột để đăng nhập vào tài khoản của bạn. Bạn có thể tích hợp thanh toán tự động dễ dàng hơn</UiText>
                        <UForm :validate="validateForm" :state="state" @submit="onSubmit" class="intro-x mt-5">
                            <UFormGroup label="Tài khoản" name="account">
                                <UInput icon="i-bxs-user" type="text" size="lg" class="bg-white" v-model="state.account" placeholder="Nhập tài khoản" />
                            </UFormGroup>
                            <UFormGroup label="Mật khẩu" name="password " class="mt-3">
                                <UInput icon="i-bxs-lock" size="lg" type="password" color="white" v-model="state.password" placeholder="Nhập mật khẩu" />
                            </UFormGroup>
                            <UiFlex class="mt-3 flex-wrap">
                                <UButton class="mt-3 h-[40px]" type="submit" :loading="loading">Đăng nhập</UButton>
                                <UButton class="mt-3 ml-2 h-[40px]" color="gray" @click="router.push('/auth/register')">Tạo tài khoản</UButton>
                            </UiFlex>
                        </UForm>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>
<script setup>
// state
const loading = ref(false)
const router = useRouter()

const state = ref({
    account: undefined,
    password: undefined
})
const validateForm = (state) => {
  const errors = []
  if (!state.account) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  return errors
}
// submit form
const onSubmit = async () => {
    try {
        loading.value = true
        await useAPI('auth/sign/in', JSON.parse(JSON.stringify(state.value)))
        router.push('/')
        await authStore.setAuth()
        loading.value = false
        
    } catch (error) {
        loading.value = false
    }
    
}

</script>
<style lang="scss" scoped>
.login {
    position: relative;
    height: 100%;
    &::before {
        content: "";
        margin-left: -48%;
        background-image: url(../images/bg-login-page.svg);
        background-repeat: no-repeat;
        background-size: auto 100%;
        background-position: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
    }
}

@media (max-width: 1279px) {
    .login {
        background: linear-gradient(180deg, #129347, #129347);
        background-repeat: no-repeat;
        background-attachment: fixed;
    }
}
</style>
