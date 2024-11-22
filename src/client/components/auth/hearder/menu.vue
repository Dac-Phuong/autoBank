<template>
  <UiFlex>
    <UPopover :popper="{ strategy: 'absolute', placement: 'bottom-end' }" v-model:open="open">
      <UButtonGroup>
        <UButton class="relative ml-2" icon="i-bx-user" square></UButton>
      </UButtonGroup>

      <template #panel>
        <div class="w-[180px] max-w-sreen overflow-hidden">
          <UVerticalNavigation :links="menuUser"
            :ui="{ padding: 'py-2', rounded: 'rounded-none', divider: { wrapper: { base: 'p-0' } } }" />
        </div>
      </template>
    </UPopover>

    <UModal v-model="modal.edit.info" preventClose>
      <UiContent title="Chỉnh Sửa" sub="Cập nhật thông tin cá nhân" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.edit.info = false">
          </UButton>
        </template>

        <AuthEditProfile />
      </UiContent>
    </UModal>

    <UModal v-model="modal.edit.password" preventClose>
      <UiContent title="Bảo Mật" sub="Thay đổi mật khẩu" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.edit.password = false">
          </UButton>
        </template>
        <AuthEditPassword @done="modal.edit.password = false" />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.wheel" :ui="{ width: 'sm:max-w-[900px]' }">
      <UiContent title="Lịch Sử Quay" sub="Lich sử quay thưởng của bạn" no-dot class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.wheel = false">
          </UButton>
        </template>
      </UiContent>
    </UModal>

  </UiFlex>
</template>
<script setup>
const authStore = useAuthStore()

const open = ref(false)
const modal = ref({
  edit: {
    info: false,
    password: false
  },
  history: {
    wheel: false
  }
})

const menuUser = computed(() => {
  const list = []
  if (!!authStore.isAdmin) {
    list.push([{
      label: 'Quản trị viên',
      icon: 'i-bx-shield-quarter',
      click: () => navigateTo('/admin/statitic')
    }])
  }

  return [
    ...list,
    [{
      label: 'Tài khoản',
      icon: 'i-bx-edit',
      click: () => modal.value.edit.info = true
    }, {
      label: 'Thay đổi mật khẩu',
      icon: 'i-bx-lock',
      click: () => modal.value.edit.password = true
    }],
    [{
      label: 'Hỗ trợ',
      icon: 'i-bx-history',
      click: () => modal.value.history.wheel = true
    }],
    [{
      label: 'Đăng xuất',
      icon: 'i-bx-log-out',
      click: () =>  authStore.removeAuth()
    }]
  ]
})
</script>