<template>
    <div class="register px-5 py-2 overflow-hidden">
        <UContainer class="p-0 xl:px-10">
            <div class="block xl:grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                <div class="hidden xl:flex flex-col min-h-screen h-full pt-5">
                    <UiLogo class="hidden xl:block" />
                    <div class="my-auto">
                        <UiImg src="/images/illustration.svg" class="mt-5 -intro-x w-1/2 -mt-16 md:-mt-10" />
                        <UiText tag="h1" class="break-words text-3xl text-white dark:text-white-400 font-bold italic mt-10">
                            Mở tài khoản đơn giản tại <br /> ENI AutoMB.
                        </UiText>
                        <UiText class="intro-x mt-5 text-lg text-white text-opacity-50 dark:text-gray-500">Tích hợp thanh toán tự động dễ dàng hơn</UiText>
                    </div>
                </div>
                <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                    <div class="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-3/4">
                        <UiText class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"> Đăng ký tài khoản</UiText>
                        <UiText size="sm mt-1 text-gray-600 text-center xl:text-left">Cuộc phiêu lưu bắt đầu từ đây 🚀</UiText>
                        <UiText class="intro-x mt-2 text-gray-500 xl:hidden text-center" size="sm">Thêm một vài cú nhấp chuột để đăng nhập vào tài khoản của bạn. Bạn có thể tích hợp thanh toán tự động dễ dàng hơn</UiText>
                        <UForm :validate="validateForm" :state="state" @submit="onSubmit" class="intro-x mt-5">
                            <UFormGroup label="Tài khoản" name="account" :hint="`${state.account ? state.account.length : 0}/15`">
                                <UInput icon="i-bxs-user" size="lg" class="w-full" v-model="state.account" placeholder="Nhập tài khoản" />
                            </UFormGroup>
                            <UFormGroup label="Email" name="email" class="mt-3">
                                <UInput icon="material-symbols:stacked-email" size="lg" class="w-full" v-model="state.email" type="email" placeholder="Nhập Email" />
                            </UFormGroup>
                            <UFormGroup label="Số điện thoại" name="phone" class="mt-3">
                                <UInput icon="material-symbols:call" size="lg" class="w-full" v-model="state.phone" placeholder="Nhập số điện thoại" />
                            </UFormGroup>
                            <UFormGroup label="Mật khẩu" name="password" class="mt-3" :hint="`${state.password ? state.password.length : 0}/15`">
                                <UInput icon="i-bxs-lock" size="lg" color="white" v-model="state.password" type="password" placeholder="Nhập mật khẩu" />
                            </UFormGroup>
                            <UiFlex class="mt-3 flex-wrap">
                                <UButton class="mt-3 h-[40px]" type="submit" :loading="loading">Đăng ký</UButton>
                                <UButton class="mt-3 ml-2 h-[40px]" @click="router.push('/auth/login')" color="gray">Đăng nhập</UButton>
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
const state = ref({
    account: undefined,
    password: undefined,
    email: undefined,
    phone: undefined
})
const loading = ref(false)
const router = useRouter()
// validate form
const validateForm = (state) => {
    const errors = [];
    if (!state.account) errors.push({ path: 'account', message: 'Vui lòng nhập tài khoản' })
    else if (state.account.length < 6 || state.account.length > 15) errors.push({ path: 'account', message: 'Độ dài 6-15 ký tự' })
    else if (!!state.account.match(/\s/g)) errors.push({ path: 'account', message: 'Phát hiện khoảng cách' })
    else if (!(/^[a-z0-9]*$/g).test(state.account)) errors.push({ path: 'account', message: 'Phát hiện ký tự đặc biệt và viết hoa' })
    else if (!!state.account.includes('admin') || !!state.account.includes('smod') || !!state.account.includes('robot')) errors.push({ path: 'account', message: 'Danh xưng không hợp lệ' })

    if (!state.email) errors.push({ path: 'email', message: 'Vui lòng nhập địa chỉ email' })
    else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: 'Định dạng không đúng' })

    if (!state.phone) errors.push({ path: 'phone', message: 'Vui lòng nhập số điện thoại' })
    else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: 'Định dạng không đúng' })

    if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập mật khẩu' })
    else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
    else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })
    return errors;
}
const onSubmit = async () => {
    try {
        loading.value = true
        await useAPI('auth/sign/up', JSON.parse(JSON.stringify(state.value)))
        await authStore.setAuth()
        loading.value = false
    } catch (error) {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.register {
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


