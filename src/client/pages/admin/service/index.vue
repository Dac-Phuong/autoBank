<template>
    <UiContent title="Service" size="2xl" sub="Quản lý dịch vụ">
        <UiFlex class="mb-4 gap-1">
            <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" />
            <UForm :state="page" @submit="page.current = 1, getList()">
                <UiFlex class="gap-1">
                    <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
                </UiFlex>
            </UForm>
        </UiFlex>
        <!-- Table -->
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0 relative' } }">
            <LoadingTable v-if="loading.load" />
            <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
                <template #user.username-data="{ row }">
                    {{ row.user.username }}
                </template>

                <template #image-data="{ row }">
                    <UiImg :src="row.image" class="w-[80px]" w="16" h="8" />
                </template>

                <template #option-data="{ row }">
                    <UiText v-if="row.option" weight="semibold">{{ useMoney().toMoney(row.option.money) }} / {{
                        row.option.number }} Tháng </UiText>
                    <UiText v-else>...</UiText>
                </template>

                <template #status-data="{ row }">
                    <UBadge :color="statusFormat[row.status].color" variant="soft">
                        {{ statusFormat[row.status].label }}
                    </UBadge>
                </template>

                <template #start_date-data="{ row }">
                    {{ row.start_date ? useDayJs().displayFull(row.start_date) : '...' }}
                </template>

                <template #expired_date-data="{ row }">
                    {{ row.expired_date ? useDayJs().displayFull(row.expired_date) : '...' }}
                </template>

            </UTable>
        </UCard>

        <!-- Pagination -->
        <UiFlex justify="between" class="py-4">
            <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
            <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
        </UiFlex>
    </UiContent>
</template>
<script setup>
const list = ref([])
// Loading
const loading = ref({
    load: true,
    options: false,
})

const statusFormat = {
    0: { label: 'Chưa kích hoạt', color: 'orange' },
    1: { label: 'Chạy', color: 'green' },
    2: { label: 'Dừng', color: 'red' },
    3: { label: 'Hết hạn', color: 'red' },
}
const columns = [
    {
        key: "user.username",
        label: "Người dùng",
    },
    {
        key: "account",
        label: "Tài khoản ngân hàng",
    },
    {
        key: "status",
        label: "Trạng thái",
    },
    {
        key: "option",
        label: "Gói kích hoạt",
    },
    {
        key: "start_date",
        label: "Ngày bắt đầu",
        sortable: true
    },
    {
        key: "expired_date",
        label: "Ngày hết hạn",
        sortable: true
    },
    {
        key: "actions",
        label: "Chức năng",
    },
];
const selectedColumns = ref([...columns])
// Page
const page = ref({
    size: 10,
    current: 1,
    sort: {
        column: 'createdAt',
        direction: 'desc'
    },
    search: {
        key: null,
    },
    total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Fetch
const getList = async () => {
    try {
        loading.value.load = true
        const data = await useAPI('admin/bank/account/list', JSON.parse(JSON.stringify(page.value)))
        loading.value.load = false
        list.value = data.list
        page.value.total = data.total
    }
    catch (e) {
        loading.value.load = false
    }
}
getList()
</script>