<template>
    <UiContent title="Bank" no-dot sub="Quản lý ngân hàng">
        <UiFlex class="mb-4 gap-1">
            <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" />
            <UForm :state="page" @submit="page.current = 1, getList()">
                <UiFlex class="gap-1">
                    <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
                </UiFlex>
            </UForm>
            <UButton color="gray" class="ml-auto" @click="modal.addBank = true">Thêm mới</UButton>
        </UiFlex>
        <!-- Table -->
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0 relative' } }">
            <LoadingTable v-if="loading.load" />
            <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
                <template #name-data="{ row }">
                    {{ row.name }}
                </template>

                <template #image-data="{ row }">
                    {{ row.image || '...' }}
                </template>

                <template #status-data="{ row }">
                    {{ row.status || '...' }}
                </template>

                <template #display-data="{ row }">
                    <UBadge :color="row.display ? 'red' : 'gray'">
                        {{ row.display ? 'Khóa' : 'Không' }}
                    </UBadge>
                </template>

                <template #updatedAt-data="{ row }">
                    {{ useDayJs().displayFull(row.updatedAt) }}
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
        <!-- Modal Add Auth-->
        <UModal v-model="modal.addBank" preventClose>
            <UForm :state="stateAddBank" @submit="addBankAction" class="p-4">
                <UFormGroup label="Tên ngân hàng">
                    <UInput size="lg" class="mb-3" v-model="stateAddBank.name" />
                </UFormGroup>
                <UFormGroup label="hình ảnh">
                    <UInput size="lg" class="mb-3" v-model="stateAddBank.image" />
                </UFormGroup>

                <UFormGroup label="Hoạt động">
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
        <!-- Modal Edit Auth-->
        <!-- <UModal v-model="modal.editAuth" preventClose>
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
        </UModal> -->

    </UiContent>
</template>
<script setup>
const list = ref([])
// Loading
const loading = ref({
    load: true,
    addBank: false,
    editBank: false,
})
// Modal
const modal = ref({
    addBank: false,
    editBank: false,
})

watch(modal.value.addBank, () => {
    console.log(modal.value.addBank);
    
})
// State
const stateAddBank = ref({
    name: null,
    image: null,
    status: null,
    display: null,
})
const stateEditBank = ref({
    _id: null,
    name: null,
    image: null,
    status: null,
    display: null,
})
const actions = (row) => [
    [{
        label: 'Sửa thông tin',
        icon: 'i-bx-pencil',
        click: () => {
            Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
            modal.value.editAuth = true
        }
    }, {
        label: 'Xóa ',
        icon: 'i-bx-trash',
        click: () => {
            stateEditCurrency.value._id = row._id
            stateEditCurrency.value.type = 'plus'
            modal.value.editCurrency = true
        }
    }]
]
const columns = [
    {
        key: 'name',
        label: 'Tên ngân hàng',
    }, {
        key: 'image',
        label: 'Hình ảnh',
    },
    {
        key: 'status',
        label: 'Trạng thái',
    },
     {
        key: 'display',
        label: 'Hiện',
    },
    {
        key: 'updatedAt',
        label: 'Ngày cập nhật',
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
        const data = await useAPI('admin/user/list', JSON.parse(JSON.stringify(page.value)))
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