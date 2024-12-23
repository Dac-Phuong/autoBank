<template>
    <div >
       oadjsadsadasdk
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
useSeoMeta({
  title: () => "Tổng quan - ENI AutoMB",
  ogTitle: () => "Tổng quan - ENI AutoMB"
})
const list = ref(undefined)
const loading = ref(true)
const props = defineProps({
    title: String,
})
const page = ref({
    size: 8,
    current: 1,
    sort: {
        column: 'updatedAt',
        direction: 'desc'
    },
    total: 8
})

watch(() => page.value.size, () => getBank())
watch(() => page.value.current, () => getBank())
watch(() => page.value.sort, () => getBank())
const getBank = async () => {
    try {
        loading.value = true
        const data = await useAPI('client/bank/list', JSON.stringify(page.value))
        list.value = data.list
        page.value.total = data.total
        loading.value = false
    }
    catch (e) {
        loading.value = false
    }
}

getBank()
</script>