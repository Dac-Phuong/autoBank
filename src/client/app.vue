<template>
  <NuxtLayout>
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