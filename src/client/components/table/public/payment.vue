<template>
    <UiContent title="Danh sách giao dịch" no-dot sub="Danh sách giao dịch nạp tiền">
        <UCard :ui="{
            body: { padding: 'p-0 sm:p-0' },
            header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
            footer: { padding: 'p-2 sm:p-2' },
        }">
            <template #header>
                <UiFlex>
                    <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-1" />
                    <UForm @submit="getList" class="max-w-[9rem] ml-auto">
                        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm">
                        </UInput>
                    </UForm>
                </UiFlex>
            </template>

            <LoadingTable v-if="loading.load" />

            <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
                <template #code-data="{ row }">
                    <UiText color="primary" weight="semibold" pointer @click="viewPay(row.gate._id, row.code, row.money)">{{ row.code }}
                    </UiText>
                </template>

                <template #gate-data="{ row }">
                    <UBadge variant="soft" color="gray">{{ row.gate.name }}</UBadge>
                </template>

                <template #money-data="{ row }">
                    <UiText weight="semibold">{{ toMoney(row.money) }}</UiText>
                </template>
                <template #number-data="{ row }">
                    <UiText weight="semibold">{{ row.number }} Tháng</UiText>
                </template>

                <template #end_time-data="{ row }">
                    {{ row.status == 1 ? useDayJs().displayFull(row.end_time) : '...' }}
                </template>

                <template #status-data="{ row }">
                    <UBadge :color="statusFormat[row.status].color" variant="soft">
                        {{ statusFormat[row.status].label }}
                    </UBadge>
                </template>

                <template #createdAt-data="{ row }">
                    {{ useDayJs().displayFull(row.createdAt) }}
                </template>

                <template #action-data="{ row }">
                    <UButton v-if="row.status == 0" color="gray" size="xs" @click="openUndo(row)">Hủy</UButton>
                    <span v-if="row.status == 1">...</span>
                    <span v-if="row.status == 2">...</span>
                </template>
            </UTable>

            <template #footer>
                <UiFlex justify="end">
                    <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total"
                        :max="5" />
                </UiFlex>
            </template>
        </UCard>

        <!-- Modal View -->
        <UModal v-model="modal.payment" prevent-close>
            <ServiceGateView :state="statePayment" class="p-4" />
            <UiFlex justify="end" class="px-4 pb-4">
                <UButton color="gray" @click="modal.payment = false">Đóng</UButton>
            </UiFlex>
        </UModal>

        <!-- Modal Undo -->
        <UModal v-model="modal.undo" prevent-close>
            <UForm @submit="undoAction" class="p-4">
                <UFormGroup label="Mã giao dịch">
                    <UInput :model-value="stateUndo.code" readonly />
                </UFormGroup>

                <UFormGroup label="Lý do hủy">
                    <UTextarea v-model="stateUndo.reason" />
                </UFormGroup>

                <UiFlex justify="end" class="mt-4">
                    <UButton type="submit" :loading="loading.undo">Xác nhận</UButton>
                    <UButton color="gray" @click="modal.undo = false" :disabled="loading.undo" class="ml-1">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>

    </UiContent>
</template>

<script setup>
const route = useRoute()
const { toMoney } = useMoney()

const loading = ref({
    load: true,
    undo: false,
})

const modal = ref({
    order: false,
    undo: false,
    show: false
})

const list = ref([])

const columns = [
    {
        key: 'code',
        label: 'Mã',
    }, {
        key: 'gate',
        label: 'Kênh',
    }, {
        key: 'status',
        label: 'Trạng thái',
        sortable: true
    }, {
        key: 'money',
        label: 'Tổng tiền',
        sortable: true
    }, {
        key: 'createdAt',
        label: 'Thời gian tạo',
        sortable: true
    },

    {
        key: 'action',
        label: 'Hành động',
    }
]
const page = ref({
    size: 5,
    current: 1,
    sort: {
        column: 'createdAt',
        direction: 'desc'
    },
    search: {
        key: null,
        by: 'code'
    },
    range: {
        start: null,
        end: null
    },
    total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
    if (!!val && !!page.value.range.end) return getList()
    if (!val && !page.value.range.end) return getList()
})
watch(() => page.value.range.end, (val) => {
    if (!!val && !!page.value.range.start) return getList()
    if (!val && !page.value.range.start) return getList()
})

const statusFormat = {
    0: { label: 'Chờ thanh toán', color: 'orange' },
    1: { label: 'Thành công', color: 'green' },
    2: { label: 'Từ chối', color: 'red' },
}

const statePayment = ref({
    _id: null,
    code: null,
    money: null
})
const stateUndo = ref({
    _id: null,
    code: null,
    reason: null
})

const openUndo = (row) => {
    stateUndo.value._id = row._id
    stateUndo.value.code = row.code
    modal.value.undo = true
}

const viewPay = (_id, code, money) => {
    statePayment.value = {
        _id,
        code: code,
        money: money
    }
    modal.value.payment = true
}

const undoAction = async () => {
    try {
        loading.value.undo = true
        await useAPI('client/payment/undo', JSON.parse(JSON.stringify(stateUndo.value)))
        loading.value.undo = false
        modal.value.undo = false
        getList()
    }
    catch (e) {
        loading.value.undo = false
    }
}

const getList = async () => {
    try {
        loading.value.load = true
        const data = await useAPI('client/payment/list', JSON.parse(JSON.stringify(page.value)))
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