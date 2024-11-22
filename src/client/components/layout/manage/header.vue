<template>
    <header class="
      sticky top-0 z-50 
      bg-white/75 dark:bg-gray-900 backdrop-blur-xl
      border-b border-gray-200 dark:border-gray-800
      px-4">
        <UiFlex class="h-[var(--header-size)] max-h-[var(--header-size)]">
            <LayoutPublicNavSlide class="mr-2 " />
            <UiFlex class="hidden md:flex">
                <NuxtLink to="/">
                    <UiLogo color="primary"/>
                </NuxtLink>
            </UiFlex>
            <UiFlex justify="end" items="center" class="gap-1 ml-auto">
                <!-- <Setting /> -->
                <UiFlex justify="end" items="center" class="ml-auto gap-1">
                    <LazyAuthSign v-if="!authStore.isLogin" />
                    <LazyAuthHearder v-else />
                </UiFlex>
            </UiFlex>
        </UiFlex>
    </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>