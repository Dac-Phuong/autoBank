<template>
  <div class="border-b border-gray-100 dark:border-gray-800 ">
    <UContainer class="sticky top-0 h-full z-50 bg-white/75 dark:bg-gray-900 backdrop-blur-xl flex items-center gap-1 h-[var(--header-size)] max-h-[var(--header-size)] ">
      <UiFlex>
        <NuxtLink to="/">
          <UBreadcrumb :links="links" />
        </NuxtLink>
      </UiFlex>
      <UiFlex justify="end" items="center" class="ml-auto gap-1">
        <AuthHearder />
      </UiFlex>
    </UContainer>
  </div>
</template>
<script setup>
const authStore = useAuthStore()
const links = [{
  label: 'Trang chủ',
  to: '/'
}, {
  label: 'Tổng quan',
}]
</script>
