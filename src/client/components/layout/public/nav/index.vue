<template>
  <UiLogo class="hidden xl:block mb-4" />
  <UVerticalNavigation :links="links" :ui="{margin: 'mt-4', padding: 'py-3' }"/>
</template>

<script setup>
const emit = defineEmits(['to'])
const links = [
  {
    label: 'Tổng quan',
    icon: 'i-heroicons-home',
    slot: 'tab-0',
    to: '/',
    size: 'lg'

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