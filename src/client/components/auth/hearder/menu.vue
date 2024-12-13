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
      click: () => navigateTo('/admin/statistic')
    }])
  }

  return [
    ...list,
    [{
      label: 'Tài khoản',
      icon: 'i-bx-edit',
      click: () => modal.value.edit.info = true
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