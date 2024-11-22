<template>
    <USelectMenu v-model="block" size="lg" value-attribute="value" placeholder="Khóa" :options="[
        { label: 'Khóa', value: true },
        { label: 'Không', value: false },
    ]">
        <template #label>
            <span v-if="block !== undefined">{{ blockFormat[block].label }}</span>
            <span v-else>Không</span>
        </template>

        <template #option="{ option: option }">
            <span>{{ blockFormat[option.value].label }}</span>
        </template>
    </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const block = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const blockFormat = {
    false: { label: 'Không', color: 'green' },
    true: { label: 'Khóa', color: 'gray' },
}
</script>