<template>
    <UiContent title="User" size="2xl"  sub="Quản lý tài khoản người dùng">
        <UiFlex class="mb-4 gap-1">
            <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" />
            <UForm :state="page" @submit="page.current = 1, getList()">
                <UiFlex class="gap-1">
                    <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
                    <USelectMenu v-model="page.search.by" :options="['ACCOUNT', 'PHONE', 'MAIL']" />
                </UiFlex>
            </UForm>
        </UiFlex>
        <!-- Table -->
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0 relative' } }">
            <LoadingTable v-if="loading.load" />
            <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
                <template #username-data="{ row }">
                    {{ row.username }}
                </template>

                <template #email-data="{ row }">
                    {{ row.email || '...' }}
                </template>

                <template #phone-data="{ row }">
                    {{ row.phone || '...' }}
                </template>

                <template #coin-data="{ row }">
                    {{ useMoney().toMoney(row.coin || 0) }}
                </template>

                <template #block-data="{ row }">
                    <UBadge :color="row.block ? 'red' : 'gray'">
                        {{ row.block ? 'Khóa' : 'Không' }}
                    </UBadge>
                </template>
                <template #type-data="{ row }">
                    <UBadge :color="typeFormat[row.type].color" variant="soft">
                        {{ typeFormat[row.type].label }}
                    </UBadge>
                </template>

                <template #createdAt-data="{ row }">
                    {{ useDayJs().displayFull(row.createdAt) }}
                </template>

                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
                    </UDropdown>
                </template>
            </UTable>
        </UCard>

        <!-- Pagination -->
        <UiFlex justify="between" class="py-4">
            <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
            <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
        </UiFlex>
        <!-- Modal Edit Auth-->
        <UModal v-model="modal.editAuth" preventClose>
            <UForm :state="stateEditAuth" @submit="editAuthAction" class="p-4">
                <UFormGroup label="Email">
                    <UInput size="lg" class="mb-3" v-model="stateEditAuth.email" />
                </UFormGroup>

                <UFormGroup label="Số điện thoại">
                    <UInput size="lg" class="mb-3" v-model="stateEditAuth.phone" />
                </UFormGroup>

                <UFormGroup label="Mật khẩu">
                    <UInput size="lg" class="mb-3" v-model="stateEditAuth.password" type="password" />
                </UFormGroup>

                <UFormGroup label="Quyền" class="mb-3">
                    <SelectAuthType v-model="stateEditAuth.type" />
                </UFormGroup>

                <UFormGroup label="Khóa">
                    <SelectAuthBlock v-model="stateEditAuth.block" />
                </UFormGroup>

                <UiFlex justify="end" class="mt-4">
                    <UButton type="submit" :loading="loading.editAuth">Sửa</UButton>
                    <UButton color="gray" @click="modal.editAuth = false" :disabled="loading.editAuth" class="ml-1">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>

        <!-- Modal Edit Currency-->
        <UModal v-model="modal.editCurrency" preventClose>
            <UForm :state="stateEditCurrency" @submit="editCurrencyAction" class="p-4">
                <UFormGroup label="Xu" class="mb-3">
                    <UInput size="lg"  v-model="stateEditCurrency.coin" type="number" />
                </UFormGroup>
                <UFormGroup label="Lý do" class="mt-3">
                    <UTextarea v-model="stateEditCurrency.reason" />
                </UFormGroup>
                <UiFlex justify="end" class="mt-4">
                    <UButton type="submit" :loading="loading.editCurrency">Thêm</UButton>
                    <UButton color="gray" @click="modal.editCurrency = false" :disabled="loading.editCurrency"
                        class="ml-2">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>

    </UiContent>
</template>

<script setup>
const list = ref([])
// Loading
const loading = ref({
    load: true,
    editAuth: false,
    editCurrency: false,
    addPayment: false
})
// Modal
const modal = ref({
    user: false,
    editAuth: false,
    editCurrency: false,
    addPayment: false
})

// State
const stateEditAuth = ref({
    _id: null,
    email: null,
    phone: null,
    password: null,
    type: null,
    block: null
})

const stateEditCurrency = ref({
    _id: null,
    coin: 0,
    wheel: 0
})

const stateAddPayment = ref({
    _id: null,
    money: null
})
// Type
const typeFormat = {
    0: { label: 'MEMBER', color: 'gray' },
    100: { label: 'ADMIN', color: 'red' },
}

watch(() => modal.value.addPayment, (val) => !val && (stateAddPayment.value = {
    _id: null,
    money: null
}))

watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
    _id: null,
    coin: 0,
    wheel: 0
}))

// Actions
const actions = (row) => [
    [{
        label: 'Sửa thông tin',
        icon: 'i-bx-pencil',
        click: () => {
            Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
            modal.value.editAuth = true
        }
    }, {
        label: 'Thêm tiền tệ',
        icon: 'i-bx-coin-stack',
        click: () => {
            stateEditCurrency.value._id = row._id
            stateEditCurrency.value.type = 'plus'
            modal.value.editCurrency = true
        }
    }]
]
const columns = [
    {
        key: 'account',
        label: 'Tài khoản',
    }, {
        key: 'email',
        label: 'Email',
    },
    {
        key: 'phone',
        label: 'Số điện thoại',
    },
     {
        key: 'coin',
        label: 'Xu',
        sortable: true
    },
    {
        key: 'block',
        label: 'Khóa',
        sortable: true
    },
    {
        key: 'type',
        label: 'Quyền hạn',
    }, {
        key: 'createdAt',
        label: 'Ngày tạo',
        sortable: true
    }, {
        key: 'actions',
        label: 'Thao tác'
    }
]
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
        by: 'ACCOUNT'
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
        const data = await useAPI('admin/user/list', JSON.parse(JSON.stringify(page.value)))
        loading.value.load = false
        list.value = data.list
        page.value.total = data.total
    }
    catch (e) {
        loading.value.load = false
    }
}
const editAuthAction = async () => {
    try {
        loading.value.editAuth = true
        await useAPI('admin/user/edit/profile', JSON.parse(JSON.stringify(stateEditAuth.value)))

        loading.value.editAuth = false
        modal.value.editAuth = false
        getList()
    }
    catch (e) {
        loading.value.editAuth = false
    }
}

const editCurrencyAction = async () => {
    try {
        loading.value.editCurrency = true
        await useAPI('admin/user/edit/currency', JSON.parse(JSON.stringify(stateEditCurrency.value)))

        loading.value.editCurrency = false
        modal.value.editCurrency = false
        getList()
    }
    catch (e) {
        loading.value.editCurrency = false
    }
}

const addPaymentAction = async () => {
    try {
        loading.value.addPayment = true
        await useAPI('admin/user/add/payment', JSON.parse(JSON.stringify(stateAddPayment.value)))

        loading.value.addPayment = false
        modal.value.addPayment = false
        getList()
    }
    catch (e) {
        loading.value.addPayment = false
    }
}
getList()
</script>
