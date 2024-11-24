<template>
    <LayoutPublicHeader :label="`Danh sách tài khoản ${(route.params.slug as string).toUpperCase()}`" />
    <UiContent title="Danh sách tài khoản" no-dot>
        <UiFlex class="mb-4" justify="between">
            <UiFlex>
                <USelectMenu v-model="page.size" :options="[5, 10, 20, 50, 100]" class="mr-2" />
                <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
            </UiFlex>

            <UButton color="primary" icon="i-bx-plus" class="ml-2" @click="modal.add = true">Thêm mới </UButton>
        </UiFlex>
        <!-- Table -->
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" class="relative">
            <LoadingTable v-if="loading.load" />
            <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
                <template #name-data="{ row }">
                    <UiText >{{ row.name }}</UiText>
                </template>

                <template #display-data="{ row }">
                    <UBadge :color="row.display ? 'green' : 'gray'" variant="soft">{{ row.display ? "Hiện" : "Ẩn" }}
                    </UBadge>
                </template>

                <template #createdAt-data="{ row }">
                    {{ useDayJs().displayFull(row.createdAt) }}
                </template>
                <template #updatedAt-data="{ row }">
                    {{ useDayJs().displayFull(row.updatedAt) }}
                </template>

                <template #actions-data="{ row }">
                    <UDropdown :items="actions(row)">
                        <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del" />
                    </UDropdown>
                </template>
            </UTable>
        </UCard>

        <!-- Pagination -->
        <UiFlex justify="between" class="py-4">
            <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
            <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
        </UiFlex>

        <!-- Modal Add -->
        <UModal v-model="modal.add" preventClose>
            <UForm :state="stateAdd" @submit="addAction" class="p-4">
                 <UFormGroup class="mb-3" label="Số tài khoản">
                    <UInput size="lg" v-model="stateAdd.number" placeholder="Nhập số tài khoản" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Tài khoản đăng nhập">
                    <UInput size="lg" v-model="stateAdd.name" placeholder="Nhập Username" />
                </UFormGroup>
                <UFormGroup class="mb-3" label="Mật khẩu đăng nhập">
                    <UInput size="lg" v-model="stateAdd.password" type="password" placeholder="Nhập Password" />
                </UFormGroup>
                <UiFlex>
                      <UCheckbox v-model="stateAdd.policy" class="cursor-pointer" name="notifications" label="Bạn đồng ý với chính sách bảo mật của chúng tôi và cho phép chúng tôi truy xuất dữ liệu tài chính của bạn." />
                </UiFlex>
                <UiFlex justify="end" class="mt-6">
                    <UButton type="submit" :loading="loading.add">Thêm</UButton>
                    <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
                </UiFlex>
            </UForm>
        </UModal>

        <!-- Modal Edit -->
        <UModal v-model="modal.edit" preventClose>
            <UForm :state="stateEdit" @submit="editAction" class="p-4">
                <UFormGroup class="mb-3" label="Số tài khoản">
                    <UInput size="lg" v-model="stateEdit.number" placeholder="Nhập số tài khoản" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Tài khoản đăng nhập">
                    <UInput size="lg" v-model="stateEdit.name" placeholder="Nhập Username" />
                </UFormGroup>

                <UFormGroup class="mb-3" label="Mật khẩu đăng nhập">
                    <UInput size="lg" v-model="stateEdit.password" type="password" placeholder="Nhập Password" />
                </UFormGroup>

                
                <UiFlex justify="end" class="mt-6">
                    <UButton type="submit" :loading="loading.edit">Sửa</UButton>
                    <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng
                    </UButton>
                </UiFlex>
            </UForm>
        </UModal>
    </UiContent>
</template>

<script setup lang="ts">
const route = useRoute();
const news = ref(undefined);
const list = ref(undefined);

// Columns
const columns = [
    {
        key: "name",
        label: "Tài khoản",
        sortable: true

    },
    {
        key: "number",
        label: "Số tài khoản",
        sortable: true
    },
    {
        key: "status",
        label: "Trạng thái",
        sortable: true

    },
    {
        key: "createdAt",
        label: "Thời gian thêm",
        sortable: true
    },
    {
        key: "updatedAt",
        label: "Lần chạy gần nhất",
        sortable: true
    },
    {
        key: "actions",
        label: "Chức năng",
    },
];
const selectedColumns = ref([...columns]);

// Page
const page = ref({
    slug: route.params.slug,
    size: 10,
    current: 1,
    sort: {
        column: "updatedAt",
        direction: "desc",
    },
    search: {
        key: undefined,
        by: 'NAME'
    },
    total: 0,
});
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
    slug : route.params.slug,
    password: undefined,
    name: undefined,
    number: undefined,
});

const stateEdit = ref({
    _id: null,
    password: undefined,
    name: undefined,
    number: undefined,
});

// Modal
const modal = ref({
    add: false,
    edit: false,
});

watch(() => modal.value.add,(val) =>!val && (stateAdd.value = {
        password: undefined,
        name: undefined,
        number: undefined,
    })
);

// Loading
const loading = ref({
    load: true,
    add: false,
    edit: false,
    extend: false,
    del: false,
});


// Actions
const actions = (row:any) => [
    [{
        label: 'Sửa thông tin',
        icon: 'i-bx-pencil',
        click: () => {
            Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key]);
            modal.value.edit = true
        }
    }, {
        label: 'Xóa ',
        icon: 'i-bx-trash',
        click: () =>  deleteAction(row._id)
    }]
]
// Fetch
const getList = async () => {
    try {
        loading.value.load = true;
        const data = await useAPI("client/bank/account/list",JSON.parse(JSON.stringify(page.value)));
        loading.value.load = false;
        list.value = data.list;
        news.value = data;
    } catch (e) {
        loading.value.load = false;
    }
};

const addAction = async () => {
    try {
        loading.value.add = true;
        await useAPI("client/bank/account/add", JSON.parse(JSON.stringify(stateAdd.value)));
        loading.value.add = false;
        modal.value.add = false;
        getList();
    } catch (e) {
        loading.value.add = false;
    }
};
const editAction = async () => {
    try {
        loading.value.add = true;
        await useAPI("client/bank/account/edit", JSON.parse(JSON.stringify(stateAdd.value)));
        loading.value.add = false;
        modal.value.add = false;
        getList();
    } catch (e) {
        loading.value.add = false;
    }
};
const deleteAction = async (_id: object)=>{
    try {
        loading.value.add = true;
        await useAPI("client/bank/account/del",{_id});
        loading.value.add = false;
        modal.value.add = false;
        getList();
    } catch (e) {
        loading.value.add = false;
    }
}
getList()
</script>
