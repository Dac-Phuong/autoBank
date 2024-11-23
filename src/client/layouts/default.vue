<template>
  <NuxtPage v-if="!authStore.isLogin" />
  <div v-else class="LayoutPublic relative h-full min-h-full">
    <div class="grid grid-cols-12 gap-0 min-h-full">
      <div
        class="hidden xl:block xl:w-auto w-full xl:col-span-2 bg-[var(--bg-primary)] col-span-12 dark:bg-gray-900 px-4 py-8  overflow-y-auto h-full">
        <LayoutPublicNav />
      </div>
      <div class="relative xl:col-span-10 col-span-12 bg-[var(--bg-primary)] py-5 pr-2 pl-2 xl:py-5 xl:pr-8 xl:pl-0">
        <main class="min-h-[calc(100vh-var(--header-size))] rounded-3xl p-4 xl:px-5 xl:py-5 bg-[var(--bg-main)]">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>