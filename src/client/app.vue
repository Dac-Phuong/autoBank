<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="2" />
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />

</template>

<script setup>
useSeoMeta({
  title: () => 'ENI AutoMB',
  ogTitle: () => 'ENI AutoMB',
})
</script>