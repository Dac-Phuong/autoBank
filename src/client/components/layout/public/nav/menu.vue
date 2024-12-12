<template>
  <UiFlex type="col" class="space-y-4 w-full">
    <UVerticalNavigation :links="links"/>
  </UiFlex>
</template>

<script setup>

const links = [{
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
  },]
</script>
<style lang="scss" scoped>
  nav {
    width: 100% !important;
  }
</style>