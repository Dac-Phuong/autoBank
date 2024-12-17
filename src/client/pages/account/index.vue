<template>
  <LayoutPublicHeader label="Thiết lập tài khoản" />
  <UiContent title="Tài khoản" size="xl" no-dot sub="Quản lý tài khoản người dùng">
    <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2">
      <div class="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 h-fit">
        <UCard>
          <template #header>
            <UiFlex class="">
              <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="md" alt="Avatar" />
              <div class="ml-2">
                <UiText weight="semibold">{{ authStore.profile.username }}</UiText>
                <UiText size="sm">{{ useMoney().toMoney(authStore.profile.currency.coin) }} xu</UiText>
              </div>
            </UiFlex>
          </template>
          <template #default>
            <NuxtLink to="/account" class="py-2 cursor-pointer">
              <UiFlex class="py-2 cursor-pointer hover:text-primary">
                <UIcon name="i-bx-user" class="text-primary mr-2" />
                <UiText size="sm" color="primary">Thông tin cá nhân</UiText>
              </UiFlex>
            </NuxtLink>
            <UiFlex class="py-2 cursor-pointer hover:text-primary" @click="modal.edit = true">
              <UIcon name="i-bxs:lock" class="text-primary mr-2" />
              <UiText size="sm">Đổi mật khẩu</UiText>
            </UiFlex>
            <NuxtLink to="/payment" class="py-2 cursor-pointer">
              <UiFlex class="py-2 cursor-pointer hover:text-primary">
                <UIcon name="i-bx:credit-card" class="text-primary mr-2" />
                <UiText size="sm">Nạp tiền</UiText>
              </UiFlex>
            </NuxtLink>
          </template>
        </UCard>
        <UCard class="mt-3">
          <template #header>
            <UiText weight="semibold">Thông tin kích hoạt</UiText>
          </template>
          <template #default>
            <UiEmpty text="Chưa kích hoạt" />
          </template>
        </UCard>
      </div>
      <UCard class="xl:col-span-9 lg:col-span-8 md:col-span-6 col-span-12">
        <template #header>
          <UiText weight="semibold">Thông tin tài khoản</UiText>
        </template>
        <template #default>
          <UForm :state="state" @submit="onSubmit" class="grid grid-cols-12 gap-4 mb-4">
            <UFormGroup label="Họ tên" class="col-span-12 md:col-span-6 m-0">
              <UInput v-model="state.username" placeholder="Họ tên" />
            </UFormGroup>

            <UFormGroup label="Email" class="col-span-12 md:col-span-6 m-0">
              <UInput v-model="state.email" placeholder="Email" />
            </UFormGroup>

            <UFormGroup label="Số điện thoại" class="col-span-12 md:col-span-6 m-0">
              <UInput v-model="state.phone" placeholder="Số điện thoại" />
            </UFormGroup>

            <UFormGroup label="Tên tổ chức" class="col-span-12 md:col-span-6 m-0">
              <UInput v-model="state.org_name" placeholder="Tên tổ chức" />
            </UFormGroup>

            <UFormGroup label="Địa chỉ" class="col-span-12">
              <UTextarea v-model="state.address" placeholder="Nhập địa chỉ của bạn" />
            </UFormGroup>

            <UiFlex>
              <UButton type="submit" :loading="loading">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </template>
      </UCard>
    </div>

    <UModal v-model="modal.edit">
      <UCard>
        <template #default>
          <UForm :state="stateForgot" :validate="validate"  @submit="submit" >
            <UFormGroup label="Mật khẩu hiện tại" name="oldPass" :hint="`${stateForgot.oldPass ? stateForgot.oldPass.length : 0}/15`">
              <UInput v-model="stateForgot.oldPass" type="password" placeholder="Mật khẩu hiện tại" />
            </UFormGroup>

            <UFormGroup label="Mật khẩu mới" name="newPass" :hint="`${stateForgot.newPass ? stateForgot.newPass.length : 0}/15`">
              <UInput v-model="stateForgot.newPass" type="password" placeholder="Mật khẩu mới" />
            </UFormGroup>

            <UFormGroup label="Nhập lại mật khẩu mới" name="confirmPass" :hint="`${stateForgot.confirmPass ? stateForgot.confirmPass.length : 0}/15`">
              <UInput v-model="stateForgot.confirmPass" type="password" placeholder="Mật khẩu mới" />
            </UFormGroup>

            <UiFlex class="mt-2" justify="end">
              <UButton color="gray" @click="modal.edit = false" class="ml-1 border border-gray-200 dark:border-gray-700 rounded-xl">Đóng</UButton>
              <UButton type="submit" class="ml-2" :loading="loading">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </template>
      </UCard>
    </UModal>
  </UiContent>
</template>

<script lang="ts" setup>
const authStore: any = useAuthStore()
const loading = ref(false)
const modal = ref({
  edit: false
})
const stateForgot = ref<any>({
  oldPass: undefined,
  newPass: undefined,
  confirmPass: undefined
})
const state = ref(JSON.parse(JSON.stringify(authStore.profile)))
const validate = (state:any ) => {
  const errors = []
  if (!state.oldPass) {
    errors.push({ path: 'oldPass', message: 'Vui lòng nhập đầy đủ' })
  } else if (state.oldPass.length < 6 || state.oldPass.length > 15) {
    errors.push({ path: 'oldPass', message: 'Độ dài 6-15 ký tự' })
  } else if (/\s/.test(state.oldPass)) {
    errors.push({ path: 'oldPass', message: 'Phát hiện khoảng cách' })
  }

  if (!state.newPass) {
    errors.push({ path: 'newPass', message: 'Vui lòng nhập đầy đủ' })
  } else if (state.newPass.length < 6 || state.newPass.length > 15) {
    errors.push({ path: 'newPass', message: 'Độ dài 6-15 ký tự' })
  } else if (/\s/.test(state.newPass)) {
    errors.push({ path: 'newPass', message: 'Phát hiện khoảng cách' })
  }

  if (!state.confirmPass) {
    errors.push({ path: 'confirmPass', message: 'Vui lòng nhập đầy đủ' })
  } else if (state.confirmPass.length < 6 || state.confirmPass.length > 15) {
    errors.push({ path: 'confirmPass', message: 'Độ dài 6-15 ký tự' })
  } else if (/\s/.test(state.confirmPass)) {
    errors.push({ path: 'confirmPass', message: 'Phát hiện khoảng cách' })
  } else if (state.confirmPass !== state.newPass) {
    errors.push({ path: 'confirmPass', message: 'Mật khẩu không khớp' })
  }

  return errors
}
const onSubmit = async () => {
  try {
    if(!!loading.value) return
    loading.value = true
    await useAPI('auth/edit', JSON.parse(JSON.stringify(state.value)))
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}
const submit = async () => {
  try {
    if(!!loading.value) return
    loading.value = true
    await useAPI('auth/sign/forgot', JSON.parse(JSON.stringify(stateForgot.value)))
    loading.value = false
    modal.value.edit = false
    stateForgot.value = {
      oldPass: undefined,
      newPass: undefined,
      confirmPass: undefined
    }
  } catch (error) {
    loading.value = false
  }
}
</script>