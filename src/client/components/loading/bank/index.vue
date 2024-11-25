<template>
    <UCard class="p-4" :ui="{
        base: 'relative transition-all ',
        rounded: 'rounded-xl',
        shadow: 'shadow-md hover:shadow-lg',
        divide: '',
        ring: 'dark:ring-1 ring-0',
        body: { padding: 'p-0 sm:p-0' },
    }">
        <UiFlex justify="between">
            <USkeleton class="rounded w-12 h-12" />
            <USkeleton class="w-32 h-6 mb-1" />
        </UiFlex>
        <div class="py-4">
            <USkeleton class="w-6 h-10" />
        </div>
        <USkeleton class="w-32 h-6 mb-1" />
    </UCard>
</template>