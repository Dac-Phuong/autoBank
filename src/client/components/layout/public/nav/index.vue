<template>
  <UiLogo class="hidden xl:block mb-6 pb-2 border-b border-gray-100 dark:border-gray-800 cursor-pointer" @click="router.push('/')" />
  <UVerticalNavigation :links="links" :ui="{ base: 'mb-1', padding: 'py-3', color: 'text-white', inactive: 'text-white', icon: 'text-white' }" />
</template>
<script setup>
const emit = defineEmits(['to'])
const router = useRouter()
const links = [
  {
    label: 'Tổng quan',
    icon: 'i-heroicons-home',
    slot: 'tab-0',
    to: '/',
  },
  {
    label: 'Nạp xu',
    icon: 'material-symbols:payments',
    slot: 'tab-1',
    to: '/payment'
  },
  {
    label: 'Tài liệu API',
    icon: 'material-symbols:book-3-rounded',
    slot: 'tab-2',
    to: '/docs'
  },
  {
    label: 'Hồ sơ',
    icon: 'i-bx-user',
    slot: 'tab-2',
    to: '/account'
  },
]
</script>
