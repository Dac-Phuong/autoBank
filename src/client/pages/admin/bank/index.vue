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
                    <UiImg :src="row.image" class="w-[80px]" w="16" h="8" />
                </template>

                <template #status-data="{ row }">
                    <UBadge :color="row.status == 1 ? 'red' : 'primary'"  variant="soft">
                        {{ row.status == 1 ? 'Đóng' : 'Mở' }}
                    </UBadge>
                </template>

                <template #display-data="{ row }">
                    <UBadge :color="row.display ? 'red' : 'gray'"  variant="soft">
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
        <!-- Modal Edit Auth-->
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

watch(() => modal.value.addBank, (val) => !val && (stateAddBank.value = {
    name: null,
    image: null,
    status: undefined,
    display: undefined,
}))
// State
const stateAddBank = ref({
    name: null,
    image: null,
    status: undefined,
    display: undefined,
})
const stateEditBank = ref({
    _id: null,
    name: null,
    image: null,
    status: undefined,
    display: undefined,
})
const actions = (row) => [
    [{
        label: 'Sửa thông tin',
        icon: 'i-bx-pencil',
        click: () => {
            Object.keys(stateEditBank.value).forEach(key => stateEditBank.value[key] = row[key])
            modal.value.editBank = true
        }
    }, {
        label: 'Xóa ',
        icon: 'i-bx-trash',
        click: () =>  deleteBankAction(row._id)
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
        const data = await useAPI('admin/bank/list', JSON.parse(JSON.stringify(page.value)))
        loading.value.load = false
        list.value = data.list
        page.value.total = data.total
    }
    catch (e) {
        loading.value.load = false
    }
}
const addBankAction = async () => {
    try {
        loading.value.addBank = true
        await useAPI('admin/bank/add', JSON.parse(JSON.stringify(stateAddBank.value)))
        loading.value.addBank = false
        modal.value.addBank = false
        getList()
    }
    catch (e) {
        loading.value.addBank = false
    }
}
const editBankAction = async () => {
    try {
        loading.value.editBank = true
        await useAPI('admin/bank/edit', JSON.parse(JSON.stringify(stateEditBank.value)))
        loading.value.editBank = false
        modal.value.editBank = false
        getList()
    }
    catch (e) {
        loading.value.editBank = false
    }
}
const deleteBankAction = async (_id) => {
    try {
        loading.value.editBank = true
        await useAPI('admin/bank/del',{_id})
        loading.value.editBank = false
        modal.value.editBank = false
        getList()
    }
    catch (e) {
        loading.value.editBank = false
    }
}
getList()
</script>