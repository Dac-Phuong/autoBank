<template>
  <div class="LayoutPublic relative h-full min-h-full">
    <div class="flex gap-0 min-h-full">
      <div
        class="w-[var(--nav-right-size)] relative xl:block hidden xl:sticky xl:top-0 xl:max-h-[calc(100vh)] xl:overflow-y-auto bg-[var(--bg-primary)] backdrop-blur-xl p-1 pt-5">
        <LayoutPublicNav />
      </div>
      <div class="relative w-full bg-[var(--bg-primary)] py-5 pr-2 pl-2 xl:py-5 xl:pr-8 xl:pl-0">
        <main class="min-h-[calc(102vh-var(--header-size))] rounded-3xl p-4 xl:px-5 xl:py-5 bg-[var(--bg-main)]">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>
