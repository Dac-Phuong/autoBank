<template>
    <div >
        <LayoutPublicHeader label="Tổng quan" />
        <UiContent title="Thống kê tài khoản" sub="Danh sách các ngân hàng" class="mt-3" size="xl" no-dot>
            <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2" v-if="!!loading || !list">
                <LoadingBank v-for="i in page.size" :key="i" class="xl:col-span-3 lg:col-span-4 col-span-6" />
            </div>
            <div v-else>
                <UiEmpty v-if="list.length == 0" text="Hiện tại chưa có dữ liệu" />
                <div class="grid grid-cols-12 lg:gap-6 md:gap-4 gap-2 md:mb-6 mb-4" v-else>
                    <ServiceBankItem v-for="item in list" :key="item._id" :item="item" class="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12" />
                </div>
                <UiFlex justify="center" v-if="list.length > 12">
                    <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" show-last show-first />
                </UiFlex>
            </div>
        </UiContent>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
const list = ref(undefined)
const loading = ref(true)
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