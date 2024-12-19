<template>
  <div class="bg-[var(--bg-primary)] h-full p-2">
    <UiLogo class="mb-6 pb-2 border-b border-gray-100 dark:border-gray-800 cursor-pointer" @click="router.push('/')" />
    <UVerticalNavigation :links="links"
      :ui="{ base: 'mb-1', padding: 'py-3', color: 'text-white', inactive: 'text-white', icon: 'text-white' }" />
    <div class="w-full px-5 absolute bottom-5 left-0 ">
      <LayoutPublicSupport />
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['to'])
const router = useRouter()
const links = [
  {
    label: 'Tổng quan',
    icon: 'material-symbols:dashboard',
    slot: 'tab-0',
    to: '/',
  },
  {
    label: 'Nạp xu',
    icon: 'i-bx:credit-card',
    slot: 'tab-1',
    to: '/payment'
  },
  {
    label: 'Tài liệu API',
    icon: 'line-md:text-box-twotone-to-text-box-multiple-twotone-transition',
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
