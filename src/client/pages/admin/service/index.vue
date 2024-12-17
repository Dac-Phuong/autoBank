<template>
    <UiContent title="Service" size="2xl" sub="Quản lý dịch vụ">
        <UiFlex class="mb-4 gap-1">
            <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" />
            <UForm :state="page" @submit="page.current = 1, getList()">
                <UiFlex class="gap-1">
                    <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
                </UiFlex>
            </UForm>
            <UButton color="primary" class="ml-auto" @click="modal.addBank = true">Thêm mới</UButton>
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
        <!-- Modal Add -->
        <UModal v-model="modal.addBank" preventClose>
            <UForm :state="stateAddBank" @submit="addBankAction" class="p-4">
                <UFormGroup label="Tên ngân hàng">
                    <UInput size="lg" class="mb-3" v-model="stateAddBank.name" />
                </UFormGroup>
                <UFormGroup label="hình ảnh" class="mb-3">
                    <UiUploadImage v-model="stateAddBank.image">
                        <template #default="{ select, loading }">
                            <UInput size="lg" :model-value="stateAddBank.image" :loading="loading" readonly
                                @click="select" />
                        </template>
                    </UiUploadImage>
                </UFormGroup>

                <UFormGroup label="Trạng thái" class="mb-3">
                    <SelectStatus v-model="stateAddBank.status" />
                </UFormGroup>

                <UFormGroup label="Hiển thị" class="mb-3">
                    <SelectDisplay v-model="stateAddBank.display" />
                </UFormGroup>
                <UiFlex justify="end" class="mt-4">
                    <UButton type="submit" :loading="loading.addBank">Lưu</UButton>
                    <UButton color="gray" @click="modal.addBank = false" :disabled="loading.addBank" class="ml-1">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>
        <!-- Modal Edit -->
        <UModal v-model="modal.editBank" preventClose>
            <UForm :state="stateEditBank" @submit="editBankAction" class="p-4">
                <UFormGroup label="Tên ngân hàng">
                    <UInput size="lg" class="mb-3" v-model="stateEditBank.name" />
                </UFormGroup>
                <UFormGroup label="hình ảnh" class="mb-3">
                    <UiUploadImage v-model="stateEditBank.image">
                        <template #default="{ select, loading }">
                            <UInput size="lg" :model-value="stateEditBank.image" :loading="loading" readonly
                                @click="select" />
                        </template>
                    </UiUploadImage>
                </UFormGroup>

                <UFormGroup label="Trạng thái" class="mb-3">
                    <SelectStatus v-model="stateEditBank.status" />
                </UFormGroup>

                <UFormGroup label="Hiển thị" class="mb-3">
                    <SelectDisplay v-model="stateEditBank.display" />
                </UFormGroup>
                <UiFlex justify="end" class="mt-4">
                    <UButton type="submit" :loading="loading.editBank">Lưu</UButton>
                    <UButton color="gray" @click="modal.editBank = false" :disabled="loading.editBank" class="ml-1">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>
        <!-- Modal Edit -->
        <UModal v-model="modal.editOptions" preventClose>
            <UForm :state="stateOptions" @submit="editOptions" class="p-4">
                <UiText class="mb-1 text-gray-600" weight="bold">Thông tin giá thuê</UiText>
                <UiFlex class="align-center pt-2" v-for="(item, index) in stateOptions.options" :key="index">

                    <UInput v-model="item.number" required type="number" class="w-2/4 mb-2"
                        placeholder="Nhập số tháng" />
                    <UInput v-model="item.money" type="number" required class="w-3/4 mb-2 ml-2"
                        placeholder="Nhập giá tiền" />

                    <UButton type="button" icon="i-heroicons-trash" @click="stateOptions.options.splice(index, 1)"
                        color="red" class="ml-2 mb-2 w-[40px] h-[40px] flex items-center justify-center" />
                </UiFlex>

                <UiFlex class="mt-4 align-center">
                    <UButton type="button" size="sm" @click="stateOptions.options.push({ number: '', money: '' })"
                        color="primary" class="ml-2 mt-2 flex items-center justify-center">Thêm</UButton>
                    <UiFlex class="ml-auto">
                        <UButton type="submit" :loading="loading.options">Lưu</UButton>
                        <UButton color="gray" @click="modal.editOptions = false" :disabled="loading.options"
                            class="ml-1"> Đóng
                        </UButton>
                    </UiFlex>
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
    addBank: false,
    editBank: false,
    options: false,
})
// Modal
const modal = ref({
    addBank: false,
    editBank: false,
    editOptions: false,
})

watch(() => modal.value.addBank, (val) => !val && (stateAddBank.value = {
    name: null,
    image: null,
    status: undefined,
    display: true,
}))

// State
const stateAddBank = ref({
    name: null,
    image: null,
    status: undefined,
    display: true,
})
const stateEditBank = ref({
    _id: null,
    name: null,
    image: null,
    status: undefined,
    display: undefined,
})
const stateOptions = ref({
    _id: null,
    options: [{
        number: '',
        money: ''
    }],
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
        by: 'NAME'
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