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

                <template #bank-data="{ row }">
                    <UBadge variant="soft">{{ row.bank.name }}</UBadge>
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

                <template #actions-data="{ row }">
                    <UDropdown v-if="row.status !== 0" :items="actions(row)">
                        <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
                    </UDropdown>
                    <UButton v-else @click="getOption(row.bank.options, row._id)">Kích hoạt</UButton>
                </template>
            </UTable>
        </UCard>

        <!-- Pagination -->
        <UiFlex justify="between" class="py-4">
            <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
            <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
        </UiFlex>
        <!-- Modal -->
        <UModal v-model="modal.active">
            <UCard>
                <template #default>
                    <UForm :state="state">
                        <UiText class="pb-5" weight="semibold">Chọn gói kích hoạt</UiText>
                        <div v-if="packages && packages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="(option, index) in packages" :key="index" @click="selectOption(option, index)"
                                class="relative flex flex-col items-center p-6 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out"
                                :class="[selectedOption === index ? 'border-primary-500 bg-primary-50' : 'border-gray-400 bg-gray-50']">
                                <UiFlex class="items-center justify-center">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                                        :class="[selectedOption === index ? 'border-primary-500' : 'border-gray-500']">
                                        <UiText v-if="selectedOption === index"
                                            class="w-2.5 h-2.5 rounded-full bg-primary-600"></UiText>
                                    </div>
                                </UiFlex>
                                <UiText class="text-sm text-gray-800 font-semibold text-center mt-2">
                                    {{ option.number }} Tháng
                                </UiText>
                                <UiText class="text-sm text-gray-800 font-semibold text-center">
                                    {{ useMoney().toMoney(option.money) }} xu
                                </UiText>
                            </div>
                        </div>
                        <UiEmpty v-else text="Chưa có dữ liệu gói" />
                    </UForm>
                </template>
                <template #footer>
                    <UiFlex justify="end" class="mt-4 mb-2">
                        <UButton color="gray" class="border border-gray-200" @click="modal.active = false">Đóng</UButton>
                        <UButton class="ml-2" type="submit" :loading="loading.edit" @click="activeAction">Xác nhận</UButton>
                    </UiFlex>
                </template>
            </UCard>
        </UModal>
    </UiContent>
</template>
<script setup>
const list = ref([])
const packages = ref([])
const selectedOption = ref(undefined)

// Loading
const loading = ref({
    load: true,
    active: false,
})
const modal = ref({
    active: false,
})
const state = ref({
    _id: null,
    option: null,
})
const getOption = (options, _id) => {
    packages.value = options;
    modal.value.active = true;
    state.value._id = _id
}
const selectOption = (option, index) => {
    selectedOption.value = index
    state.value.option = option
}
// Actions
const actions = (row) => [
    [{
        label: 'Hủy gói',
        icon: 'material-symbols:cancel',
        click: () => cancelAction(row._id)
    }, {
        label: row.status == 1 ? 'Dừng auto' : 'Chạy auto',
        icon: row.status == 1 ? 'iconamoon:player-stop-bold' : 'iconamoon:player-start-bold',
        click: () => runAction(row._id)
    }]
]
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
        key: "bank",
        label: "Ngân hàng",
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

const cancelAction = async (_id) => {
    try {
        loading.value.load = true
        await useAPI('admin/bank/account/cancel', { _id })
        loading.value.load = false
        getList()
    }
    catch (e) {
        loading.value.load = false
    }
}
const runAction = async (_id) => {
    try {
        loading.value.load = true
        await useAPI('admin/bank/account/run', { _id })
        loading.value.load = false
        getList()
    }
    catch (e) {
        loading.value.load = false
    }
}
const activeAction = async () => {
    try {
        loading.value.active = true;
        await useAPI("admin/bank/account/active", JSON.parse(JSON.stringify(state.value)));
        loading.value.active = false;
        modal.value.active = false;
        getList();
        state.value._id = null;
        state.value.option = null;
        selectedOption.value = undefined;
    } catch (e) {
        loading.value.active = false;
    }
}
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