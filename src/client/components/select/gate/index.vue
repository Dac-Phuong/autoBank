<template>
    <USelectMenu v-model="type" size="lg" value-attribute="value" placeholder="Chọn loại kênh" :options="[
        { label: 'Ngân hàng', value: 0 },
        { label: 'Momo', value: 1 }]">
        <template #label>
            <span v-if="type !== undefined">{{ typeFormat[type]?.label }}</span>
            <span v-else>Chọn loại kênh</span>
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
    0: { label: 'Ngân hàng' },
    1: { label: 'Momo' },
}
</script>