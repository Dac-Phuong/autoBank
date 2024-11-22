<template>
    <USelectMenu v-model="type" size="lg" value-attribute="value" placeholder="Chọn quyền" :options="[
        { label: 'MEMBER', value: 0 },
        { label: 'ADMIN', value: 100 },
    ]">
        <template #label>
            <span v-if="type !== undefined">{{ typeFormat[type].label }}</span>
            <span v-else>Chọn quyền</span>
        </template>

        <template #option="{ option: option }">
            <span>{{ typeFormat[option.value].label }}</span>
        </template>
    </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const type = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const typeFormat = {
    0: { label: 'MEMBER', color: 'gray' },
    100: { label: 'ADMIN', color: 'red' },
}
</script>