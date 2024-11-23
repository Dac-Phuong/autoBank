<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="2" />
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup>
useSeoMeta({
  title: () => 'ENI AutoMB',
  ogTitle: () => 'ENI AutoMB',
})
</script>