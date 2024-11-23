<template>
    <USelectMenu v-model="display" size="lg" value-attribute="value" placeholder="Trạng thái" :options="[
        { label: 'Mở', value: 0 },
        { label: 'Đóng', value: 1 },
    ]">
        <template #label>
            <span v-if="display !== undefined">{{ displayFormat[display]?.label }}</span>
            <span v-else>Mở</span>
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
    0: { label: 'Mở', color: 'gray' },
    1: { label: 'Đóng', color: 'green' },
}
</script>