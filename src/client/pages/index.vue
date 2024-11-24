<template>
    <div>
        <LayoutPublicHeader label="Tổng quan" />
        <UiFlex class="gap-2 mb-4">
            <UiText text="Thống kê tài khoản" weight="medium" color="secondary" size="lg" />
        </UiFlex>
        <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2" v-if="!!loading || !list">
            <LoadingBank v-for="i in page.size" :key="i" class="xl:col-span-3 lg:col-span-4 col-span-6" />
        </div>
        <div v-else>
            <UiEmpty v-if="list.length == 0" text="Hiện tại chưa có dữ liệu" />
            <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2 md:mb-6 mb-4" v-else>
                <LayoutPublicBankItem v-for="item in list" :key="item._id" :item="item"
                    class="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12" />
            </div>
            <UiFlex justify="center" v-if="list.length < page.total">
                <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" show-last
                    show-first />
            </UiFlex>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
const props = defineProps({
    title: String,
})
const page = ref({
    size: 12,
    current: 1,
    sort: {
        column: 'updatedAt',
        direction: 'desc'
    },
    total: 0
})
const list = ref(undefined)
const loading = ref(true)
watch(() => page.value.size, () => getBank())
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

onMounted(async () => {
    await nextTick()
    getBank()
})
</script>