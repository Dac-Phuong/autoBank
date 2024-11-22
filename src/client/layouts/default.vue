<template>
  <NuxtPage v-if="!authStore.isLogin" />
  <div v-else class="LayoutPublic relative h-full min-h-full">
    <div class="grid grid-cols-12 gap-0 min-h-full">
      <div
        class="hidden xl:static xl:block xl:w-auto w-full xl:col-span-2 bg-primary col-span-12 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-4 overflow-y-auto h-full">
        <LayoutPublicNav />
      </div>
      <div class="relative xl:col-span-10 col-span-12 p-4">
        <LayoutPublicHeader />
        <main class="p-4 overflow-y-auto max-h-[calc(100vh-var(--header-size))]">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>
definePageMeta({
layout: 'client',
middleware: 'auth'
})
<script setup>
const authStore = useAuthStore()
</script>