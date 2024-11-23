<template>
  <UiLogo class="hidden xl:block mb-6 pb-3 border-b border-gray-100 " />
  <UVerticalNavigation :links="links" :ui="{ base:'mb-1', padding: 'py-3', color: 'text-white', inactive: 'text-white', icon: 'text-white' }" />
</template>
<script setup>
const emit = defineEmits(['to'])
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
]
</script>
