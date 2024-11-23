<template>
  <div
    class="p-2 mb-3 sticky top-0 h-full shadow z-50 bg-white/75 rounded-lg dark:bg-gray-900 backdrop-blur-xl flex items-center gap-1 h-[var(--header-size)] max-h-[var(--header-size)] ">
    <UiFlex class="hidden md:flex">
      <UBreadcrumb :links="links" />
    </UiFlex>
    <UiFlex justify="end" items="center" class="ml-auto gap-1">
      <AuthHearder />
    </UiFlex>
  </div>
</template>
<script setup>
const props = defineProps({
  label: { type: String, default: 'Tổng quan' },
})
const links = [{
  label: 'Trang chủ',
  to: '/'
}, {
  label: props.label,
}]
</script>
