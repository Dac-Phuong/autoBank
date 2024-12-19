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
                    <UiFlex>
                        <UiText weight="bold" size="2xl" color="primary" class="italic">ENI</UiText>
                        <UiText color="primary" class="ml-1 pt-1.5 italic" size="sm" weight="semibold">AUTOBANK </UiText>
                    </UiFlex>
                </NuxtLink>
            </UiFlex>
            <UiFlex justify="end" items="center" class="gap-1 ml-auto">
                <!-- <Setting /> -->
                <UiFlex justify="end" items="center" class="ml-auto gap-1">
                    <LazyAuthHearder />
                </UiFlex>
            </UiFlex>
        </UiFlex>
    </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>