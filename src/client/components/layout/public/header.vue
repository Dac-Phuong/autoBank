<template>
  <div class="p-2 mb-3 h-full shadow bg-white/75 rounded-lg flex items-center gap-1  ">
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
