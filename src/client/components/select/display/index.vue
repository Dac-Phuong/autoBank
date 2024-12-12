<template>
    <USelectMenu v-model="display" size="lg" value-attribute="value" placeholder="Hiển thị" :options="[
        { label: 'Hiện', value: true },
        { label: 'Ẩn', value: false },
    ]">
        <template #label>
            <span v-if="display !== undefined">{{ displayFormat[display]?.label }}</span>
            <span v-else>Hiện</span>
        </template>

        <template #option="{ option: option }">
            <span>{{ displayFormat[option.value].label }}</span>
        </template>
    </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const display = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const displayFormat = {
    true: { label: 'Hiện', color: 'gray' },
    false: { label: 'Ẩn', color: 'green' },
}
</script>